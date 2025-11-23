import React, { useState, useEffect } from "react";
import { MessageCircle, Heart, Users, Briefcase, Coffee, Star, Zap, Music, Film, Code, Headphones, Globe, Search, Sparkles, ArrowUp, ArrowDown } from "lucide-react";

// --- Types & Data ---

interface ThemeConfig {
  bgGradient: string;
  accentColor: string; // Used for text highlights
  buttonColor: string; // Used for icon backgrounds
  images: string[];
  questions: { text: string; emoji: string }[];
  answers: { text: string; author: string }[];
  groups: { text: string; members: string; online: number }[];
  stats: { text: string; count: string; trend: string }[];
  reactions: any[];
}

const THEME_DATA: Record<string, ThemeConfig> = {
  findjob: {
    bgGradient: "from-blue-50 via-indigo-50 to-white",
    accentColor: "text-blue-600",
    buttonColor: "bg-blue-100 text-blue-600",
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=300&fit=crop', // Office
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop', // Handshake
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop', // Professional
    ],
    questions: [
      { text: 'Hiring remote?', emoji: '💼' },
      { text: 'Interview prep?', emoji: '🎯' },
    ],
    answers: [
      { text: 'Update your LinkedIn!', author: '@hr_pro' },
      { text: 'Networking is key.', author: '@coach' },
    ],
    groups: [
      { text: 'Remote Jobs', members: '12K', online: 450 },
    ],
    stats: [
      { text: 'Hired', count: '840', trend: '+12%' },
      { text: 'Openings', count: '2.1k', trend: '+5%' },
    ],
    reactions: [Briefcase, Search, Globe]
  },
  
  love: {
    bgGradient: "from-rose-50 via-pink-50 to-white",
    accentColor: "text-rose-600",
    buttonColor: "bg-rose-100 text-rose-600",
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop', // Couple
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=300&fit=crop', // Friends
    ],
    questions: [
      { text: 'First date ideas?', emoji: '💖' },
      { text: 'Is this love?', emoji: '🦋' },
    ],
    answers: [
      { text: 'Be yourself.', author: '@cupid' },
      { text: 'Coffee dates work best.', author: '@advice' },
    ],
    groups: [
      { text: 'Singles', members: '5.2K', online: 890 },
    ],
    stats: [
      { text: 'Matches', count: '99+', trend: '+40%' },
      { text: 'Stories', count: '1.2k', trend: '+15%' },
    ],
    reactions: [Heart, Sparkles, Coffee]
  },

  tech: {
    bgGradient: "from-cyan-50 via-sky-50 to-white",
    accentColor: "text-cyan-700",
    buttonColor: "bg-cyan-100 text-cyan-700",
    images: [
      'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=300&fit=crop', // Code
      'https://images.unsplash.com/photo-1531297424005-063472b62429?w=400&h=300&fit=crop', // Hardware
    ],
    questions: [
      { text: 'React or Vue?', emoji: '⚛️' },
      { text: 'Fixed the bug?', emoji: '🐛' },
    ],
    answers: [
      { text: 'Check the docs.', author: '@seniordev' },
      { text: 'It works on my machine.', author: '@jr_dev' },
    ],
    groups: [
      { text: 'Developers', members: '42K', online: 1200 },
    ],
    stats: [
      { text: 'Commits', count: '3.4M', trend: '+8%' },
      { text: 'Forks', count: '892', trend: '+22%' },
    ],
    reactions: [Code, Zap, Search]
  },

  music: {
    bgGradient: "from-fuchsia-50 via-purple-50 to-white",
    accentColor: "text-purple-600",
    buttonColor: "bg-purple-100 text-purple-600",
    images: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop', // DJ
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop', // Studio
    ],
    questions: [
      { text: 'Best drop ever?', emoji: '🎧' },
      { text: 'New album thoughts?', emoji: '💿' },
    ],
    answers: [
      { text: 'Bass is life.', author: '@audiophile' },
      { text: 'Need better headphones.', author: '@listener' },
    ],
    groups: [
      { text: 'Producers', members: '8K', online: 320 },
    ],
    stats: [
      { text: 'Streams', count: '1M+', trend: '+50%' },
      { text: 'Beats', count: '450', trend: '+12%' },
    ],
    reactions: [Music, Headphones, Star]
  },

  movie: {
    bgGradient: "from-orange-50 via-amber-50 to-white",
    accentColor: "text-orange-600",
    buttonColor: "bg-orange-100 text-orange-600",
    images: [
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop', // Cinema
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop', // Film
    ],
    questions: [
      { text: 'Best plot twist?', emoji: '🎬' },
      { text: 'Scariest movie?', emoji: '🍿' },
    ],
    answers: [
      { text: 'The ending ruined it.', author: '@critic' },
      { text: 'A masterpiece.', author: '@fan' },
    ],
    groups: [
      { text: 'Cinephiles', members: '15K', online: 560 },
    ],
    stats: [
      { text: 'Reviews', count: '50k', trend: '+5%' },
      { text: 'Tickets', count: '900', trend: '+90%' },
    ],
    reactions: [Film, Star, MessageCircle]
  },
  
  lonely: {
    bgGradient: "from-slate-100 via-gray-100 to-white",
    accentColor: "text-slate-600",
    buttonColor: "bg-slate-200 text-slate-700",
    images: [
      'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=400&h=300&fit=crop', // Night
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', // Sea
    ],
    questions: [
      { text: 'Anyone awake?', emoji: '🌙' },
      { text: 'Just need to talk.', emoji: '💭' },
    ],
    answers: [
      { text: 'We are here for you.', author: '@friend' },
      { text: 'It gets better.', author: '@hope' },
    ],
    groups: [
      { text: 'Night Owls', members: '2.2K', online: 150 },
    ],
    stats: [
      { text: 'Online', count: '45', trend: 'stable' },
      { text: 'Hugs', count: '∞', trend: 'max' },
    ],
    reactions: [MessageCircle, Users, Coffee]
  },

  default: {
    bgGradient: "from-indigo-50 via-purple-50 to-white",
    accentColor: "text-indigo-600",
    buttonColor: "bg-indigo-100 text-indigo-600",
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    ],
    questions: [
      { text: 'Start something new?', emoji: '🚀' },
    ],
    answers: [
      { text: 'Lets go!', author: '@user' },
    ],
    groups: [
      { text: 'Everyone', members: '1M', online: 10000 },
    ],
    stats: [
      { text: 'Users', count: '10K', trend: '+100%' },
    ],
    reactions: [Star, Heart, Zap]
  }
};

