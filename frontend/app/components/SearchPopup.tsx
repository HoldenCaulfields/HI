import { useState, useEffect } from "react";
import { X, User, Users, MessageCircle, TrendingUp, Sparkles, Search, ArrowRight, Star, Heart, Clock } from "lucide-react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}
interface Person {
  id: number;
  name: string;
  username: string;
  bio: string;
  followers: number;
  online: boolean;
  tags: string[];
}

interface Group {
  id: number;
  name: string;
  description: string;
  members: number;
  online: number;
  posts: number;
  image: string;
}

interface Answer {
  id: number;
  question: string;
  answer: string;
  author: string;
  votes: number;
  time: string;
}

interface MockResults {
  people: Person[];
  groups: Group[];
  answers: Answer[];
}

interface UniverseSearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
}

export default function SearchPopup({ isOpen, onClose, searchQuery }: UniverseSearchPopupProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [stars, setStars] = useState<Star[]>([]);

  // Generate random stars for background
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setStars(newStars);
  }, []);

  if (!isOpen) return null;

  // Mock data - trong thực tế sẽ fetch từ API dựa trên searchQuery
  const mockResults = {
    people: [
      {
        id: 1,
        name: "Sarah Johnson",
        username: "@sarahj",
        bio: "Career coach | Helping people find their dream jobs",
        followers: 2847,
        online: true,
        tags: ["career", "coaching", "jobs"]
      },
      {
        id: 2,
        name: "Michael Chen",
        username: "@mchen",
        bio: "Tech recruiter | Always happy to connect",
        followers: 1923,
        online: false,
        tags: ["tech", "recruiting", "networking"]
      },
      {
        id: 3,
        name: "Emma Davis",
        username: "@emmad",
        bio: "Life coach | Let's talk about your journey",
        followers: 3421,
        online: true,
        tags: ["life", "wellness", "advice"]
      }
    ],
    groups: [
      {
        id: 1,
        name: "Career Builders 💼",
        description: "Job hunting strategies and career advancement",
        members: 5847,
        online: 234,
        posts: 1243,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
      },
      {
        id: 2,
        name: "Job Seekers Unite 🎯",
        description: "Share opportunities and support each other",
        members: 3921,
        online: 187,
        posts: 892,
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop"
      }
    ],
    answers: [
      {
        id: 1,
        question: "How to find a job in tech without experience?",
        answer: "Start with building projects, contribute to open source, and network actively. Focus on showcasing your skills through a portfolio...",
        author: "@tech_mentor",
        votes: 847,
        time: "2 hours ago"
      },
      {
        id: 2,
        question: "Best platforms for remote job hunting?",
        answer: "LinkedIn, RemoteOK, We Work Remotely, and AngelList are excellent starting points. Make sure your profile is optimized...",
        author: "@remote_expert",
        votes: 623,
        time: "5 hours ago"
      }
    ]
  };

  const tabs = [
    { id: "all", label: "All", count: mockResults.people.length + mockResults.groups.length + mockResults.answers.length },
    { id: "people", label: "People", count: mockResults.people.length },
    { id: "groups", label: "Groups", count: mockResults.groups.length },
    { id: "answers", label: "Answers", count: mockResults.answers.length }
  ];

  const filteredResults = activeTab === "all" 
    ? mockResults 
    : { [activeTab]: mockResults[activeTab as keyof MockResults] };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with universe effect */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Animated stars */}
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
        
        {/* Nebula effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-linear-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-xl border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Universe of Results</h2>
                <p className="text-sm text-gray-400">Exploring: <span className="text-purple-400 font-semibold">"{searchQuery}"</span></p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
          {/* People Section */}
          {(activeTab === "all" || activeTab === "people") && mockResults.people.length > 0 && (
            <div className="space-y-4">
              {activeTab === "all" && (
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  People
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockResults.people.map(person => (
                  <div
                    key={person.id}
                    className="group relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                  >
                    {/* Online indicator */}
                    {person.online && (
                      <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{person.name}</h4>
                        <p className="text-purple-300 text-sm">{person.username}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{person.bio}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {person.followers.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {person.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <button className="w-full px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                      Connect
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Groups Section */}
          {(activeTab === "all" || activeTab === "groups") && mockResults.groups.length > 0 && (
            <div className="space-y-4">
              {activeTab === "all" && (
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Groups
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockResults.groups.map(group => (
                  <div
                    key={group.id}
                    className="group relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                  >
                    <div className="relative h-48">
                      <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        {group.online} online
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white font-bold text-lg mb-1">{group.name}</h4>
                        <p className="text-gray-300 text-sm line-clamp-2">{group.description}</p>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {group.members.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {group.posts}
                        </span>
                      </div>
                      
                      <button className="w-full px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                        Join Group
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answers Section */}
          {(activeTab === "all" || activeTab === "answers") && mockResults.answers.length > 0 && (
            <div className="space-y-4">
              {activeTab === "all" && (
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  Answers
                </h3>
              )}
              <div className="space-y-4">
                {mockResults.answers.map(answer => (
                  <div
                    key={answer.id}
                    className="group bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                  >
                    <h4 className="text-white font-bold text-lg mb-3">{answer.question}</h4>
                    <p className="text-gray-300 mb-4">{answer.answer}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-purple-300 font-semibold text-sm">{answer.author}</span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {answer.time}
                        </span>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-white font-semibold">{answer.votes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {Object.values(filteredResults).every(arr => arr?.length === 0) && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo component to test the popup
/* export default function Demo() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-8 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Universe Search Demo
        </h1>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white rounded-2xl shadow-xl flex items-center overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search the universe..."
                className="flex-1 px-6 py-5 text-lg outline-none"
              />
              <button
                onClick={handleSearch}
                className="mx-2 px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-sm text-gray-500">Try:</span>
            {["findjob", "makefriend", "lonely", "advice"].map((tag, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(tag);
                  setIsOpen(true);
                }}
                className="px-4 py-2 bg-white hover:bg-gray-50 rounded-full text-sm font-medium text-gray-700 hover:text-purple-600 transition-all shadow-sm hover:shadow-md"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p>Click search or press Enter to open the Universe Search Popup</p>
        </div>
      </div>

      <UniverseSearchPopup 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        searchQuery={searchQuery}
      />
    </div>
  );
} */