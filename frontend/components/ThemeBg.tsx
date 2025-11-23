import { 
  Code, BookOpen, Film, Heart, Music, Coffee, Briefcase, 
   Users, Zap, Star, Globe 
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Group {
  name: string;
  description: string;
  members: number;
  online: number;
  lastActive: string;
  messages: number;
  image: string;
  tags: string[];
}

interface TrendingItem {
  keyword: string;
  count: number;
  trend: string;
  emoji: string;
}

interface Category {
  title: string;
  icon: LucideIcon;
  image: string;
}

interface Answer {
  question: string;
  answer: string;
  author: string;
  votes: number;
  time: string;
}

interface ThemeConfig {
  id: string;
  backgroundGradient: string;
  accentColor: string; // Tailwinc class for text color
  heroBlobColors: string[]; // Array of tailwind bg colors
  groups: Group[];
  trending: TrendingItem[];
  categories: Category[];
  answers: Answer[];
}


// Default Data (General/Tech mixed)
const DEFAULT_DATA: ThemeConfig = {
  id: "default",
  backgroundGradient: "from-indigo-50 via-white to-purple-50",
  accentColor: "text-indigo-600",
  heroBlobColors: ["bg-teal-400/50", "bg-indigo-500/50", "bg-purple-500/50", "bg-blue-300/50"],
  groups: [
    {
      name: "Tech Enthusiasts 🚀",
      description: "Discussing AI, Web3, and cutting-edge technologies",
      members: 2847,
      online: 234,
      lastActive: "2 min ago",
      messages: 1243,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      tags: ["tech", "ai", "innovation"]
    },
    {
      name: "Global News 🌍",
      description: "What's happening around the world right now.",
      members: 5120,
      online: 890,
      lastActive: "just now",
      messages: 5600,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      tags: ["news", "world"]
    },
     {
      name: "Make Friends 🌟",
      description: "Connect with like-minded people and build friendships",
      members: 3421,
      online: 412,
      lastActive: "just now",
      messages: 2134,
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
      tags: ["makefriend", "social", "community"]
    },
    {
      name: "Creative Corner 🎨",
      description: "Share art, design, and creative blocks.",
      members: 1200,
      online: 150,
      lastActive: "10 min ago",
      messages: 890,
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
      tags: ["art", "design"]
    }
  ],
  trending: [
    { keyword: "findjob", count: 1243, trend: "+23%", emoji: "💼" },
    { keyword: "makefriend", count: 987, trend: "+18%", emoji: "🤝" },
    { keyword: "ai_tools", count: 756, trend: "+31%", emoji: "🤖" },
    { keyword: "travel", count: 654, trend: "+12%", emoji: "✈️" },
    { keyword: "fitness", count: 543, trend: "+8%", emoji: "💪" },
    { keyword: "advice", count: 432, trend: "+15%", emoji: "💡" }
  ],
  categories: [
    { title: "Technology", icon: Code, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop" },
    { title: "Education", icon: BookOpen, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop" },
    { title: "Entertainment", icon: Film, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop" },
    { title: "Lifestyle", icon: Heart, image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop" },
  ],
  answers: [
    {
      question: "How to make friends online?",
      answer: "Start by being genuine and showing interest in others. Join communities that align with your interests...",
      author: "@sarah_connect",
      votes: 847,
      time: "2 hours ago"
    },
    {
      question: "Best way to learn Python?",
      answer: "Build projects! Don't just watch tutorials. Start with a simple calculator or to-do list app...",
      author: "@code_master",
      votes: 1205,
      time: "1 hour ago"
    },
    {
      question: "Morning routine ideas?",
      answer: "Drink water first thing, stretch for 5 mins, and avoid your phone for the first 30 mins.",
      author: "@wellness_jen",
      votes: 512,
      time: "4 hours ago"
    }
  ]
};

// "findjob" Theme Data
const JOB_DATA: ThemeConfig = {
  id: "findjob",
  backgroundGradient: "from-slate-50 via-white to-blue-50",
  accentColor: "text-blue-700",
  heroBlobColors: ["bg-blue-600/40", "bg-slate-500/40", "bg-cyan-400/30", "bg-sky-300/30"],
  groups: [
    {
      name: "Resume Review 📄",
      description: "Get feedback on your CV from HR pros.",
      members: 5400,
      online: 600,
      lastActive: "1 min ago",
      messages: 8900,
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
      tags: ["resume", "cv", "help"]
    },
    {
      name: "Mock Interviews 🎤",
      description: "Practice your interview skills with peers.",
      members: 3200,
      online: 120,
      lastActive: "5 min ago",
      messages: 1200,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
      tags: ["interview", "practice"]
    },
    {
      name: "Tech Jobs 💻",
      description: "Software engineering and product management roles.",
      members: 12000,
      online: 1500,
      lastActive: "just now",
      messages: 45000,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
      tags: ["tech", "jobs"]
    },
    {
      name: "Remote Work 🏠",
      description: "Finding and surviving remote opportunities.",
      members: 8900,
      online: 450,
      lastActive: "10 min ago",
      messages: 5600,
      image: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=400&h=300&fit=crop",
      tags: ["remote", "wfh"]
    }
  ],
  trending: [
    { keyword: "resume_tips", count: 2400, trend: "+45%", emoji: "📝" },
    { keyword: "remote_jobs", count: 1800, trend: "+30%", emoji: "🏠" },
    { keyword: "interview_prep", count: 1200, trend: "+15%", emoji: "👔" },
    { keyword: "salary_neg", count: 900, trend: "+10%", emoji: "💰" },
    { keyword: "linkedin", count: 850, trend: "+8%", emoji: "🔗" },
    { keyword: "career_change", count: 700, trend: "+12%", emoji: "🔄" }
  ],
  categories: [
    { title: "Career Advice", icon: Briefcase, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop" },
    { title: "Skill Building", icon: BookOpen, image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop" },
    { title: "Networking", icon: Users, image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop" },
    { title: "Productivity", icon: Zap, image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop" },
  ],
  answers: [
    {
      question: "How to handle 'Wait, do you have any questions for us'?",
      answer: "Always ask about team culture, challenges they are facing, or what success looks like in the role.",
      author: "@hiring_manager_mike",
      votes: 2100,
      time: "1 hour ago"
    },
    {
      question: "Best sites for remote jobs?",
      answer: "WeWorkRemotely, RemoteOK, and filtering LinkedIn for 'Remote' are your best bets.",
      author: "@digital_nomad_liz",
      votes: 1500,
      time: "3 hours ago"
    },
    {
      question: "Dealing with job rejection?",
      answer: "It's a numbers game. Take a break, refine your resume, and keep applying. Don't take it personally.",
      author: "@career_coach_sarah",
      votes: 980,
      time: "5 hours ago"
    }
  ]
};

// "love" Theme Data
const LOVE_DATA: ThemeConfig = {
  id: "love",
  backgroundGradient: "from-pink-50 via-white to-rose-50",
  accentColor: "text-rose-600",
  heroBlobColors: ["bg-rose-400/50", "bg-pink-500/40", "bg-red-300/30", "bg-orange-200/40"],
  groups: [
    {
      name: "Relationship Advice ❤️",
      description: "Navigating the complexities of love and dating.",
      members: 15400,
      online: 2600,
      lastActive: "just now",
      messages: 89000,
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop",
      tags: ["love", "dating"]
    },
    {
      name: "Healing Hearts 🩹",
      description: "Support for breakups and moving on.",
      members: 8200,
      online: 450,
      lastActive: "2 min ago",
      messages: 12000,
      image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=300&fit=crop",
      tags: ["breakup", "support"]
    },
    {
      name: "Self Love Club ✨",
      description: "Learning to love yourself first.",
      members: 10000,
      online: 900,
      lastActive: "5 min ago",
      messages: 5600,
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=300&fit=crop",
      tags: ["selfcare", "wellness"]
    },
    {
      name: "Long Distance 🌏",
      description: "For couples separated by miles.",
      members: 4500,
      online: 300,
      lastActive: "15 min ago",
      messages: 3400,
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=300&fit=crop",
      tags: ["ldr", "distance"]
    }
  ],
  trending: [
    { keyword: "dating_tips", count: 5400, trend: "+65%", emoji: "💘" },
    { keyword: "gift_ideas", count: 3200, trend: "+40%", emoji: "🎁" },
    { keyword: "red_flags", count: 2800, trend: "+25%", emoji: "🚩" },
    { keyword: "confession", count: 2100, trend: "+15%", emoji: "💌" },
    { keyword: "anniversary", count: 1500, trend: "+10%", emoji: "🥂" },
    { keyword: "poetry", count: 900, trend: "+5%", emoji: "📝" }
  ],
  categories: [
    { title: "Relationships", icon: Heart, image: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=300&fit=crop" },
    { title: "Wellness", icon: Coffee, image: "https://images.unsplash.com/photo-1544367563-12123d8975bd?w=400&h=300&fit=crop" },
    { title: "Community", icon: Users, image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop" },
    { title: "Music for Two", icon: Music, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop" },
  ],
  answers: [
    {
      question: "How to know if they like me?",
      answer: "Look for eye contact, if they initiate conversation, and if they remember small details about you.",
      author: "@love_guru_maya",
      votes: 3500,
      time: "30 min ago"
    },
    {
      question: "Best first date idea?",
      answer: "Coffee or a walk in the park. Keep it low pressure so you can actually talk.",
      author: "@casual_dater",
      votes: 1800,
      time: "2 hours ago"
    },
    {
      question: "Dealing with ghosting?",
      answer: "Their silence is an answer. Respect yourself enough to not chase someone who doesn't value you.",
      author: "@self_worth_ally",
      votes: 2200,
      time: "1 hour ago"
    }
  ]
};

// "tech" Theme Data
const TECH_DATA: ThemeConfig = {
  id: "tech",
  backgroundGradient: "from-gray-50 via-white to-cyan-50",
  accentColor: "text-cyan-600",
  heroBlobColors: ["bg-cyan-500/40", "bg-blue-600/40", "bg-purple-600/30", "bg-teal-300/30"],
  groups: [
    {
      name: "Web3 Devs ⛓️",
      description: "Solidity, Rust, and the future of the web.",
      members: 8900,
      online: 1200,
      lastActive: "just now",
      messages: 34000,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
      tags: ["crypto", "web3"]
    },
    {
      name: "AI Revolution 🤖",
      description: "LLMs, diffusion models, and ethics.",
      members: 15600,
      online: 3400,
      lastActive: "just now",
      messages: 56000,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
      tags: ["ai", "ml"]
    },
    {
      name: "Indie Hackers 🚀",
      description: "Building profitable side projects.",
      members: 6700,
      online: 500,
      lastActive: "5 min ago",
      messages: 8900,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      tags: ["startup", "saas"]
    },
    {
      name: "System Design 🏗️",
      description: "Scalability, microservices, and databases.",
      members: 4500,
      online: 200,
      lastActive: "1 hour ago",
      messages: 2300,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
      tags: ["architecture", "backend"]
    }
  ],
  trending: [
    { keyword: "react_19", count: 4500, trend: "+80%", emoji: "⚛️" },
    { keyword: "rust_lang", count: 3200, trend: "+50%", emoji: "🦀" },
    { keyword: "gemini_api", count: 2800, trend: "+45%", emoji: "✨" },
    { keyword: "devops", count: 1500, trend: "+20%", emoji: "♾️" },
    { keyword: "cybersec", count: 1200, trend: "+15%", emoji: "🔒" },
    { keyword: "ux_design", count: 900, trend: "+10%", emoji: "🎨" }
  ],
  categories: [
    { title: "Development", icon: Code, image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop" },
    { title: "AI & ML", icon: Zap, image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=300&fit=crop" },
    { title: "Hardware", icon: Briefcase, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop" },
    { title: "Startups", icon: Globe, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop" },
  ],
  answers: [
    {
      question: "TypeScript vs JavaScript for new projects?",
      answer: "TypeScript 100%. The type safety saves so much debugging time in the long run.",
      author: "@senior_dev_dan",
      votes: 5600,
      time: "2 hours ago"
    },
    {
      question: "Best resource to learn AI?",
      answer: "Andrew Ng's course on Coursera is legendary. Fast.ai is great for hands-on learners.",
      author: "@ai_researcher_kim",
      votes: 3400,
      time: "4 hours ago"
    },
    {
      question: "Mac vs Windows for coding?",
      answer: "Unix-based systems (Mac/Linux) generally have better dev tooling support, but WSL2 on Windows is solid now.",
      author: "@fullstack_fred",
      votes: 2100,
      time: "6 hours ago"
    }
  ]
};

// "lonely" Theme Data
const LONELY_DATA: ThemeConfig = {
  id: "lonely",
  backgroundGradient: "from-slate-100 via-gray-50 to-zinc-100",
  accentColor: "text-purple-600",
  heroBlobColors: ["bg-indigo-900/30", "bg-purple-800/30", "bg-slate-700/30", "bg-blue-900/20"],
  groups: [
    {
      name: "Late Night Talks 🌙",
      description: "For those who can't sleep or just want to chat.",
      members: 1567,
      online: 289,
      lastActive: "1 min ago",
      messages: 3421,
      image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=300&fit=crop",
      tags: ["night", "chat"]
    },
    {
      name: "Vent Here 🌧️",
      description: "A safe space to let it all out without judgement.",
      members: 4300,
      online: 150,
      lastActive: "just now",
      messages: 12000,
      image: "https://images.unsplash.com/photo-1516585427167-18e431cb8f24?w=400&h=300&fit=crop",
      tags: ["vent", "support"]
    },
    {
      name: "Quiet Company ☕",
      description: "Co-working/Co-existing in silence.",
      members: 2100,
      online: 89,
      lastActive: "10 min ago",
      messages: 400,
      image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop",
      tags: ["chill", "silent"]
    },
    {
      name: "Movie Watch Party 🎬",
      description: "Let's watch something together so we aren't alone.",
      members: 3400,
      online: 200,
      lastActive: "30 min ago",
      messages: 5600,
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop",
      tags: ["movie", "social"]
    }
  ],
  trending: [
    { keyword: "insomnia", count: 3200, trend: "+12%", emoji: "😴" },
    { keyword: "mental_health", count: 2800, trend: "+10%", emoji: "🧠" },
    { keyword: "sad_songs", count: 1500, trend: "+8%", emoji: "🎵" },
    { keyword: "need_hug", count: 1200, trend: "+15%", emoji: "❤️" },
    { keyword: "meditation", count: 900, trend: "+20%", emoji: "🧘" },
    { keyword: "friendship", count: 800, trend: "+5%", emoji: "🤝" }
  ],
  categories: [
    { title: "Mental Health", icon: Heart, image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop" },
    { title: "Music", icon: Music, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop" },
    { title: "Movies", icon: Film, image: "https://images.unsplash.com/photo-1489599849909-524675a71d7e?w=400&h=300&fit=crop" },
    { title: "Gaming", icon: Zap, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop" },
  ],
  answers: [
    {
      question: "What to do when feeling lonely?",
      answer: "Reach out to one person, even just a text. Or embrace the solitude with a good book or movie.",
      author: "@friendly_neighbor",
      votes: 1200,
      time: "1 hour ago"
    },
    {
      question: "Can't sleep, help?",
      answer: "Try the 4-7-8 breathing technique. Inhale for 4, hold for 7, exhale for 8.",
      author: "@sleep_expert",
      votes: 890,
      time: "2 hours ago"
    },
    {
      question: "How to make friends as an adult?",
      answer: "Consistency is key. Go to the same coffee shop, gym class, or online group regularly.",
      author: "@social_butterfly",
      votes: 670,
      time: "4 hours ago"
    }
  ]
};

// "music" Theme Data (Simplified for brevity, similar structure)
const MUSIC_DATA: ThemeConfig = {
    id: "music",
    backgroundGradient: "from-fuchsia-50 via-white to-purple-50",
    accentColor: "text-fuchsia-600",
    heroBlobColors: ["bg-fuchsia-500/40", "bg-purple-600/40", "bg-pink-400/30", "bg-indigo-400/30"],
    groups: [
      {
        name: "Indie Discoveries 🎸",
        description: "Sharing the best underground tracks.",
        members: 6700,
        online: 800,
        lastActive: "just now",
        messages: 12000,
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=300&fit=crop",
        tags: ["indie", "discovery"]
      },
      {
        name: "Music Production 🎹",
        description: "Tips on mixing, mastering, and DAWs.",
        members: 9000,
        online: 1200,
        lastActive: "5 min ago",
        messages: 45000,
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop",
        tags: ["production", "ableton"]
      },
      {
          name: "Classical Vibes 🎻",
          description: "Discussing composers and theory.",
          members: 2300,
          online: 150,
          lastActive: "1 hour ago",
          messages: 1200,
          image: "https://images.unsplash.com/photo-1507838153414-b4b713384ebd?w=400&h=300&fit=crop",
          tags: ["classical", "theory"]
      },
      {
          name: "Lofi Study Beats ☕",
          description: "Music to work and relax to.",
          members: 15000,
          online: 3000,
          lastActive: "Live",
          messages: 8900,
          image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=300&fit=crop",
          tags: ["lofi", "study"]
      }
    ],
    trending: [
      { keyword: "new_album", count: 8900, trend: "+90%", emoji: "💿" },
      { keyword: "concert_tix", count: 4500, trend: "+60%", emoji: "🎫" },
      { keyword: "guitar_tabs", count: 2300, trend: "+15%", emoji: "🎸" },
      { keyword: "spotify_wrapped", count: 12000, trend: "+100%", emoji: "📊" },
      { keyword: "synth_wave", count: 1500, trend: "+20%", emoji: "🎹" },
      { keyword: "jazz_club", count: 800, trend: "+5%", emoji: "🎷" }
    ],
    categories: [
      { title: "Genres", icon: Music, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop" },
      { title: "Instruments", icon: Star, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop" },
      { title: "Events", icon: Film, image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop" },
      { title: "Production", icon: Zap, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop" },
    ],
    answers: [
      {
        question: "Best budget headphones?",
        answer: "Audio-Technica ATH-M50x is the gold standard for entry-level monitoring.",
        author: "@audiophile_dave",
        votes: 3400,
        time: "1 hour ago"
      },
      {
        question: "How to start learning guitar?",
        answer: "JustinGuitar on YouTube. It's free and better than most paid courses.",
        author: "@strumming_steve",
        votes: 5600,
        time: "3 hours ago"
      },
       {
        question: "Song stuck in my head...",
        answer: "Try listening to the end of the song. The 'Zeigarnik effect' says your brain remembers unfinished tasks.",
        author: "@psych_major",
        votes: 1200,
        time: "2 hours ago"
      }
    ]
  };

export const ThemeMap: Record<string, ThemeConfig> = {
  default: DEFAULT_DATA,
  findjob: JOB_DATA,
  love: LOVE_DATA,
  lover: LOVE_DATA, // Alias
  tech: TECH_DATA,
  technology: TECH_DATA, // Alias
  lonely: LONELY_DATA,
  music: MUSIC_DATA,
  // Fallback for others to default or minimal variation could be added
  advice: DEFAULT_DATA,
  boring: DEFAULT_DATA,
  movie: LONELY_DATA // Reuse lonely/movie data for now
};
