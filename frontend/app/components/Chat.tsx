
import React, { useState, useEffect, useRef } from 'react';
import { Message, GraphNode, NodeType } from '../proversion/types';
import { Send, X, MoreVertical, Smile, Paperclip, ThumbsUp } from 'lucide-react';

interface ChatOverlayProps {
  node: GraphNode;
  onClose: () => void;
}

const SIMULATED_USERS = ['Sarah_K', 'DevMike', 'Traveler_99', 'Alice_Wonder', 'Neo_Hacker', 'Cosmic_Ray'];
const GROUP_MESSAGES = [
  "Does anyone have a source for that?",
  "I tried the second method, worked perfectly.",
  "Welcome to the group!",
  "Honestly, I think it depends on the use case.",
  "Has anyone seen the latest update?",
  "lol true",
  "Wait, explain that again?"
];

const ChatOverlay: React.FC<ChatOverlayProps> = ({ node, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const isGroup = node.type === NodeType.GROUP;

  useEffect(() => {
    // Initial History
    const initials: Message[] = [
      {
        id: 'sys', sender: 'HxI System', content: isGroup ? `Joined ${node.label}. Be kind.` : `Start of private chat with ${node.label}`,
        timestamp: new Date(), isMe: false, role: 'mod'
      },
      {
        id: '1', sender: isGroup ? 'Alice_Wonder' : node.label, 
        content: isGroup ? "Hey everyone! Anyone working on the new framework?" : "Hey! I saw you were searching for this too.",
        timestamp: new Date(Date.now() - 60000), isMe: false
      }
    ];
    setMessages(initials);

    // Simulation Interval
    const interval = setInterval(() => {
       if (Math.random() > 0.65) simulateIncoming();
    }, 4000);

    return () => clearInterval(interval);
  }, [node]);

  const simulateIncoming = () => {
    const sender = isGroup ? SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)] : node.label;
    const content = isGroup ? GROUP_MESSAGES[Math.floor(Math.random() * GROUP_MESSAGES.length)] : "That's interesting, tell me more.";
    
    setTypingUsers(prev => [...prev, sender]);
    setTimeout(() => {
      setTypingUsers(prev => prev.filter(u => u !== sender));
      setMessages(prev => [...prev, {
        id: Date.now().toString(), sender, content, timestamp: new Date(), isMe: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender}`
      }]);
    }, 2000);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if(!inputText.trim()) return;
    
    setMessages(prev => [...prev, {
       id: Date.now().toString(), sender: 'Me', content: inputText, timestamp: new Date(), isMe: true
    }]);
    setInputText('');
    
    // Response trigger
    setTimeout(() => {
       const replier = isGroup ? 'DevMike' : node.label;
       setTypingUsers(prev => [...prev, replier]);
       setTimeout(() => {
         setTypingUsers(prev => prev.filter(u => u !== replier));
         setMessages(prev => [...prev, {
           id: Date.now().toString(), sender: replier, 
           content: isGroup ? "Good point." : "Totally agree with you.",
           timestamp: new Date(), isMe: false,
           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${replier}`
         }]);
       }, 1500);
    }, 1000);
  };

  useEffect(() => {
     if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typingUsers]);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-full md:w-[400px] bg-gray-900/95 backdrop-blur-xl border-l border-white/10 flex flex-col z-50 animate-[slideDown_0.3s_ease-out]">
       
       {/* Header */}
       <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                   {isGroup ? '#' : node.label[0]}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
             </div>
             <div>
                <h3 className="text-white font-bold text-sm">{node.label}</h3>
                <p className="text-xs text-gray-400">{isGroup ? `${node.onlineCount || 12} online` : 'Active now'}</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="p-2 text-gray-400 hover:text-white"><MoreVertical size={18}/></button>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-400"><X size={18}/></button>
          </div>
       </div>

       {/* Messages */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg) => (
             <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                {!msg.isMe && msg.role !== 'mod' && (
                   <img src={msg.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} className="w-8 h-8 rounded-full bg-white/10" alt=""/>
                )}
                <div className={`max-w-[75%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                   {!msg.isMe && msg.role !== 'mod' && <span className="text-[10px] text-gray-500 ml-1 mb-1">{msg.sender}</span>}
                   
                   {msg.role === 'mod' ? (
                      <div className="w-full text-center text-[10px] text-gray-500 my-2 uppercase tracking-widest">{msg.content}</div>
                   ) : (
                      <div className={`px-4 py-2 rounded-2xl text-sm relative group ${
                         msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'
                      }`}>
                         {msg.content}
                         {!msg.isMe && <button className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-pink-500 transition-all"><ThumbsUp size={12}/></button>}
                      </div>
                   )}
                </div>
             </div>
          ))}
          {typingUsers.length > 0 && (
             <div className="text-xs text-gray-500 italic ml-12">{typingUsers.join(', ')} is typing...</div>
          )}
       </div>

       {/* Input */}
       <div className="p-4 bg-white/5 border-t border-white/10">
          <form onSubmit={handleSend} className="flex items-center gap-2">
             <button type="button" className="text-gray-400 hover:text-white"><Paperclip size={20}/></button>
             <div className="flex-1 relative">
                <input 
                  value={inputText} onChange={e => setInputText(e.target.value)}
                  className="w-full bg-black/50 text-white rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Type a message..."
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"><Smile size={16}/></button>
             </div>
             <button type="submit" disabled={!inputText.trim()} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 transition-all">
                <Send size={18} />
             </button>
          </form>
       </div>

    </div>
  );
};

export default ChatOverlay;
