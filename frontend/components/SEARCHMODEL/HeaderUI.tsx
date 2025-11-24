import React from 'react';
import { DesignSystem } from './ThemeEngine';

interface HeaderUIProps {
  query: string;
  theme: DesignSystem;
  onClose: () => void;
}

const HeaderUI: React.FC<HeaderUIProps> = ({ query, theme, onClose }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-4 md:p-8 pointer-events-none flex justify-between items-start z-10 safe-area-top">
      <div className="pointer-events-auto max-w-[75%] md:max-w-none">
        <h1
          className="text-3xl md:text-6xl font-black tracking-tighter mb-1 md:mb-2 leading-none break-words drop-shadow-md"
          style={{
            color: theme.primaryColor,
            fontFamily: theme.font,
          }}
        >
          {query.toUpperCase()}
        </h1>
        <p 
            className="text-white/60 text-xs md:text-lg font-medium tracking-wide" 
            style={{ fontFamily: theme.font }}
        >
          Knowledge Graph
        </p>
      </div>

      <button
        onClick={onClose}
        className="pointer-events-auto w-10 h-10 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-all active:scale-90 hover:rotate-90 bg-black/20 backdrop-blur-md shadow-lg"
        style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
        aria-label="Close"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default HeaderUI;