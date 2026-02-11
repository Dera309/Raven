import express from 'express';
import { getMyNotifications, markAsRead } from '../controllers/NotificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', authMiddleware, getMyNotifications);

// @route   PATCH /api/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private
router.patch('/:notificationId/read', authMiddleware, markAsRead);

export default router;
