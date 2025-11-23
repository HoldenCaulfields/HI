import { useState, useEffect } from "react";
import { MessageCircle, Heart, Users, Briefcase, Coffee, Star, Zap, Music, Film, Code, Headphones } from "lucide-react";

const THEME_DATA: Record<string, any> = {
  findjob: {
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    ],
    questions: [
      { text: 'Anyone hiring remote?', emoji: '💼' },
      { text: 'Best way to job hunt?', emoji: '🎯' },
      { text: 'Career change advice?', emoji: '🚀' },
      { text: 'Interview tips?', emoji: '💡' },
    ],
    answers: [
      { text: 'LinkedIn + portfolio = your best bet', author: '@career_pro' },
      { text: 'Network! Most jobs aren\'t posted', author: '@hr_insider' },
      { text: 'Tailor your resume for each role', author: '@job_coach' },
    ],
    groups: [
      { text: 'Job Hunters 💼', members: '2.1K', online: 187 },
      { text: 'Career Switch 🔄', members: '1.8K', online: 142 },
    ],
    stats: [
      { text: 'findjob', count: '1.2K', trend: '+23%' },
      { text: 'remote', count: '987', trend: '+18%' },
    ],
    colors: ['from-blue-500 to-cyan-600', 'from-slate-600 to-slate-800', 'from-teal-500 to-cyan-600'],
    reactions: [Briefcase, Star, Zap]
  },
  
  lover: {
    images: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop',
    ],
    questions: [
      { text: 'Where to meet someone real?', emoji: '💕' },
      { text: 'First date ideas?', emoji: '☕' },
      { text: 'How to know if they like me?', emoji: '💭' },
      { text: 'Dating app tips?', emoji: '📱' },
    ],
    answers: [
      { text: 'Coffee dates work better than dinner', author: '@dating_guru' },
      { text: 'Be yourself, seriously!', author: '@love_coach' },
      { text: 'Join hobby groups, meet naturally', author: '@matchmaker' },
    ],
    groups: [
      { text: 'Dating Advice 💕', members: '2.3K', online: 234 },
      { text: 'Love Stories ❤️', members: '1.9K', online: 198 },
    ],
    stats: [
      { text: 'lover', count: '654', trend: '+12%' },
      { text: 'dating', count: '543', trend: '+8%' },
    ],
    colors: ['from-rose-400 to-red-500', 'from-red-500 to-rose-600', 'from-orange-400 to-red-500'],
    reactions: [Heart, Coffee, Star]
  },
  
  lonely: {
    images: [
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    ],
    questions: [
      { text: 'Feeling lonely tonight...', emoji: '💭' },
      { text: 'Anyone awake to chat?', emoji: '🌙' },
      { text: 'How to deal with loneliness?', emoji: '🫂' },
      { text: 'Need someone to talk to', emoji: '💬' },
    ],
    answers: [
      { text: 'You\'re not alone! We\'re all here', author: '@nightowl' },
      { text: 'Late night chats help so much', author: '@midnight_friend' },
      { text: 'Join our voice chat, always someone there', author: '@community_mod' },
    ],
    groups: [
      { text: 'Late Night Talks 🌙', members: '1.5K', online: 289 },
      { text: 'Just Vibe 💫', members: '2.2K', online: 312 },
    ],
    stats: [
      { text: 'lonely', count: '756', trend: '+31%' },
      { text: 'chat', count: '621', trend: '+15%' },
    ],
    colors: ['from-teal-400 to-cyan-500', 'from-blue-400 to-cyan-500', 'from-slate-600 to-slate-800'],
    reactions: [MessageCircle, Heart, Users]
  },
  
  tech: {
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop',
    ],
    questions: [
      { text: 'Best way to learn coding?', emoji: '💻' },
      { text: 'React or Vue in 2024?', emoji: '⚛️' },
      { text: 'AI tools for developers?', emoji: '🤖' },
      { text: 'Debugging tips?', emoji: '🐛' },
    ],
    answers: [
      { text: 'Start with small projects, build in public', author: '@coder_jane' },
      { text: 'Read the docs, seriously!', author: '@dev_mike' },
      { text: 'Join coding communities, pair program', author: '@tech_mentor' },
    ],
    groups: [
      { text: 'Tech Corner 💻', members: '2.8K', online: 234 },
      { text: 'Code Together 👨‍💻', members: '1.7K', online: 156 },
    ],
    stats: [
      { text: 'tech', count: '432', trend: '+15%' },
      { text: 'coding', count: '389', trend: '+12%' },
    ],
    colors: ['from-green-400 to-teal-500', 'from-cyan-500 to-blue-600', 'from-blue-500 to-cyan-600'],
    reactions: [Code, Zap, Star]
  },
  
  music: {
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop',
    ],
    questions: [
      { text: 'Song recommendations?', emoji: '🎵' },
      { text: 'Best concerts you\'ve been to?', emoji: '🎸' },
      { text: 'New albums to check out?', emoji: '💿' },
      { text: 'Music for focus?', emoji: '🎧' },
    ],
    answers: [
      { text: 'Check out indie playlists on Spotify', author: '@music_lover' },
      { text: 'Lo-fi beats = productivity boost', author: '@producer_sam' },
      { text: 'Live concerts > everything else', author: '@concert_addict' },
    ],
    groups: [
      { text: 'Music Lovers 🎵', members: '3.2K', online: 421 },
      { text: 'Vinyl Club 💿', members: '1.6K', online: 134 },
    ],
    stats: [
      { text: 'music', count: '823', trend: '+19%' },
      { text: 'playlist', count: '567', trend: '+14%' },
    ],
    colors: ['from-orange-400 to-red-500', 'from-amber-500 to-orange-600', 'from-yellow-400 to-orange-500'],
    reactions: [Music, Headphones, Heart]
  },
  
  movie: {
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
    ],
    questions: [
      { text: 'Movie recommendations?', emoji: '🎬' },
      { text: 'Best director of all time?', emoji: '🎥' },
      { text: 'Hidden gem films?', emoji: '💎' },
      { text: 'Watch party tonight?', emoji: '🍿' },
    ],
    answers: [
      { text: 'Letterboxd is your best friend', author: '@film_buff' },
      { text: 'A24 movies never disappoint', author: '@indie_fan' },
      { text: 'Join our watch parties every Friday!', author: '@movie_host' },
    ],
    groups: [
      { text: 'Film Club 🎬', members: '2.6K', online: 278 },
      { text: 'Watch Party 🍿', members: '1.9K', online: 203 },
    ],
    stats: [
      { text: 'movie', count: '712', trend: '+16%' },
      { text: 'cinema', count: '489', trend: '+11%' },
    ],
    colors: ['from-red-500 to-rose-600', 'from-slate-600 to-slate-800', 'from-amber-500 to-orange-600'],
    reactions: [Film, Star, Heart]
  },
  
  // Default theme if no match
  default: {
    images: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=300&fit=crop',
    ],
    questions: [
      { text: 'How to make friends online?', emoji: '🤝' },
      { text: 'Anyone want to chat?', emoji: '💬' },
      { text: 'What are you up to?', emoji: '🌟' },
      { text: 'Need some advice', emoji: '💡' },
    ],
    answers: [
      { text: 'Just be yourself! It takes time', author: '@sarah' },
      { text: 'Join communities that match your vibe', author: '@community_guru' },
      { text: 'Real connections > follower count', author: '@authentic_me' },
    ],
    groups: [
      { text: 'New Friends 🤝', members: '3.4K', online: 412 },
      { text: 'Coffee Chat ☕', members: '1.9K', online: 156 },
    ],
    stats: [
      { text: 'makefriend', count: '987', trend: '+18%' },
      { text: 'chat', count: '621', trend: '+15%' },
    ],
    colors: ['from-orange-400 to-red-500', 'from-blue-400 to-cyan-500', 'from-teal-400 to-cyan-500'],
    reactions: [MessageCircle, Heart, Users]
  }
};

