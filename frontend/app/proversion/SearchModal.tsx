'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatOverlay from '../components/Chat';
import AnswerOverlay from '../components/AnswerOverlay';

// Types
enum NodeType {
  ROOT = 'ROOT',
  USER = 'USER',
  GROUP = 'GROUP',
  ANSWER = 'ANSWER'
}

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  details?: string;
}

interface GraphLink {
  source: string;
  target: string;
}

interface ThemeConfig {
  background?: string;
  bgGradient?: string;
  lineColor: string;
  fontColor: string;
  particleColor?: string;
  vibeDescription: string;
  nodeColors: {
    ROOT: string;
    USER: string;
    GROUP: string;
    ANSWER: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, query }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const physicsState = useRef<{ nodes: GraphNode[], links: GraphLink[], theme: ThemeConfig | null }>({
    nodes: [],
    links: [],
    theme: null
  });
  const [uiTheme, setUiTheme] = useState<ThemeConfig | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const requestRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const dragNode = useRef<GraphNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [chatNode, setChatNode] = useState<GraphNode | null>(null);
  const [answerNode, setAnswerNode] = useState<GraphNode | null>(null);


  // Physics constants
  const PHYSICS = {
    K_REPULSION: 2000,
    K_SPRING: 0.01,
    SPRING_LEN: 100,
    DAMPING: 0.92,
    CENTER_PULL: 0.002,
    DISTANCE_THRESHOLD: 400
  };

