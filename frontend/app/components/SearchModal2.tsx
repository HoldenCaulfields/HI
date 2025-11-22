import React, { useEffect, useRef, useState } from 'react';
import { GraphNode, GraphLink, ThemeConfig, NodeType } from '@/app/proversion/types';
import { socketService } from './socket';

interface UniverseCanvasProps {
  isOpen: boolean;
  query: string;
  onClose: () => void;
}

const SearchModal2: React.FC<UniverseCanvasProps> = ({ isOpen, query, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Interaction State
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const dragNode = useRef<GraphNode | null>(null);
  const isDragging = useRef<boolean>(false);

  // Refs for animation loop to access latest state without re-triggering effect
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const requestRef = useRef<number | null>(null);

  // Sync State to Refs
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    linksRef.current = links;
  }, [links]);

  // --- Socket Connection & Data Handling ---
  useEffect(() => {
    const socket = socketService.connect();

    socket.emit('join_universe', query);

    socket.on('init_data', (data: { nodes: GraphNode[], links: GraphLink[], theme: ThemeConfig }) => {
      // Center nodes initially if coming fresh, or respect backend positions
      setNodes(data.nodes);
      setLinks(data.links);
      setTheme(data.theme);
      setLoading(false);
    });

    socket.on('node_moved', ({ nodeId, x, y }: { nodeId: string, x: number, y: number }) => {
      // Update local node position from remote user
      setNodes(prevNodes => 
        prevNodes.map(n => {
          if (n.id === nodeId) {
            // If we are currently dragging this specific node, ignore remote update to prevent fighting
            if (dragNode.current?.id === nodeId && isDragging.current) {
              return n;
            }
            return { ...n, x, y, vx: 0, vy: 0 }; // Reset velocity to stop physics fighting
          }
          return n;
        })
      );
    });

    return () => {
      socket.off('init_data');
      socket.off('node_moved');
      // We don't disconnect here to keep socket open for navigation, 
      // but strictly speaking, we should leave the room.
      socket.emit('leave_group', { groupId: query.toLowerCase().trim() }); 
    };
  }, [isOpen, query]);

  // --- Physics Engine ---
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Physics Constants
    const K_REPULSION = 2000;
    const K_SPRING = 0.01;
    const SPRING_LEN = 100;
    const DAMPING = 0.92;
    const CENTER_PULL = 0.002;

    const animate = () => {
      if (!theme) {
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const currentNodes = nodesRef.current;
      const currentLinks = linksRef.current;

      ctx.clearRect(0, 0, width, height);

      // 1. Calculate Forces
      currentNodes.forEach(node => {
        // Skip physics update for the node being dragged by user
        if (node.id === dragNode.current?.id && isDragging.current) return;

        let fx = 0, fy = 0;

        // Repulsion (All nodes repel all nodes)
        currentNodes.forEach(other => {
          if (node.id === other.id) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          let distSq = dx * dx + dy * dy;
          if (distSq === 0) distSq = 1; // Prevent division by zero
          const dist = Math.sqrt(distSq);
          
          const force = K_REPULSION / distSq;
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        });

        // Center Gravity (Pull towards middle)
        fx += (width / 2 - node.x) * CENTER_PULL;
        fy += (height / 2 - node.y) * CENTER_PULL;

        // Apply to Velocity
        node.vx = (node.vx + fx) * DAMPING;
        node.vy = (node.vy + fy) * DAMPING;
      });

      // Spring Forces (Links pull connected nodes)
      currentLinks.forEach(link => {
        const source = currentNodes.find(n => n.id === link.source);
        const target = currentNodes.find(n => n.id === link.target);
        
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
          const force = (dist - SPRING_LEN) * K_SPRING;
          
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (source.id !== dragNode.current?.id) {
            source.vx += fx;
            source.vy += fy;
          }
          if (target.id !== dragNode.current?.id) {
            target.vx -= fx;
            target.vy -= fy;
          }
        }
      });

      // 2. Update Positions
      currentNodes.forEach(node => {
        if (node.id !== dragNode.current?.id) {
          node.x += node.vx;
          node.y += node.vy;
        }
        
        // Boundary bounce
        const padding = node.radius;
        if (node.x < padding) { node.x = padding; node.vx *= -1; }
        if (node.x > width - padding) { node.x = width - padding; node.vx *= -1; }
        if (node.y < padding) { node.y = padding; node.vy *= -1; }
        if (node.y > height - padding) { node.y = height - padding; node.vy *= -1; }
      });

      // 3. Draw Links
      ctx.strokeStyle = theme.lineColor;
      ctx.lineWidth = 1;
      currentLinks.forEach(link => {
        const source = currentNodes.find(n => n.id === link.source);
        const target = currentNodes.find(n => n.id === link.target);
        if (source && target) {
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.globalAlpha = 0.2;
            ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;

      // 4. Draw Nodes
      currentNodes.forEach(node => {
        // Glow for ROOT
        if (node.type === NodeType.ROOT) {
            const gradient = ctx.createRadialGradient(node.x, node.y, node.radius * 0.5, node.x, node.y, node.radius * 3);
            gradient.addColorStop(0, theme.nodeColors.ROOT);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Node Shape
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
            // Rect
            ctx.roundRect(node.x - node.radius * 1.5, node.y - node.radius, node.radius * 3, node.radius * 2, 5);
        } else {
            // Circle
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        }
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Text Label
        ctx.fillStyle = theme.fontColor;
        ctx.font = `bold ${node.type === NodeType.ROOT ? 16 : 10}px "Space Grotesk", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Clip label
        const label = node.label.length > 15 && node.type !== NodeType.ROOT 
          ? node.label.substring(0,12) + '...' 
          : node.label;
          
        ctx.fillText(label, node.x, node.y + node.radius + 12);
        
        // Icons
        if(node.type === NodeType.USER) ctx.fillText("👤", node.x, node.y);
        if(node.type === NodeType.GROUP) ctx.fillText("👥", node.x, node.y);
        if(node.type === NodeType.ANSWER) ctx.fillText("💡", node.x, node.y - 15);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [theme]); // Restart loop if theme changes (which happens on init_data)

  // --- Event Handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (loading) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clicked = nodesRef.current.find(n => {
        const dist = Math.sqrt((n.x - x)**2 + (n.y - y)**2);
        return dist < n.radius + 10; // Hitbox slightly larger
    });

    if (clicked) {
        dragNode.current = clicked;
        isDragging.current = true;
        setSelectedNode(clicked);
    } else {
        setSelectedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
     if (isDragging.current && dragNode.current) {
         const rect = canvasRef.current!.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

         // Update local ref immediately for smoothness
         dragNode.current.x = x;
         dragNode.current.y = y;
         dragNode.current.vx = 0;
         dragNode.current.vy = 0;

         // Emit to server (Real-time)
         // Note: In a heavy prod app, you might throttle this emit
         socketService.moveNode(query, dragNode.current.id, x, y);
     }
  };

  const handleMouseUp = () => {
      isDragging.current = false;
      dragNode.current = null;
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden animate-[fadeIn_0.5s_ease]"
        style={{ background: theme?.background || '#000' }}
    >
      {loading && (
        <div className="absolute z-50 flex flex-col items-center justify-center text-white animate-pulse">
           <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
           <h2 className="text-xl font-bold tracking-widest">ESTABLISHING UPLINK...</h2>
        </div>
      )}

      {/* Floating Particles (Background FX) */}
      {!loading && theme && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
           {[...Array(15)].map((_, i) => (
               <div key={i} 
                  className="absolute rounded-full mix-blend-overlay animate-pulse"
                  style={{
                      left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
                      width: `${Math.random()*300}px`, height: `${Math.random()*300}px`,
                      background: theme.particleColor,
                      filter: 'blur(60px)',
                      animationDuration: `${3 + Math.random()*5}s`
                  }}
               />
           ))}
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className={`absolute inset-0 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 cursor-crosshair active:cursor-grabbing`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* UI Overlay */}
      {!loading && theme && (
        <>
          <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none">
              <div className="pointer-events-auto animate-[slideDown_0.5s_ease]">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      {query.toUpperCase()}
                  </h1>
                  <p className="text-white/70 mt-2 text-xl font-light italic">
                      {theme.vibeDescription}
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

          {/* Node Details Panel */}
          {selectedNode && (
              <div className="absolute bottom-8 right-8 max-w-sm w-full bg-black/40 backdrop-blur-xl border-l-4 border-white p-6 text-white shadow-2xl animate-[slideUp_0.3s_ease-out] pointer-events-auto"
                   style={{ borderColor: selectedNode.color }}>
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold tracking-[0.2em] opacity-60 uppercase">{selectedNode.type}</span>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{background: selectedNode.color}}></div>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{selectedNode.label}</h2>
                  <p className="text-gray-300 leading-relaxed text-sm mb-6">{selectedNode.details}</p>
                  
                  <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded font-bold text-xs uppercase tracking-wider transition-colors">
                          Connect
                      </button>
                      <button className="flex-1 py-3 bg-white text-black hover:bg-gray-200 rounded font-bold text-xs uppercase tracking-wider transition-colors">
                          Expand
                      </button>
                  </div>
              </div>
          )}

          {/* Instructions */}
          {!selectedNode && (
              <div className="absolute bottom-8 left-8 text-white/30 text-sm pointer-events-none animate-pulse">
                  Live Universe • Drag nodes to collaborate • Click to inspect
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchModal2;