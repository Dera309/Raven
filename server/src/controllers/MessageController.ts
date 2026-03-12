import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import { socketIO } from '../socket';
import { createNotification } from './NotificationController';

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const { conversationId, content, recipientId } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Message content cannot be empty' });
        }

        let conversation;
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        } else if (recipientId) {
            // Check if conversation already exists between these two
            conversation = await Conversation.findOne({
                participants: { $all: [req.user.id, recipientId] }
            });

            if (!conversation) {
                conversation = new Conversation({
                    participants: [req.user.id, recipientId]
                });
                await conversation.save();
            }
        }

        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        const message = new Message({
            conversation: conversation._id,
            sender: req.user.id,
            content
        });

        await message.save();

        // Update conversation last message
        conversation.lastMessage = content;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Emit via Socket.io if recipient is online
        const participants = (conversation as any).participants;
        participants.forEach(async (p: any) => {
            const pId = p.toString();
            if (pId !== req.user?.id) {
                if (socketIO && socketIO.userSockets) {
                    const socketId = socketIO.userSockets.get(pId);
                    if (socketId && socketIO.io) {
                        socketIO.io.to(socketId).emit('new_message', {
                            message,
                            conversationId: conversation?._id
                        });
                    }
                }

                // Create a persistent notification as well
                try {
                    await createNotification(pId, {
                        type: 'message',
                        title: 'New Message',
                        message: content.length > 50 ? content.substring(0, 47) + '...' : content,
                        relatedId: conversation?._id.toString()
                    }, req.user.id);
                } catch (notifError) {
                    console.error('Notification error:', notifError);
                }
            }
        });

        res.status(201).json({ message });
    } catch (error: any) {
        console.error('Send message error:', error);
        res.status(500).json({ message: error.message || 'Failed to send message' });
    }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const conversations = await Conversation.find({
            participants: req.user.id
        })
            .populate('participants', 'name profilePicture role')
            .sort({ lastMessageAt: -1 });

        res.status(200).json({ conversations });
    } catch (error: any) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch conversations' });
    }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const { conversationId } = req.params;
        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'name profilePicture')
            .sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            { conversation: conversationId, sender: { $ne: req.user.id }, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ messages });
    } catch (error: any) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch messages' });
    }
};
