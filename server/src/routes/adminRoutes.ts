import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';
import {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getRevenueDetails
} from '../controllers/AdminController';

const router = express.Router();

// All routes here require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:userId', updateUserStatus);
router.get('/revenue', getRevenueDetails);

export default router;
