import React from 'react';
import { GraphNode } from '@/types/types';
import { DesignSystem } from './ThemeEngine';

interface DetailsPanelProps {
  selectedNode: GraphNode | null;
  theme: DesignSystem;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ selectedNode, theme }) => {
  if (!selectedNode) return null;

  return (
    <div 
      className="absolute bottom-0 left-0 w-full md:w-auto md:right-0 md:left-auto md:max-w-sm 
                 bg-black/60 backdrop-blur-xl md:border-l-4 border-t-4 md:border-t-0 border-white 
                 p-5 md:p-8 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.5)] 
                 animate-[slideUp_0.3s_ease-out] pointer-events-auto z-20 pb-8 md:pb-8 safe-area-bottom"
      style={{ borderColor: selectedNode.color }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] opacity-70 uppercase">{selectedNode.type}</span>
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor]" style={{ background: selectedNode.color, color: selectedNode.color }}></div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{selectedNode.label}</h2>
      
      <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-6 line-clamp-3 md:line-clamp-none">
        {selectedNode.details || "Explore this node to reveal more connections and hidden data within the graph universe."}
      </p>

      <div className="flex gap-3 md:gap-4">
        <button className="flex-1 py-3 md:py-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded font-bold text-[10px] md:text-xs uppercase tracking-widest transition-colors border border-white/10">
          Connect
        </button>
        <button className="flex-1 py-3 md:py-3 bg-white text-black hover:bg-gray-200 active:bg-gray-300 rounded font-bold text-[10px] md:text-xs uppercase tracking-widest transition-colors shadow-lg">
          Explore
        </button>
      </div>
    </div>
  );
};

export default DetailsPanel;