  // Connect to Backend
  useEffect(() => {
    if (isOpen && query) {
      // Connect to separate Express server on port 4000
      socketRef.current = io('http://localhost:4000');

      socketRef.current.emit('join_universe', query);

      socketRef.current.on('init_data', (data: { nodes: GraphNode[], links: GraphLink[], theme: ThemeConfig }) => {
        const { innerWidth, innerHeight } = window;

        // Initialize physics state
        physicsState.current = {
          nodes: data.nodes.map(n => ({
            ...n,
            // Ensure positions exist or randomize if missing
            x: n.x || innerWidth / 2 + (Math.random() - 0.5) * 200,
            y: n.y || innerHeight / 2 + (Math.random() - 0.5) * 200,
            vx: n.vx || (Math.random() - 0.5) * 2,
            vy: n.vy || (Math.random() - 0.5) * 2,
          })),
          links: data.links,
          theme: data.theme
        };

        setUiTheme(data.theme);
        setSelectedNode(null);
      });

      socketRef.current.on('node_moved', (data: { nodeId: string, x: number, y: number }) => {
        const target = physicsState.current.nodes.find(n => n.id === data.nodeId);
        if (target && target !== dragNode.current) {
          target.x = data.x;
          target.y = data.y;
          // Add slight energy to simulate impact
          target.vx += (Math.random() - 0.5);
          target.vy += (Math.random() - 0.5);
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isOpen, query]);

  // Resize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const updateSize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Physics & render loop
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      const { nodes, links, theme } = physicsState.current;

      if (!theme) {
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Calculate Forces
      nodes.forEach(node => {
        if (node === dragNode.current) return;

        let fx = 0, fy = 0;

        // Repulsion
        nodes.forEach(other => {
          if (node === other) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);

          // Optimization: ignore distant nodes
          if (dist < PHYSICS.DISTANCE_THRESHOLD) {
            const force = PHYSICS.K_REPULSION / distSq;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        });

        // Center gravity
        fx += (width / 2 - node.x) * PHYSICS.CENTER_PULL;
        fy += (height / 2 - node.y) * PHYSICS.CENTER_PULL;

        node.vx = (node.vx + fx) * PHYSICS.DAMPING;
        node.vy = (node.vy + fy) * PHYSICS.DAMPING;
      });

      // Spring forces
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);

        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - PHYSICS.SPRING_LEN) * PHYSICS.K_SPRING;
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

      // 2. Update positions
      nodes.forEach(node => {
        if (node !== dragNode.current) {
          node.x += node.vx;
          node.y += node.vy;
        }

        // Wall bounce
        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(width, node.x));
        }
        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(height, node.y));
        }
      });

      // 3. Draw links
      ctx.strokeStyle = theme.lineColor;
      ctx.lineWidth = 1;
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);

        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.globalAlpha = 0.2;
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;

      // 4. Draw nodes
      nodes.forEach(node => {
        // Glow for ROOT
        if (node.type === NodeType.ROOT) {
          const gradient = ctx.createRadialGradient(
            node.x, node.y, node.radius * 0.5,
            node.x, node.y, node.radius * 3
          );
          gradient.addColorStop(0, theme.nodeColors.ROOT);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node shape
        ctx.fillStyle = node.color;
        ctx.beginPath();

        if (node.type === NodeType.GROUP) {
          // Hexagon
          const r = node.radius;
          for (let i = 0; i < 6; i++) {
            const angle = 2 * Math.PI / 6 * i;
            const x = node.x + r * Math.cos(angle);
            const y = node.y + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        } else if (node.type === NodeType.ANSWER) {
          // Rectangle
          ctx.rect(
            node.x - node.radius * 1.5,
            node.y - node.radius,
            node.radius * 3,
            node.radius * 2
          );
        } else {
          // Circle
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        }

        ctx.shadowBlur = 15;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Highlight if selected
        if (selectedNode?.id === node.id) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Text & icons
        ctx.fillStyle = theme.fontColor;
        ctx.font = `bold ${node.type === NodeType.ROOT ? 16 : 10}px "Space Grotesk", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const label = node.label.length > 15 ? node.label.substring(0, 12) + '...' : node.label;
        ctx.fillText(label, node.x, node.y + node.radius + 12);

        // Icons
        if (node.type === NodeType.USER) ctx.fillText('👤', node.x, node.y);
        if (node.type === NodeType.GROUP) ctx.fillText('👥', node.x, node.y);
        if (node.type === NodeType.ANSWER) ctx.fillText('💡', node.x, node.y - 15);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen, selectedNode, PHYSICS]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { nodes } = physicsState.current;
    if (nodes.length === 0) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = nodes.find(n => {
      const dist = Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2);
      return dist < n.radius + 5;
    });

    if (clicked) {
      dragNode.current = clicked;
      setSelectedNode(clicked);
      setIsDragging(true);

      // ⭐ OPEN OVERLAYS
      if (clicked.type === NodeType.USER || clicked.type === NodeType.GROUP) {
        setChatNode(clicked);
        setAnswerNode(null);
      }
      if (clicked.type === NodeType.ANSWER) {
        setAnswerNode(clicked);
        setChatNode(null);
      }

    } else {
      setSelectedNode(null);
    }

  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragNode.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dragNode.current.x = x;
    dragNode.current.y = y;
    dragNode.current.vx = 0;
    dragNode.current.vy = 0;

    // Emit to backend
    if (socketRef.current) {
      socketRef.current.emit('move_node', {
        query,
        nodeId: dragNode.current.id,
        x,
        y
      });
    }
  }, [isDragging, query]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragNode.current = null;
  }, []);

  if (!isOpen) return null;

  // Loading state
  if (!uiTheme) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-2xl font-light">Syncing with Universe...</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: uiTheme.background || '#000' }}
    >
      {/* Background floating particles (CSS) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(15)].map((_, i) => (
          <div key={i}
            className="absolute rounded-full mix-blend-overlay animate-pulse"
            style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300}px`, height: `${Math.random() * 300}px`,
              background: uiTheme.particleColor,
              filter: 'blur(60px)',
              animationDuration: `${3 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 cursor-crosshair active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto animate-[slideDown_0.5s_ease]">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            {query.toUpperCase()}
          </h1>
          <p className="text-white/70 mt-2 text-xl font-light italic">
            {uiTheme.vibeDescription}
          </p>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all transform hover:rotate-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Details Panel */}
      {selectedNode && (
        <div className="absolute bottom-8 right-8 max-w-sm w-full bg-black/40 backdrop-blur-xl border-l-4 border-white p-6 text-white shadow-2xl animate-[slideUp_0.3s_ease-out] pointer-events-auto"
          style={{ borderColor: selectedNode.color }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-[0.2em] opacity-60 uppercase">{selectedNode.type}</span>
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: selectedNode.color }}></div>
          </div>
          <h2 className="text-3xl font-bold mb-2">{selectedNode.label}</h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-6">{selectedNode.details}</p>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded font-bold text-xs uppercase tracking-wider transition-colors">
              Connect
            </button>
            <button className="flex-1 py-3 bg-white text-black hover:bg-gray-200 rounded font-bold text-xs uppercase tracking-wider transition-colors">
              Explore
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedNode && (
        <div className="absolute bottom-8 left-8 text-white/30 text-sm pointer-events-none animate-pulse">
          Drag nodes to explore. Click to inspect.
        </div>
      )}

      {/* CHAT OVERLAY */}
      {chatNode && (
        <ChatOverlay
          node={chatNode}
          onClose={() => setChatNode(null)}
        />
      )}

      {/* ANSWER OVERLAY */}
      {answerNode && (
        <AnswerOverlay
          node={answerNode}
          onClose={() => {
            setAnswerNode(null);
            setSelectedNode(null);
            dragNode.current = null;
          }}
        />
      )}

    </div>
  );
};

export default SearchModal;
