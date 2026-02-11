import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        },
        maxHttpBufferSize: 1e6, // 1MB limit
        pingTimeout: 60000,
        pingInterval: 25000
    });

    const userSockets = new Map<string, string>();

    // Authentication middleware for socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            socket.data.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        const userId = socket.data.userId;

        socket.on('join', (userIdFromClient: string) => {
            // Verify the userId matches the authenticated user
            if (userId === userIdFromClient) {
                userSockets.set(userId, socket.id);
                console.log(`User ${userId} joined with socket ${socket.id}`);
            } else {
                socket.emit('error', 'Unauthorized: User ID mismatch');
            }
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    break;
                }
            }
            console.log('User disconnected:', socket.id);
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    return {
        io,
        userSockets
    };
};

// Global instance to be initialized in index.ts
export let socketIO: { io: Server, userSockets: Map<string, string> };

export const setSocketIO = (instance: { io: Server, userSockets: Map<string, string> }) => {
    socketIO = instance;
};