interface HeroBackgroundProps {
  theme?: 'findjob' | 'lover' | 'lonely' | 'tech' | 'music' | 'movie' | 'default';
}

const HeroBackground = ({ theme = 'default' }: HeroBackgroundProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [autoAnimate, setAutoAnimate] = useState(true);

  const themeData = THEME_DATA[theme] || THEME_DATA.default;

  useEffect(() => {
    // Build content items based on theme - reduced quantity
    const contentItems = [
      // Images - only 2
      ...themeData.images.slice(0, 2).map((img: string) => ({ type: 'image', src: img })),
      
      // Questions - only 2
      ...themeData.questions.slice(0, 2).map((q: any) => ({ 
        type: 'question', 
        text: q.text, 
        emoji: q.emoji,
        color: themeData.colors[Math.floor(Math.random() * themeData.colors.length)]
      })),
      
      // Answers - only 2
      ...themeData.answers.slice(0, 2).map((a: any) => ({ 
        type: 'answer', 
        text: a.text, 
        author: a.author,
        color: themeData.colors[Math.floor(Math.random() * themeData.colors.length)]
      })),
      
      // Groups - only 1
      ...themeData.groups.slice(0, 1).map((g: any) => ({ 
        type: 'group', 
        text: g.text,
        members: g.members,
        online: g.online,
        color: themeData.colors[Math.floor(Math.random() * themeData.colors.length)]
      })),
      
      // Stats - only 2
      ...themeData.stats.map((s: any) => ({ 
        type: 'stat', 
        text: s.text,
        count: s.count,
        trend: s.trend,
        color: themeData.colors[Math.floor(Math.random() * themeData.colors.length)]
      })),
      
      // Reactions - only 2
      ...themeData.reactions.slice(0, 2).map((icon: any, idx: number) => ({ 
        type: 'reaction', 
        icon: icon,
        count: Math.floor(Math.random() * 500 + 300),
        color: themeData.colors[idx % themeData.colors.length]
      })),
    ];

    const initialItems = contentItems.map((item, index) => ({
      ...item,
      id: index,
      ...generateRandomStyle()
    }));
    
    setItems(initialItems);
  }, [theme]);

  // Auto random animation - slower interval
  useEffect(() => {
    if (!autoAnimate) return;

    const interval = setInterval(() => {
      setItems(prevItems =>
        prevItems.map(item => ({
          ...item,
          ...generateRandomStyle(),
        }))
      );
    }, 4500); // Slower: 4.5 seconds

    return () => clearInterval(interval);
  }, [autoAnimate]);

  const generateRandomStyle = () => {
    const size = Math.random() * 120 + 180; // 180-300px
    const rotation = Math.random() * 90;
    
    // Create grid zones to prevent overlapping
    const gridSize = 5; // 5x5 grid
    const zone = Math.floor(Math.random() * (gridSize * gridSize));
    const zoneX = zone % gridSize;
    const zoneY = Math.floor(zone / gridSize);
    
    // Position within zone with padding
    const padding = 15; // % padding
    const zoneWidth = 100 / gridSize;
    const x = zoneX * zoneWidth + padding + Math.random() * (zoneWidth - padding * 2);
    const y = zoneY * zoneWidth + padding + Math.random() * (zoneWidth - padding * 2);
    
    const scale = Math.random() * 0.25 + 0.8; // 0.8-1.05
    
    return {
      size,
      rotation,
      x: Math.max(5, Math.min(95, x)), // Keep away from edges
      y: Math.max(5, Math.min(95, y)),
      scale,
      opacity: Math.random() * 0.2 + 0.35 // 0.35-0.55 (more transparent)
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setAutoAnimate(false);
    
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    setItems(prevItems =>
      prevItems.map(item => {
        const deltaX = (clientX - centerX) / 80;
        const deltaY = (clientY - centerY) / 80;
        
        return {
          ...item,
          x: Math.max(0, Math.min(100, item.x + deltaX * 0.08)),
          y: Math.max(0, Math.min(100, item.y + deltaY * 0.08)),
          rotation: item.rotation + Math.random() * 4,
        };
      })
    );
  };

  const handleMouseLeave = () => {
    setTimeout(() => setAutoAnimate(true), 2000);
  };

  const renderContent = (item: any) => {
    switch (item.type) {
      case 'image':
        return (
          <div className="relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <img 
              src={item.src} 
              alt="connection" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
          </div>
        );
      
      case 'question':
        return (
          <div className={`bg-linear-to-br ${item.color} p-4 rounded-2xl shadow-xl text-white transform -rotate-3 hover:rotate-0 transition-all duration-300`}>
            <div className="text-3xl mb-2">{item.emoji}</div>
            <div className="font-bold text-sm leading-tight">{item.text}</div>
          </div>
        );
      
      case 'answer':
        return (
          <div className={`bg-linear-to-br ${item.color} p-4 rounded-xl shadow-lg text-white transform rotate-2 hover:rotate-0 transition-all duration-300`}>
            <div className="text-xs font-bold mb-2 opacity-80">{item.author}</div>
            <div className="font-semibold text-xs leading-relaxed">{item.text}</div>
          </div>
        );
      
      case 'group':
        return (
          <div className={`bg-linear-to-br ${item.color} p-3 rounded-xl shadow-xl text-white transform rotate-[5deg] hover:rotate-0 transition-all duration-300`}>
            <div className="font-black text-sm mb-2">{item.text}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {item.members}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                {item.online}
              </span>
            </div>
          </div>
        );
      
      case 'stat':
        return (
          <div className={`bg-linear-to-br ${item.color} p-3 rounded-lg shadow-lg text-white transform rotate-[-4deg] hover:rotate-0 transition-all duration-300`}>
            <div className="text-xs font-bold opacity-80">#{item.text}</div>
            <div className="text-2xl font-black">{item.count}</div>
            <div className="text-xs font-bold text-green-200">{item.trend}</div>
          </div>
        );
      
      case 'reaction':
        const Icon = item.icon;
        return (
          <div className={`bg-linear-to-br ${item.color} p-4 rounded-full shadow-xl text-white transform hover:scale-110 transition-all duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute transition-all duration-700 ease-out pointer-events-auto"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            opacity: item.opacity,
            maxWidth: `${item.size}px`,
            willChange: 'transform, opacity',
          }}
        >
          {renderContent(item)}
        </div>
      ))}
    </div>
  );
};

export default HeroBackground;