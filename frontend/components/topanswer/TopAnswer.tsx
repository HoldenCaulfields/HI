import { Star, Heart } from "lucide-react";
import { ThemeMap } from "@/components/ThemeBg";

export default function TopAnswer({ searchQuery }: { searchQuery: string }) {
    const bgtheme = searchQuery.split(' ')[0].toLowerCase();
    const themeData = ThemeMap[bgtheme] || ThemeMap["default"];

    return (
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
                      <span className={`text-sm font-semibold text-indigo-600`}>{item.author}</span>
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
    );
}