"use client";

import { useState } from "react";
import {
  Users, TrendingUp, MessageCircle, Heart, UserPlus, Clock, Star,
  Globe, Sparkles, Search
} from "lucide-react";
import HeroBackground from "@/components/HeroBackground";
import SearchModal from "@/components/SearchModal";
import { ThemeMap } from "@/components/ThemeBg";

const BG_GRADIENT_MAP = {
  // Theme gốc
  default: "bg-gradient-to-br from-indigo-50 via-purple-50 to-white",
  findjob: "bg-gradient-to-br from-blue-50 via-indigo-50 to-white",
  love: "bg-gradient-to-br from-rose-50 via-pink-50 to-white",
  tech: "bg-gradient-to-br from-cyan-50 via-sky-50 to-white",
  music: "bg-gradient-to-br from-fuchsia-50 via-purple-50 to-white",
  movie: "bg-gradient-to-br from-orange-50 via-amber-50 to-white",
  lonely: "bg-gradient-to-br from-slate-100 via-gray-100 to-white",

  // Ví dụ thêm các tùy chọn khác (ví dụ: solid color)
  solid_blue: "bg-blue-100",
  dark_overlay: "bg-gray-800",
  sunset: "bg-gradient-to-r from-yellow-300 to-red-400",
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [bgtheme, setBgtheme] = useState('');
  const themeData = ThemeMap[bgtheme] || ThemeMap["default"];
  const themeKey = bgtheme as keyof typeof BG_GRADIENT_MAP;
  const changeBackground = BG_GRADIENT_MAP[themeKey];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsOpen(true);
    }
  };

  const handleTagClick = (tag: string) => {
    const keyword = tag.split(' ')[0].toLowerCase();
    setSearchQuery(keyword);
    setBgtheme(keyword);
  }

  return (
    <div className={`min-h-screen bg-linear-to-br ${changeBackground}`}>
      {/* Animated Background: Modern & Luxury Aura */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-5 w-96 h-96 bg-teal-400/50 rounded-full filter blur-3xl opacity-15 animate-blob-slow"></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-indigo-500/50 rounded-full filter blur-3xl opacity-15 animate-blob-slow animation-delay-2000"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/50 rounded-full filter blur-3xl opacity-15 animate-blob-slow animation-delay-4000"></div>
        <div className="absolute top-20 left-1/2 w-64 h-64 bg-blue-300/50 rounded-full filter blur-3xl opacity-10 animate-blob-slow animation-delay-6000"></div>
      </div>
      <HeroBackground theme={bgtheme} density="medium" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="backdrop-blur-md bg-white/70 border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black bg-black bg-clip-text text-transparent">HxI</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-6 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
                  Discover
                </button>
                <button className="px-2 md:px-6 py-2 bg-linear-to-r from-blue-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-0">
          {/* Floating Elements Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-16 h-16 bg-orange-400/30 rounded-full animate-float"></div>
            <div className="absolute top-40 right-1/3 w-12 h-12 bg-teal-400/30 rounded-full animate-float-delayed"></div>
            <div className="absolute bottom-40 left-1/3 w-20 h-20 bg-purple-400/30 rounded-full animate-float-slow"></div>
          </div>

          {/* Hero Section */}
          <div className="py-20 text-center ">
            <h1 className="text-4xl md:text-7xl font-black mb-6 bg-black bg-clip-text text-transparent leading-tight">
              The journey is yours.<br />{`But you don’t have to walk it alone.`}
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              HxI brings real people to guide, share, and support.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
                <div className="relative bg-white rounded-2xl shadow-xl flex items-center overflow-hidden">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Where is my mind..."
                    className="flex-1 px-6 py-5 text-lg outline-none bg-transparent"
                  />
                  <button
                    onClick={handleSearch}
                    className="mx-2 px-4 md:px-8 py-3 bg-black text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Search />
                    Search
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="text-sm text-gray-500">Try:</span>
                {["findjob 💼", "love 💕", "tech 💻", "music 🎧", "lonely 💭", "movie 🎬", "advice 🎯"].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1.5 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full text-sm font-medium text-gray-700 hover:text-orange-600 transition-all shadow-sm hover:shadow-md"
                  >
                    {tag}
                  </button>
                ))}

              </div>
            </div>
          </div>

          {/* Trending Now */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 backdrop-blur-sm">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Trending Searches
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {themeData.trending.map((item, idx) => (
                <button
                  key={idx}
                  onMouseDown={() => setSearchQuery(item.keyword)}
                  onClick={() => handleSearch()}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:shadow-xl transition-all border-2 border-gray-100 hover:border-orange-300 text-left group transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{item.trend}</span>
                  </div>
                  <div className="text-sm font-bold text-gray-700 mb-1">#{item.keyword}</div>
                  <div className="text-2xl font-black text-gray-800 group-hover:text-orange-600 transition-colors">{item.count}</div>
                  <div className="text-xs text-gray-500 mt-1">people asking</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Conversations - Compact */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 backdrop-blur-sm">
                <UserPlus className="w-6 h-6 text-indigo-600" />
                Live Conversations
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {themeData.groups.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all border-2 border-gray-100  group cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative h-32">
                    <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full "></div>
                      {group.online}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white font-bold text-sm truncate">{group.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{group.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {group.members.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {group.messages}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {group.lastActive}
                      </span>
                    </div>
                    <button className="w-full px-3 py-2 bg-black text-white rounded-lg font-bold text-sm hover:shadow-lg transform hover:scale-105 transition-all">
                      Join Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explore by Categories */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                Explore by Category
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
              {themeData.categories.map((category, index) => (
                <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-[1.03] transition-transform duration-300">
                  <img className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity duration-300"
                    data-alt={category.title}
                    src={category.image}
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col gap-2">
                    <category.icon size={28} className="text-white" />
                    <h3 className="text-white text-lg font-bold">{category.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Answers */}
          <div className="mb-16 ">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 backdrop-blur-sm">
                <Star className="w-6 h-6 text-indigo-600" />
                Top Rated Answers
              </h2>
            </div>
            <div className="space-y-4 backdrop-blur-sm">
              {themeData.answers.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                >
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{item.question}</h3>
                  <p className="text-gray-600 mb-4">{item.answer}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-indigo-600">{item.author}</span>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-4 py-2 bg-indigo-50 text-black hover:text-red-500 rounded-lg hover:bg-indigo-100 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="font-semibold">{item.votes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black bg-black bg-clip-text text-transparent">HxI</span>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-600">
                <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
              </div>
              <p className="text-sm text-gray-500">© 2024 HxI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* The Cosmic Modal */}
      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        query={searchQuery}
      />
    </div>
  );
}
