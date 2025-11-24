
'use client';
import { Clock, Users, MessageCircle, UserPlus } from "lucide-react";
import { ThemeMap } from "@/components/ThemeBg";
import GroupChatPopup from "../groupchatpopup/GroupChatPopup";
import { useState } from "react";

interface Props {
    searchQuery: string;
}

interface ActiveChatState {
    roomId: string;
    name: string;
    image: string;
}

export default function GroupTrending({ searchQuery }: Props) {
    const bgtheme = searchQuery.split(' ')[0].toLowerCase();
    const themeData = ThemeMap[bgtheme] || ThemeMap["default"];

    const [activeChat, setActiveChat] = useState<ActiveChatState | null>(null);
    const [userId] = useState(() => {
        // Generate or retrieve user ID
        if (typeof window !== 'undefined') {
            let uid = localStorage.getItem('hxi_userId');
            if (!uid) {
                uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('hxi_userId', uid);
            }
            return uid;
        }
        return `user_${Date.now()}`;
    });

    const handleJoinGroup = (group: any, idx: number) => {
        const roomId = `room_${bgtheme}_${idx}`;
        setActiveChat({
            roomId,
            name: group.name,
            image: group.image
        });
    };

    return (
        <div className="mb-16 relative z-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 backdrop-blur-sm">
                    <UserPlus className="w-6 h-6 text-indigo-600" />
                    Live Cosmic Conversations
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {themeData.groups.map((group, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleJoinGroup(group, idx)}
                        className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/20 cursor-pointer transform hover:-translate-y-2 hover:shadow-cyan-500/20 transition-all duration-300 group"
                    >
                        <div className="relative h-40 overflow-hidden">
                            <img
                                src={group.image}
                                alt={group.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                            <div className="absolute top-3 right-3 bg-teal-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                {group.online} Online
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{group.name}</h3>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-200 text-xs mb-4 line-clamp-2 h-8 font-light tracking-wide">{group.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-300 mb-4 bg-black/20 p-2 rounded-lg">
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-cyan-300" />
                                    {group.members.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MessageCircle className="w-3.5 h-3.5 text-blue-300" />
                                    {group.messages}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-teal-300" />
                                    {group.lastActive}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinGroup(group, idx);
                                }}
                                className="w-full px-3 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-cyan-500/30 transform hover:scale-[1.02] active:scale-95 transition-all border border-white/10"
                            >
                                Enter Nexus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {activeChat && (
                <GroupChatPopup
                    roomId={activeChat.roomId}
                    userId={userId}
                    groupName={activeChat.name}
                    groupImage={activeChat.image}
                    onClose={() => setActiveChat(null)}
                />
            )}
        </div>
    );
}
