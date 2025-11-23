// hooks/useGroupChat.ts
import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { socketService } from '@/lib/socketService';

interface Message {
  _id: string;
  senderId: any;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  createdAt: Date;
}

// Add NodeType enum
export enum NodeType {
  ROOT = 'ROOT',
  USER = 'USER',
  GROUP = 'GROUP',
  ANSWER = 'ANSWER',
  KEYWORD = 'KEYWORD'
}

export function useGroupChat(groupId: string) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket || !isConnected || !groupId) return;

    socketService.joinGroup(groupId);

    const handleHistory = (data: { groupId: string; messages: Message[] }) => {
      if (data.groupId === groupId) {
        setMessages(data.messages);
        setLoading(false);
      }
    };

    const handleNewMessage = (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    };

    const handleUserJoined = (data: { onlineCount: number }) => {
      setOnlineCount(data.onlineCount);
    };

    const handleUserLeft = (data: { onlineCount: number }) => {
      setOnlineCount(data.onlineCount);
    };

    const handleTyping = (data: { username: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev, data.username]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== data.username));
      }
    };

    socket.on('group_history', handleHistory);
    socket.on('receive_group_message', handleNewMessage);
    socket.on('user_joined_group', handleUserJoined);
    socket.on('user_left_group', handleUserLeft);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('group_history', handleHistory);
      socket.off('receive_group_message', handleNewMessage);
      socket.off('user_joined_group', handleUserJoined);
      socket.off('user_left_group', handleUserLeft);
      socket.off('user_typing', handleTyping);
      
      socketService.leaveGroup(groupId);
    };
  }, [socket, isConnected, groupId]);

  const sendMessage = useCallback((content: string, type = 'text') => {
    socketService.sendGroupMessage(groupId, content, type);
  }, [groupId]);

  const setTyping = useCallback((isTyping: boolean) => {
    socketService.typingGroup(groupId, isTyping);
  }, [groupId]);

  return {
    messages,
    typingUsers,
    onlineCount,
    loading,
    sendMessage,
    setTyping
  };
}