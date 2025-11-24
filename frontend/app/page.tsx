"use client";

import { useState, useEffect } from "react";
import HeroBackground from "@/components/HeroBackground";
import SearchResult from "@/components/SEARCHMODEL/SearchResult";
import { BG_GRADIENT_MAP } from "@/components/ThemeBg";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/mainhero/HeroSection";
import Trending from "@/components/trending/Trending";
import GroupTrending from "@/components/group/GroupTrending";
import TopAnswer from "@/components/topanswer/TopAnswer";
import Category from "@/components/category/Category";
import Footer from "@/components/footer/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  //get background theme
  const bgtheme = searchQuery.split(' ')[0].toLowerCase();
  const themeKey = bgtheme as keyof typeof BG_GRADIENT_MAP;
  const changeBackground = BG_GRADIENT_MAP[themeKey];

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsOpen(true);
    }
  },[searchQuery]);

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
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-0">
          {/* Floating Elements Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-16 h-16 bg-orange-400/30 rounded-full animate-float"></div>
            <div className="absolute top-40 right-1/3 w-12 h-12 bg-teal-400/30 rounded-full animate-float-delayed"></div>
            <div className="absolute bottom-40 left-1/3 w-20 h-20 bg-purple-400/30 rounded-full animate-float-slow"></div>
          </div>

          {/* Hero Section */}
          <HeroSection  setSearchQuery={setSearchQuery} setIsOpen={setIsOpen}/>

          {/* Trending Now */}
          <Trending searchQuery={searchQuery} setSearchQuery={setSearchQuery} setIsOpen={setIsOpen}/>

          {/* Live Conversations - Compact */}
          <GroupTrending searchQuery={searchQuery}/>

          {/* Explore by Categories */}
          <Category searchQuery={searchQuery}/>

          {/* Top Answers */}
          <TopAnswer searchQuery={searchQuery}/>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* The Cosmic Modal */}
      <SearchResult
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        query={searchQuery}
      />
    </div>
  );
}