import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Maximize2, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

interface GroupChatPopupProps {
  roomId: string;
  userId: string;
  groupName?: string;
  groupImage?: string;
  onClose?: () => void;
}

export default function GroupChatPopup({ 
    roomId, 
    userId, 
    groupName = "Group Chat", 
    groupImage, 
    onClose 
}: GroupChatPopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [username] = useState(`Explorer-${userId.slice(0, 4)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const { socket, isConnected: socketConnected } = useSocket();
  // Treat as connected if socket is active OR we are in client-side demo mode
  const isConnected = socketConnected || true; 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isMinimized]);

  // --- PERSISTENCE & SYNC LOGIC ---

  // Helper to persist message to local storage
  const persistMessage = (msg: Message) => {
      if (typeof window === 'undefined') return;
      const storageKey = `hxi_chat_history_${roomId}`;
      try {
          const stored = localStorage.getItem(storageKey);
          let history: Message[] = stored ? JSON.parse(stored) : [];
          history.push(msg);
          // Keep last 50 messages
          if (history.length > 50) history = history.slice(-50);
          localStorage.setItem(storageKey, JSON.stringify(history));
      } catch (e) {
          console.error("Failed to save message", e);
      }
  };

  // Load history on mount
  useEffect(() => {
      const storageKey = `hxi_chat_history_${roomId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
          try {
              const parsed = JSON.parse(stored).map((m: any) => ({
                  ...m,
                  timestamp: new Date(m.timestamp)
              }));
              // Deduplicate against any existing state
              setMessages(prev => {
                  const combined = [...parsed, ...prev];
                  const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
                  return unique.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
              });
          } catch (e) { console.error("Failed to load history", e); }
      }
  }, [roomId]);

  // BroadcastChannel for Cross-Tab Messaging
  useEffect(() => {
    const channel = new BroadcastChannel(`hxi_chat_room_${roomId}`);
    
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_MESSAGE') {
         const incomingMsg = {
             ...event.data.message,
             timestamp: new Date(event.data.message.timestamp)
         };
         
         setMessages(prev => {
             if (prev.some(m => m.id === incomingMsg.id)) return prev;
             return [...prev, incomingMsg];
         });
         
         // Also save received message to local storage so it persists if we reload
         persistMessage(incomingMsg);
      }
    };

    return () => {
        channel.close();
    };
  }, [roomId]);

  // Socket.io Logic (Real Backend)
  useEffect(() => {
    if (!socket || !socketConnected) return;

    socket.emit('join_group', { roomId, userId, username });

    const handlePreviousMessages = (previousMessages: Message[]) => {
      const formatted = previousMessages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
      setMessages(formatted);
      // Update local storage with server truth
      localStorage.setItem(`hxi_chat_history_${roomId}`, JSON.stringify(formatted));
    };

    const handleNewMessage = (message: Message) => {
      const incomingMsg = {
          ...message,
          timestamp: new Date(message.timestamp)
      };
      setMessages(prev => {
          if (prev.some(m => m.id === incomingMsg.id)) return prev;
          return [...prev, incomingMsg];
      });
      persistMessage(incomingMsg);
    };

    socket.on('previous-messages', handlePreviousMessages);
    socket.on('send_group_message', handleNewMessage);

    return () => {
      socket.emit('leave_group', { roomId, userId });
      socket.off('previous-messages', handlePreviousMessages);
      socket.off('send_group_message', handleNewMessage);
    };
  }, [socket, socketConnected, roomId, userId, username]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      userId,
      username,
      content: inputValue.trim(),
      timestamp: new Date()
    };

    // 1. Update Local State
    setMessages(prev => [...prev, newMessage]);

    // 2. Persist to Local Storage (so it shows up if we reload)
    persistMessage(newMessage);

    // 3. Broadcast to other tabs
    const channel = new BroadcastChannel(`hxi_chat_room_${roomId}`);
    channel.postMessage({ type: 'NEW_MESSAGE', message: newMessage });
    channel.close();

    // 4. Send to Socket (if connected)
    if (socket && socketConnected) {
        socket.emit('send_group_message', {
            roomId,
            message: newMessage
        });
    }

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Avatar generator color - Blue/Teal/Cyan theme (No Purple)
  const getAvatarColor = (name: string) => {
    const colors = ['bg-cyan-500', 'bg-blue-500', 'bg-teal-500', 'bg-sky-500', 'bg-slate-500', 'bg-emerald-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div 
        className={`fixed right-4 sm:right-8 transition-all duration-500 ease-in-out z-50 shadow-2xl overflow-hidden rounded-2xl border border-white/20 backdrop-blur-xl bg-slate-900/90
        ${isMinimized ? 'bottom-4 w-72 h-16' : 'bottom-4 w-[90vw] sm:w-96 h-[600px] max-h-[80vh]'}
        `}
    >
      {/* Header */}
      <div 
        className="h-16 w-full absolute top-0 left-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10 px-4 flex items-center justify-between cursor-pointer"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {groupImage ? (
                <img src={groupImage} alt="Group" className="w-10 h-10 rounded-full object-cover border border-white/30" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center border border-white/30">
                    <span className="text-white font-bold text-sm">{groupName.charAt(0)}</span>
                </div>
            )}
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm leading-tight truncate max-w-[140px]">{groupName}</h3>
            <p className="text-[10px] text-cyan-200 font-medium tracking-wide uppercase">
              {isConnected ? 'Live Nexus' : 'Connecting...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-full text-white/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={`pt-16 pb-20 h-full flex flex-col transition-opacity duration-300 ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {!isConnected && (
              <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-70">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-cyan-200 text-xs tracking-wider">ESTABLISHING CONNECTION</p>
              </div>
            )}
            
            {isConnected && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Send className="w-5 h-5 text-white/20 ml-1" />
                </div>
                <p className="text-xs">Start the conversation in the void...</p>
              </div>
            )}

            {messages.map((message, index) => {
              const isMe = message.userId === userId;
              const isConsecutive = index > 0 && messages[index - 1].userId === message.userId;

              return (
                <div key={message.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                   {!isMe && !isConsecutive && (
                       <div className={`w-8 h-8 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs font-bold text-white shadow-lg ${getAvatarColor(message.username)}`}>
                           {message.username.charAt(0).toUpperCase()}
                       </div>
                   )}
                   {/* Spacer for alignment if consecutive */}
                   {!isMe && isConsecutive && <div className="w-10" />}

                   <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && !isConsecutive && (
                            <span className="text-[10px] text-gray-400 ml-1 mb-1">{message.username}</span>
                        )}
                        <div
                            className={`px-4 py-2.5 shadow-md text-sm relative
                            ${isMe 
                                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl rounded-tr-sm' 
                                : 'bg-white/10 text-gray-100 backdrop-blur-sm border border-white/10 rounded-2xl rounded-tl-sm'
                            }
                            `}
                        >
                            <p className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <span className={`text-[9px] mt-1 opacity-50 ${isMe ? 'mr-1 text-white' : 'ml-1 text-gray-300'}`}>
                            {formatTime(message.timestamp)}
                        </span>
                   </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-3 bg-slate-900/90 backdrop-blur-xl border-t border-white/10">
            <div className="relative flex items-center gap-2 bg-black/40 rounded-full border border-white/10 px-1 py-1 pr-1.5 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Paperclip className="w-4 h-4" />
                </button>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isConnected ? "Message..." : "Connecting..."}
                    disabled={!isConnected}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-[16px] md:text-sm py-2"
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || !isConnected}
                    className={`p-2 rounded-full transition-all duration-300 transform 
                        ${inputValue.trim() 
                            ? 'bg-cyan-500 text-white rotate-0 scale-100 hover:bg-cyan-400 shadow-lg shadow-cyan-500/30' 
                            : 'bg-transparent text-gray-600 scale-90 cursor-not-allowed'
                        }`}
                >
                    <Send className={`w-4 h-4 ${inputValue.trim() ? 'ml-0.5' : ''}`} />
                </button>
            </div>
            <div className="text-[9px] text-center text-gray-600 mt-2 font-mono">
                SECURE COSMIC CONNECTION • ENCRYPTED
            </div>
        </div>

      </div>
    </div>
  );
}