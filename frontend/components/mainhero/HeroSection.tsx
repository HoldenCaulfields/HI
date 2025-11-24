import { Search } from "lucide-react";
import { useState } from "react";

interface Props {
    setSearchQuery: (v: string) => void;
    setIsOpen: (v: boolean) => void;
};

export default function HeroSection({ setSearchQuery, setIsOpen }: Props) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = () => {
        setSearchQuery(searchValue);
        if (searchValue.trim()) {
            setIsOpen(true);
        }
    };

    const handleTagClick = (tag: string) => {
        let keyword = tag.split(' ')[0].toLowerCase();
        setSearchQuery(keyword);
        setSearchValue(keyword);
    }

    return (
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
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
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

    );
}