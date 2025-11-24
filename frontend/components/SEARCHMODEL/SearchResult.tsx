'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatOverlay from '../Chat';
import AnswerOverlay from '../AnswerOverlay';
import { GraphNode, GraphLink } from '@/types/types';
import { getTheme } from './ThemeEngine';
import GraphCanvas from './GraphCanvas';
import HeaderUI from './HeaderUI';
import DetailsPanel from './DetailsPanel';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

const SearchResult: React.FC<SearchModalProps> = ({ isOpen, onClose, query }) => {
  const physicsState = useRef<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
  const socketRef = useRef<Socket | null>(null);
  const dragNode = useRef<GraphNode | null>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [chatNode, setChatNode] = useState<GraphNode | null>(null);
  const [answerNode, setAnswerNode] = useState<GraphNode | null>(null);

  const theme = useMemo(() => getTheme(query), [query]);

  // --- Socket Connection ---
  useEffect(() => {
    if (isOpen && query) {
      socketRef.current = io('http://localhost:4000');
      socketRef.current.emit('join_universe', query);

      socketRef.current.on('init_data', (data: { nodes: GraphNode[], links: GraphLink[] }) => {
        const { innerWidth, innerHeight } = window;
        const isMobile = innerWidth < 640;
        
        physicsState.current = {
          nodes: data.nodes.map(n => ({
            ...n,
            x: n.x || innerWidth / 2 + (Math.random() - 0.5) * (isMobile ? 50 : 100),
            y: n.y || innerHeight / 2 + (Math.random() - 0.5) * (isMobile ? 50 : 100),
            vx: n.vx || 0,
            vy: n.vy || 0,
            radius: n.type === 'ROOT' 
              ? (isMobile ? 22 : 35) 
              : n.type === 'ANSWER' 
                ? (isMobile ? 16 : 25) 
                : (isMobile ? 10 : 15)
          })),
          links: data.links
        };
      });

      socketRef.current.on('node_moved', (data: { nodeId: string, x: number, y: number }) => {
        const target = physicsState.current.nodes.find(n => n.id === data.nodeId);
        if (target && target !== dragNode.current) {
          target.x = data.x;
          target.y = data.y;
        }
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isOpen, query]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden animate-[fadeIn_0.5s_ease-out] bg-black select-none touch-none">
      
      {/* 1. GRAPH CANVAS - Full Screen */}
      <GraphCanvas
        theme={theme}
        physicsState={physicsState}
        selectedNode={selectedNode}
        dragNode={dragNode}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        setSelectedNode={setSelectedNode}
        setChatNode={setChatNode}
        setAnswerNode={setAnswerNode}
        socket={socketRef.current}
        query={query}
      />

      {/* 2. HEADER UI */}
      <HeaderUI
        query={query}
        theme={theme}
        onClose={onClose}
      />
      
      {/* 3. DETAILS PANEL */}
      <DetailsPanel
        selectedNode={selectedNode}
        theme={theme}
      />

      {/* Instructions - Hidden on interaction to reduce clutter */}
      {!selectedNode && !isDragging && (
        <div className="absolute bottom-6 w-full text-center pointer-events-none animate-pulse z-10 opacity-50">
           <span className="text-white text-[10px] md:text-sm uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
             {window.innerWidth < 640 ? "Tap to explore" : "Drag nodes to explore"}
           </span>
        </div>
      )}

      {/* 4. OVERLAYS */}
      {chatNode && (
        <ChatOverlay
          node={chatNode}
          onClose={() => setChatNode(null)}
        />
      )}

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

export default SearchResult;