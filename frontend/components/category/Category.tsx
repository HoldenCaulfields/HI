import { Sparkles } from "lucide-react";
import { ThemeMap } from "@/components/ThemeBg";

export default function Category({ searchQuery }: { searchQuery: string }) {
  const bgtheme = searchQuery.split(' ')[0].toLowerCase();
  const themeData = ThemeMap[bgtheme] || ThemeMap["default"];

  return (
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
  );
}