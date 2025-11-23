import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { socketService } from '@/lib/socketService';

interface PrivateMessage {
  _id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  createdAt: Date;
}

export function usePrivateChat(targetUserId: string) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket || !isConnected || !targetUserId) return;

    socketService.joinPrivateChat(targetUserId);

    const handleHistory = (data: { messages: PrivateMessage[] }) => {
      setMessages(data.messages);
      setLoading(false);
    };

    const handleNewMessage = (msg: PrivateMessage) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on('private_chat_history', handleHistory);
    socket.on('receive_private_message', handleNewMessage);

    return () => {
      socket.off('private_chat_history', handleHistory);
      socket.off('receive_private_message', handleNewMessage);
    };
  }, [socket, isConnected, targetUserId]);

  const sendMessage = useCallback((content: string, type = 'text') => {
    socketService.sendPrivateMessage(targetUserId, content, type);
  }, [targetUserId]);

  return {
    messages,
    loading,
    sendMessage
  };
}