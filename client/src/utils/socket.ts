import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

class SocketService {
    public socket: Socket | null = null;

    connect(userId: string) {
        if (this.socket) return;

        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            // Silent connection in production
            if (process.env.NODE_ENV !== 'production') {
                console.log('Connected to socket server');
            }
            this.socket?.emit('join', userId);
        });

        this.socket.on('disconnect', () => {
            // Silent disconnect in production
            if (process.env.NODE_ENV !== 'production') {
                console.log('Disconnected from socket server');
            }
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    subscribeToMessages(callback: (data: any) => void) {
        if (!this.socket) return;
        this.socket.on('new_message', callback);
    }

    unsubscribeFromMessages() {
        if (!this.socket) return;
        this.socket.off('new_message');
    }

    subscribeToNotifications(callback: (data: any) => void) {
        if (!this.socket) return;
        this.socket.on('new_notification', callback);
    }

    unsubscribeFromNotifications() {
        if (!this.socket) return;
        this.socket.off('new_notification');
    }
}

export const socketService = new SocketService();
