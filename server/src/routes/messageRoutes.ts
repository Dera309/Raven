import express from 'express';
import {
    sendMessage,
    getConversations,
    getMessages
} from '../controllers/MessageController';
import { authMiddleware } from '../middleware/authMiddleware';
import { messageValidation, mongoIdValidation } from '../middleware/validators';

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', authMiddleware, messageValidation, sendMessage);

// @route   GET /api/messages/conversations
// @desc    Get all conversations for user
// @access  Private
router.get('/conversations', authMiddleware, getConversations);

// @route   GET /api/messages/:conversationId
// @desc    Get all messages in a conversation
// @access  Private
router.get('/:conversationId', authMiddleware, mongoIdValidation, getMessages);

export default router;
