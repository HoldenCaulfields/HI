import { TrendingUp } from "lucide-react";
import { ThemeMap } from "@/components/ThemeBg";

interface Props {
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    setIsOpen: (v: boolean) => void;
};

export default function Trending({ searchQuery, setSearchQuery }: Props) {

  const bgtheme = searchQuery.split(' ')[0].toLowerCase();
  const themeData = ThemeMap[bgtheme] || ThemeMap["default"];

  return (
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
            /*  onClick={() => handleSearch()} */
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
  );
}