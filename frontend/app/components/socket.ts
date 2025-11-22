import { io, Socket } from 'socket.io-client';

// Assuming the backend is running on port 4000 locally. 
// In production, this would be an environment variable.
const SOCKET_URL = 'http://localhost:4000';

class SocketService {
  public socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinUniverse(query: string) {
    if (this.socket) {
      this.socket.emit('join_universe', query);
    }
  }

  moveNode(query: string, nodeId: string, x: number, y: number) {
    if (this.socket) {
      this.socket.emit('move_node', { query, nodeId, x, y });
    }
  }
}

export const socketService = new SocketService();