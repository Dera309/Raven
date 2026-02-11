import express from 'express';
import { initiateAdPurchase, handlePaystackWebhook, getAdStatus } from '../controllers/AdController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// @route   POST /api/ads/purchase
// @desc    Initiate ad purchase via Paystack
// @access  Private (Vixen only)
router.post('/purchase', authMiddleware, initiateAdPurchase);

// @route   POST /api/ads/webhook
// @desc    Paystack webhook listener
// @access  Public
router.post('/webhook', handlePaystackWebhook);

// @route   GET /api/ads/status
// @desc    Get current ad status and history
// @access  Private
router.get('/status', authMiddleware, getAdStatus);

export default router;
