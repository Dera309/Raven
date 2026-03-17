import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Notification from '../models/Notification';
import { socketIO } from '../socket';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'name profilePicture')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ notifications });
    } catch (error: any) {
        console.error('getMyNotifications error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error: any) {
        console.error('markAsRead error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// Internal utility to create and emit notification
export const createNotification = async (recipientId: string, data: any, senderId?: string) => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            sender: senderId,
            ...data
        });
        await notification.save();

        if (socketIO && socketIO.userSockets) {
            const socketId = socketIO.userSockets.get(recipientId);
            if (socketId && socketIO.io) {
                socketIO.io.to(socketId).emit('new_notification', notification);
            }
        }
        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};
