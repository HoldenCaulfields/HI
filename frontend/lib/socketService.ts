// lib/socketService.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

class SocketService {
  public socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token?: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: { token: token || localStorage.getItem('hxi_token') },
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Universe methods
  joinUniverse(query: string) {
    this.socket?.emit('join_universe', query);
  }

  leaveUniverse(query: string) {
    this.socket?.emit('leave_universe', query);
  }

  moveNode(query: string, nodeId: string, x: number, y: number) {
    this.socket?.emit('move_node', { query, nodeId, x, y });
  }

  // Group methods
  joinGroup(groupId: string) {
    this.socket?.emit('join_group', { groupId });
  }

  leaveGroup(groupId: string) {
    this.socket?.emit('leave_group', { groupId });
  }

  sendGroupMessage(groupId: string, content: string, type = 'text', fileUrl?: string) {
    this.socket?.emit('send_group_message', { groupId, content, type, fileUrl });
  }

  typingGroup(groupId: string, isTyping: boolean) {
    this.socket?.emit('typing_group', { groupId, isTyping });
  }

  // Private chat methods
  joinPrivateChat(targetUserId: string) {
    this.socket?.emit('join_private_chat', { targetUserId });
  }

  sendPrivateMessage(targetUserId: string, content: string, type = 'text', fileUrl?: string) {
    this.socket?.emit('send_private_message', { targetUserId, content, type, fileUrl });
  }

  // Answer methods
  likeAnswer(answerId: string, action: 'like' | 'unlike') {
    this.socket?.emit('like_answer', { answerId, action });
  }

  // Event listeners
  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();