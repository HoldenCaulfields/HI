
import React, { useState } from 'react';
import SearchModal from './SearchModal';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsModalOpen(true);
  };

  const quickSearch = (term: string) => {
    setQuery(term);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden flex flex-col font-sans">
      
      {/* Main Landing Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Background Ambient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-500 tracking-tighter">
          UNIVERSE
        </h1>
        <p className="text-gray-400 mb-12 text-lg md:text-xl max-w-lg text-center font-light">
          Type a concept. We will build a living galaxy of connections, users, and ideas around it.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-xl relative group z-20">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
          <div className="relative flex items-center bg-black/80 border border-white/10 rounded-full p-2 pl-6 shadow-2xl backdrop-blur-xl transition-all focus-within:border-white/30">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Explore 'Love', 'Tech', 'Dream'..."
              className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-lg py-3 font-light tracking-wide"
            />
            <button 
                type="submit"
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform active:scale-95"
            >
              GO
            </button>
          </div>
        </form>

        <div className="mt-10 flex flex-wrap justify-center gap-4 z-20">
            {['love', 'tech', 'music', 'findjob', 'hanoi'].map((tag) => (
                <button 
                    key={tag}
                    onClick={() => quickSearch(tag)}
                    className="px-5 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-sm text-gray-300 hover:text-white hover:border-white/30 transition-all"
                >
                    {tag}
                </button>
            ))}
        </div>
      </div>

      {/* The Cosmic Modal */}
      <SearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        query={query}
      />
    </div>
  );
};

export default App;
