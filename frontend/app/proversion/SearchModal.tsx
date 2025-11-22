
import React, { useEffect, useRef, useState } from 'react';
import { GraphNode, GraphLink, NodeType, ThemeConfig } from './types';

// --- MOCK DATA GENERATOR ---
const getThemeForQuery = (query: string): ThemeConfig => {
  const q = query.toLowerCase().trim();
  
  if (q.includes('love') || q.includes('heart') || q.includes('date')) {
    return {
      name: 'Passion',
      background: 'radial-gradient(circle at center, #4a0e16 0%, #1a0508 100%)',
      nodeColors: {
        ROOT: '#ff0055', ANSWER: '#ff6688', USER: '#ff99aa', GROUP: '#ff3366', KEYWORD: '#882244'
      },
      lineColor: '#ff0055', particleColor: '#ff99aa', fontColor: '#ffddee',
      vibeDescription: "A nebula of emotions and connections."
    };
  }
  if (q.includes('tech') || q.includes('code') || q.includes('ai')) {
    return {
      name: 'Cyberpunk',
      background: 'linear-gradient(135deg, #020024 0%, #090979 35%, #00d4ff 100%)',
      nodeColors: {
        ROOT: '#00ffff', ANSWER: '#0099ff', USER: '#ffffff', GROUP: '#00cc99', KEYWORD: '#004466'
      },
      lineColor: '#00ffff', particleColor: '#00ffff', fontColor: '#ccffff',
      vibeDescription: "The digital frontier. Data streams and neural links."
    };
  }
  if (q.includes('job') || q.includes('work') || q.includes('career')) {
    return {
      name: 'Corporate',
      background: 'linear-gradient(to bottom, #1e3c72, #2a5298)',
      nodeColors: {
        ROOT: '#ffffff', ANSWER: '#bbddff', USER: '#88aacc', GROUP: '#446688', KEYWORD: '#224466'
      },
      lineColor: '#ffffff', particleColor: '#aabbcc', fontColor: '#ffffff',
      vibeDescription: "Professional network constellation."
    };
  }
  if (q.includes('music') || q.includes('song') || q.includes('art')) {
    return {
      name: 'Neon',
      background: 'linear-gradient(45deg, #2c3e50, #000000)',
      nodeColors: {
        ROOT: '#ff00ff', ANSWER: '#cc00cc', USER: '#ffff00', GROUP: '#00ff00', KEYWORD: '#660066'
      },
      lineColor: '#ff00ff', particleColor: '#ffff00', fontColor: '#ffffff',
      vibeDescription: "Rhythm and visual harmony."
    };
  }
  // Default Wild Theme
  return {
    name: 'Cosmos',
    background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    nodeColors: {
      ROOT: '#ffffff', ANSWER: '#e94560', USER: '#0f3460', GROUP: '#533483', KEYWORD: '#7a8b99'
    },
    lineColor: '#e94560', particleColor: '#ffffff', fontColor: '#ffffff',
    vibeDescription: "The infinite void of knowledge."
  };
};