interface HeroBackgroundProps {
  theme?: string;
  density?: 'low' | 'medium' | 'high';
}

// --- Helper Components ---

// Cải tiến: Thẻ FloatingCard với độ mờ cao hơn và soft shadow
const FloatingCard = ({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <div 
    className={`absolute bg-white/80 backdrop-blur-xl border border-white/70 shadow-2xl shadow-slate-300/40 rounded-2xl overflow-hidden will-change-transform 
    transition-all duration-500 ease-in-out hover:scale-[1.07] hover:bg-white hover:shadow-slate-300/60 hover:z-20 ${className}`}
    style={style}
  >
    {children}
  </div>
);

const TrendIndicator = ({ trend }: { trend: string }) => {
    const isPositive = trend.includes('+') || trend === 'max';
    const isStable = trend === 'stable';
    
    if (isStable) {
        return <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1 rounded-sm mt-1 inline-block w-fit mx-auto">STABLE</span>
    }

    const Icon = isPositive ? ArrowUp : ArrowDown;
    const colorClass = isPositive ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100';

    return (
        <div className={`flex items-center gap-0.5 px-1 rounded-sm mt-1 w-fit mx-auto border ${colorClass}`}>
            <Icon className="w-2.5 h-2.5" />
            <span className="text-[10px] font-bold">{trend.replace('+', '').replace('-', '')}</span>
        </div>
    );
};

const HeroBackground = ({ theme = 'default', density = 'medium' }: HeroBackgroundProps) => { // Thêm customBgColor vào destructuring
  const [items, setItems] = useState<any[]>([]);

  const themeData = THEME_DATA[theme] || THEME_DATA.default;

  useEffect(() => {
    const generateItems = () => {
      const newItems = [];
      const counts = {
        low: { img: 1, q: 1, a: 1, g: 0, s: 1, r: 2 },
        medium: { img: 2, q: 2, a: 2, g: 1, s: 2, r: 4 },
        high: { img: 3, q: 3, a: 3, g: 2, s: 3, r: 6 },
      }[density];

      const randomPos = (idx: number, total: number) => {
        const quadrant = idx % 4; 
        let x, y;
        
        if (quadrant === 0) { // Top Left (2%-40%, 2%-40%)
          x = Math.random() * 38 + 2;
          y = Math.random() * 38 + 2;
        } else if (quadrant === 1) { // Top Right (60%-98%, 2%-40%)
          x = Math.random() * 38 + 60;
          y = Math.random() * 38 + 2;
        } else if (quadrant === 2) { // Bottom Left (2%-40%, 60%-98%)
          x = Math.random() * 38 + 2;
          y = Math.random() * 38 + 60;
        } else { // Bottom Right (60%-98%, 60%-98%)
          x = Math.random() * 38 + 60;
          y = Math.random() * 38 + 60;
        }

        return {
          left: `${x}%`,
          top: `${y}%`,
          animationDuration: `${18 + Math.random() * 12}s`, 
          animationDelay: `-${Math.random() * 12}s`,
          rotation: Math.random() * 8 - 4, 
          scale: 0.85 + Math.random() * 0.2,
        };
      };

      let globalIdx = 0;

      themeData.images.slice(0, counts.img).forEach(src => {
        newItems.push({ type: 'image', src, id: `img-${globalIdx}`, ...randomPos(globalIdx++, 10) });
      });
      
      themeData.questions.slice(0, counts.q).forEach(q => {
        newItems.push({ type: 'question', ...q, id: `q-${globalIdx}`, ...randomPos(globalIdx++, 10) });
      });

      themeData.answers.slice(0, counts.a).forEach(a => {
        newItems.push({ type: 'answer', ...a, id: `a-${globalIdx}`, ...randomPos(globalIdx++, 10) });
      });

      themeData.groups.slice(0, counts.g).forEach(g => {
        newItems.push({ type: 'group', ...g, id: `g-${globalIdx}`, ...randomPos(globalIdx++, 10) });
      });

      themeData.stats.slice(0, counts.s).forEach(s => {
        newItems.push({ type: 'stat', ...s, id: `s-${globalIdx}`, ...randomPos(globalIdx++, 10) });
      });

      const reactionIcons = themeData.reactions;
      for(let i = 0; i < counts.r; i++) {
        newItems.push({ 
          type: 'reaction', 
          icon: reactionIcons[i % reactionIcons.length], 
          id: `r-${globalIdx}`, 
          ...randomPos(globalIdx++, 10) 
        });
      }

      return newItems;
    };

    setItems(generateItems());
  }, [theme, density, themeData]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none `}>
      <style>{`
        @keyframes float-organic {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(0.8deg); }
          50% { transform: translate(-10px, 10px) rotate(-1.2deg); }
          75% { transform: translate(15px, 5px) rotate(0.4deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-float {
          animation-name: float-organic;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Main Background - Sử dụng backgroundClass */}
      <div className={`absolute inset-0  transition-all duration-1000 ease-in-out -z-20 `} />
      
      {/* Lớp phủ mờ nhẹ để tạo thêm độ sâu */}
      <div className="absolute inset-0 bg-white/20 backdrop-filter backdrop-saturate-150 -z-10 " />

      {/* Decorative Orbs - Tinh chỉnh màu sắc và blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/40 rounded-full blur-[100px] opacity-70" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/40 rounded-full blur-[100px] opacity-70" />

      {items.map((item) => {
        const floatStyle: React.CSSProperties = {
          left: item.left,
          top: item.top,
          transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
          animationDuration: item.animationDuration,
          animationDelay: item.animationDelay,
        };

        switch(item.type) {
          case 'image':
            return (
              <FloatingCard 
                key={item.id} 
                className="w-48 h-32 md:w-60 md:h-40 animate-float p-1 bg-white"
                style={floatStyle}
              >
                <div className="w-full h-full overflow-hidden rounded-xl">
                    <img 
                      src={item.src} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110" 
                    />
                </div>
              </FloatingCard>
            );

          case 'question':
            return (
              <FloatingCard 
                key={item.id} 
                className="max-w-[200px] p-4 animate-float pointer-events-auto cursor-pointer flex items-center gap-3"
                style={floatStyle}
              >
                <div className={`p-2 rounded-full ${themeData.buttonColor}`}>
                    <span className="text-xl">{item.emoji}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-snug">{item.text}</p>
              </FloatingCard>
            );

          case 'answer':
            return (
              <FloatingCard 
                key={item.id} 
                className="max-w-[220px] p-4 animate-float pointer-events-auto cursor-pointer"
                style={floatStyle}
              >
                <p className="text-sm text-slate-700 font-medium leading-relaxed mb-2 italic">"{item.text}"</p>
                <p className={`text-xs font-bold ${themeData.accentColor} border-t pt-2 border-slate-100`}>{item.author}</p>
              </FloatingCard>
            );

          case 'group':
            return (
              <FloatingCard 
                key={item.id} 
                className="p-3 min-w-40 animate-float"
                style={floatStyle}
              >
                <div className="flex items-center gap-3 mb-2 border-b border-slate-100 pb-2">
                  <div className={`w-9 h-9 rounded-full ${themeData.buttonColor} flex items-center justify-center shrink-0`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-extrabold text-slate-800 truncate">{item.text}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{item.members} members</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-green-50/70 border border-green-100 rounded-full px-2 py-1 w-fit">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-md shadow-green-400" />
                  <span className="text-[11px] text-green-700 font-extrabold">{item.online} online</span>
                </div>
              </FloatingCard>
            );

          case 'stat':
            return (
              <FloatingCard 
                key={item.id} 
                className="p-3 min-w-[120px] text-center animate-float flex flex-col justify-center"
                style={floatStyle}
              >
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{item.text}</p>
                <span className={`text-2xl font-black ${themeData.accentColor} transition-colors duration-300`}>{item.count}</span>
                <TrendIndicator trend={item.trend} />
              </FloatingCard>
            );

          case 'reaction':
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="absolute animate-float"
                style={floatStyle}
              >
                <div className={`p-3 rounded-full bg-white shadow-xl shadow-slate-300/60 will-change-transform 
                transition-all duration-300 hover:scale-125 ${themeData.accentColor}`}>
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default HeroBackground;