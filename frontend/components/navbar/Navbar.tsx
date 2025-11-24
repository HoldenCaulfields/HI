import { Globe } from "lucide-react";

export default function Navbar() {
    return (
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
    );
}