const generateMockData = (query: string, width: number, height: number) => {
  const theme = getThemeForQuery(query);
  const center = { x: width / 2, y: height / 2 };
  
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Root
  nodes.push({
    id: 'root', label: query.toUpperCase(), type: NodeType.ROOT,
    x: center.x, y: center.y, vx: 0, vy: 0, radius: 40, val: 10,
    color: theme.nodeColors.ROOT, details: `The singularity of "${query}".`
  });

  // Generators
  const keywords = ['Future', 'Idea', 'Concept', 'Deep', 'Link', 'Source', 'Meaning', 'Trend'];
  const answers = ['This is the way.', '42', 'It depends on context.', 'Search deeper within.', 'Connection found.'];
  const users = ['Neo_99', 'Alice_W', 'Bot_X', 'Dr_Strange', 'Seeker01'];
  const groups = ['The Thinkers', 'General Chat', 'Deep Dive'];

  // Helper to add node
  const addNode = (label: string, type: NodeType, parentId: string, dist: number) => {
    const angle = Math.random() * Math.PI * 2;
    const id = Math.random().toString(36).substr(2, 9);
    const r = type === NodeType.ANSWER ? 25 : type === NodeType.KEYWORD ? 15 : 20;
    
    nodes.push({
      id, label, type,
      x: center.x + Math.cos(angle) * dist,
      y: center.y + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: r, val: r / 5,
      color: theme.nodeColors[type],
      details: `A ${type.toLowerCase()} node related to ${query}.`,
      img: type === NodeType.USER ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${label}` : undefined
    });
    links.push({ source: parentId, target: id, value: 1 });
    return id;
  };

  // Generate Orbit 1: Answers & Groups
  [...groups, ...answers].forEach((item, i) => {
    const type = groups.includes(item) ? NodeType.GROUP : NodeType.ANSWER;
    const id = addNode(item, type, 'root', 150 + Math.random() * 50);
    
    // Generate Orbit 2: Users & Keywords attached to Orbit 1
    const subCount = Math.floor(Math.random() * 3) + 1;
    for(let j=0; j<subCount; j++) {
      const isUser = Math.random() > 0.5;
      const label = isUser ? users[Math.floor(Math.random() * users.length)] : keywords[Math.floor(Math.random() * keywords.length)];
      addNode(label + `_${i}${j}`, isUser ? NodeType.USER : NodeType.KEYWORD, id, 80);
    }
  });

  // Add some random stray keywords connected to root
  for(let k=0; k<5; k++) {
      addNode(keywords[k] || 'Data', NodeType.KEYWORD, 'root', 250);
  }

  return { nodes, links, theme };
};

// --- COMPONENT ---

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, query }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<{nodes: GraphNode[], links: GraphLink[], theme: ThemeConfig} | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const requestRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragNode = useRef<GraphNode | null>(null);

  // Initialize Universe
  useEffect(() => {
    if (isOpen && query) {
      const { innerWidth, innerHeight } = window;
      const newData = generateMockData(query, innerWidth, innerHeight);
      setData(newData);
      setSelectedNode(null);
    }
  }, [isOpen, query]);

  // Physics Engine & Render Loop
  useEffect(() => {
    if (!isOpen || !data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes = data.nodes;
    const links = data.links;
    const theme = data.theme;

    // Physics Constants
    const K_REPULSION = 2000;
    const K_SPRING = 0.01;
    const SPRING_LEN = 100;
    const DAMPING = 0.92;
    const CENTER_PULL = 0.002;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Calculate Forces
      nodes.forEach(node => {
        if (node === dragNode.current) return; // Skip physics for dragged node

        let fx = 0, fy = 0;

        // Repulsion
        nodes.forEach(other => {
          if (node === other) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          const force = K_REPULSION / distSq;
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        });

        // Center Gravity
        fx += (width / 2 - node.x) * CENTER_PULL;
        fy += (height / 2 - node.y) * CENTER_PULL;

        // Apply to Velocity
        node.vx = (node.vx + fx) * DAMPING;
        node.vy = (node.vy + fy) * DAMPING;
      });

      // Spring Forces
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
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

      // 2. Update Positions
      nodes.forEach(node => {
        if (node !== dragNode.current) {
          node.x += node.vx;
          node.y += node.vy;
        }
        
        // Boundary bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // 3. Draw Links
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

      // 4. Draw Nodes
      nodes.forEach(node => {
        // Glow
        if (node.type === NodeType.ROOT) {
            const gradient = ctx.createRadialGradient(node.x, node.y, node.radius * 0.5, node.x, node.y, node.radius * 3);
            gradient.addColorStop(0, theme.nodeColors.ROOT);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Shape
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
            ctx.rect(node.x - node.radius * 1.5, node.y - node.radius, node.radius * 3, node.radius * 2);
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
        
        // Clip label length if not hovered (simple optimization)
        const label = node.label.length > 15 ? node.label.substring(0,12) + '...' : node.label;
        ctx.fillText(label, node.x, node.y + node.radius + 12);
        
        // Icons (Simple text based)
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
  }, [isOpen, data]); // Only restart if data changes completely

  // Mouse Handlers for Canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!data) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked node
    const clicked = data.nodes.find(n => {
        const dist = Math.sqrt((n.x - x)**2 + (n.y - y)**2);
        return dist < n.radius + 5;
    });

    if (clicked) {
        dragNode.current = clicked;
        setSelectedNode(clicked);
        setIsDragging(true);
    } else {
        setSelectedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
     const rect = canvasRef.current!.getBoundingClientRect();
     const x = e.clientX - rect.left;
     const y = e.clientY - rect.top;

     if (isDragging && dragNode.current) {
         dragNode.current.x = x;
         dragNode.current.y = y;
         dragNode.current.vx = 0;
         dragNode.current.vy = 0;
     }
  };

  const handleMouseUp = () => {
      setIsDragging(false);
      dragNode.current = null;
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ background: data?.theme.background || '#000' }}
    >
      {/* Background floating particles (CSS) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
         {[...Array(15)].map((_, i) => (
             <div key={i} 
                className="absolute rounded-full mix-blend-overlay animate-pulse"
                style={{
                    left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
                    width: `${Math.random()*300}px`, height: `${Math.random()*300}px`,
                    background: data?.theme.particleColor,
                    filter: 'blur(60px)',
                    animationDuration: `${3 + Math.random()*5}s`
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
                  {data?.theme.vibeDescription}
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
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{background: selectedNode.color}}></div>
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
    </div>
  );
};

export default SearchModal;
