import express from 'express';
import { createReview, getVixenReviews } from '../controllers/ReviewController';
import { authMiddleware } from '../middleware/authMiddleware';
import { reviewValidation, userIdValidation } from '../middleware/validators';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a review for a completed booking
// @access  Private (Artist only)
router.post('/', authMiddleware, reviewValidation, createReview);

// @route   GET /api/reviews/vixen/:vixenId
// @desc    Get all reviews for a specific vixen
// @access  Public
router.get('/vixen/:vixenId', userIdValidation, getVixenReviews);

export default router;
