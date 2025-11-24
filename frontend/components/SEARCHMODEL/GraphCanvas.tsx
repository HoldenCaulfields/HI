import React, { useEffect, useRef, useCallback } from 'react';
import { DesignSystem } from './ThemeEngine';
import { GraphNode, GraphLink } from '@/types/types';
import { Socket } from 'socket.io-client';

interface GraphCanvasProps {
  theme: DesignSystem;
  physicsState: React.MutableRefObject<{ nodes: GraphNode[], links: GraphLink[] }>;
  selectedNode: GraphNode | null;
  dragNode: React.MutableRefObject<GraphNode | null>;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  setSelectedNode: (node: GraphNode | null) => void;
  setChatNode: (node: GraphNode | null) => void;
  setAnswerNode: (node: GraphNode | null) => void;
  socket: Socket | null;
  query: string;
}

// Default Physics Config
const DEFAULT_PHYSICS = {
  K_REPULSION: 2500,
  K_SPRING: 0.005,
  SPRING_LEN: 120,
  DAMPING: 0.90,
  CENTER_PULL: 0.003,
  DISTANCE_THRESHOLD: 400
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  theme, physicsState, selectedNode, dragNode, isDragging, setIsDragging,
  setSelectedNode, setChatNode, setAnswerNode, socket, query
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  // Refs for physics config to allow dynamic updates without re-renders
  const physicsConfig = useRef({ ...DEFAULT_PHYSICS });

  // --- LOGIC CANVAS & ANIMATION (Physics & Draw) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: alpha false if background is opaque
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        const dpr = window.devicePixelRatio || 1;

        // Adjust physics for mobile to reduce clutter and improve performance
        if (width < 640) {
          physicsConfig.current = {
            K_REPULSION: 1500, // Less repulsion
            K_SPRING: 0.008,   // Tighter springs
            SPRING_LEN: 80,    // Shorter links
            DAMPING: 0.90,
            CENTER_PULL: 0.005, // Stronger pull to center
            DISTANCE_THRESHOLD: 300
          };
        } else {
          physicsConfig.current = { ...DEFAULT_PHYSICS };
        }

        // High-DPI Scaling
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      // Get logical size (css pixels)
      const width = parseFloat(canvas.style.width); 
      const height = parseFloat(canvas.style.height);
      
      const { nodes, links } = physicsState.current;
      const time = Date.now() - startTimeRef.current;
      const { K_REPULSION, K_SPRING, SPRING_LEN, DAMPING, CENTER_PULL, DISTANCE_THRESHOLD } = physicsConfig.current;

      // 1. Draw Background
      // Optimization: Draw simple rect first
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, theme.bgStart);
      grad.addColorStop(1, theme.bgEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      
      // Draw theme specific background elements
      theme.drawBackground(ctx, width, height, time);

      // 2. Physics Engine
      // Optimization: Pre-calculate constants
      const cx = width / 2;
      const cy = height / 2;

      nodes.forEach(node => {
        if (node === dragNode.current) return;

        let fx = 0, fy = 0;
        
        // Repulsion
        for (let i = 0; i < nodes.length; i++) {
          const other = nodes[i];
          if (node === other) continue;
          
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          // Optimization: manual squared distance check
          const distSq = dx * dx + dy * dy || 1;
          
          if (distSq < DISTANCE_THRESHOLD * DISTANCE_THRESHOLD) {
            const dist = Math.sqrt(distSq);
            const force = K_REPULSION / distSq;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        }

        // Center Gravity
        fx += (cx - node.x) * CENTER_PULL;
        fy += (cy - node.y) * CENTER_PULL;

        // Apply
        node.vx = (node.vx + fx) * DAMPING;
        node.vy = (node.vy + fy) * DAMPING;
      });

      // Spring Forces
      links.forEach(link => {
        // Optimization: Direct array access is faster than find() if we had indices, 
        // but sticking to find() for safety with current data structure.
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - SPRING_LEN) * K_SPRING;
          
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (source !== dragNode.current) {
            source.vx += fx;
            source.vy += fy;
          }
          if (target !== dragNode.current) {
            target.vx -= fx;
            target.vy -= fy;
          }
        }
      });

      // Position Updates & Bounds
      const padding = 20;
      nodes.forEach(node => {
        if (node !== dragNode.current) {
          node.x += node.vx;
          node.y += node.vy;
        }
        // Hard bounds to keep nodes on screen
        node.x = Math.max(padding, Math.min(width - padding, node.x));
        node.y = Math.max(padding, Math.min(height - padding, node.y));
      });

      // 3. Draw Links
      ctx.strokeStyle = theme.linkColor;
      ctx.lineWidth = 1;
      ctx.beginPath(); // Batch path drawing for performance
      links.forEach(link => {
        const s = nodes.find(n => n.id === link.source);
        const t = nodes.find(n => n.id === link.target);
        if (s && t) {
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(t.x, t.y);
        }
      });
      ctx.stroke();

      // 4. Draw Nodes & Labels
      // Mobile Optimization: Adjust font size dynamically
      const isSmallScreen = width < 640;
      
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        theme.drawNode(ctx, node, isSelected);

        ctx.fillStyle = isSelected ? theme.primaryColor : theme.accentColor;
        ctx.font = `bold ${node.type === 'ROOT' ? (isSmallScreen ? 12 : 14) : (isSmallScreen ? 9 : 11)}px ${theme.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const labelYOffset = node.radius + (isSmallScreen ? 4 : 8); 
        ctx.fillText(node.label, node.x, node.y + labelYOffset);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, physicsState, selectedNode, dragNode]);

  // --- INTERACTION HANDLERS (Unified Mouse & Touch) ---

  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    const { nodes } = physicsState.current;
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Larger hit area for touch
    const hitSlop = 10; 

    const clicked = nodes.find(n => {
      const dist = Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2);
      return dist < (n.radius + hitSlop);
    });

    if (clicked) {
      dragNode.current = clicked;
      setSelectedNode(clicked);
      setIsDragging(true);

      if (clicked.type === 'USER' || clicked.type === 'GROUP') {
        setChatNode(clicked);
        setAnswerNode(null);
      } else if (clicked.type === 'ANSWER') {
        setAnswerNode(clicked);
        setChatNode(null);
      }
    } else {
      setSelectedNode(null);
      setChatNode(null);
      setAnswerNode(null);
    }
  }, [physicsState, dragNode, setSelectedNode, setIsDragging, setChatNode, setAnswerNode]);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !dragNode.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    dragNode.current.x = clientX - rect.left;
    dragNode.current.y = clientY - rect.top;
    dragNode.current.vx = 0;
    dragNode.current.vy = 0;

    if (socket) {
      socket.emit('move_node', {
        query,
        nodeId: dragNode.current.id,
        x: dragNode.current.x,
        y: dragNode.current.y
      });
    }
  }, [isDragging, socket, query, dragNode]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    dragNode.current = null;
  }, [setIsDragging, dragNode]);

  // Mouse Handlers
  const onMouseDown = (e: React.MouseEvent) => handlePointerDown(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => handlePointerMove(e.clientX, e.clientY);
  const onMouseUp = () => handlePointerUp();

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    // Prevent default to stop scrolling while trying to drag
    // Note: 'touch-action: none' in CSS is preferred but we do this too
    const touch = e.touches[0];
    handlePointerDown(touch.clientX, touch.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePointerMove(touch.clientX, touch.clientY);
  };
  const onTouchEnd = () => handlePointerUp();

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      style={{ touchAction: 'none' }} // CRITICAL for mobile drag
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
};

export default GraphCanvas;