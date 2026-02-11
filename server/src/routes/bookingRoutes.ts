import express from 'express';
import {
    createBooking,
    updateBookingStatus,
    getMyBookings,
    getBookingById,
} from '../controllers/BookingController';
import { authMiddleware } from '../middleware/authMiddleware';
import { bookingValidation, bookingIdValidation } from '../middleware/validators';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking (Artist only)
// @access  Private
router.post('/', authMiddleware, bookingValidation, createBooking);

// @route   GET /api/bookings/my
// @desc    Get current user's bookings
// @access  Private
router.get('/my', authMiddleware, getMyBookings);

// @route   GET /api/bookings/:bookingId
// @desc    Get booking details
// @access  Private
router.get('/:bookingId', authMiddleware, bookingIdValidation, getBookingById);

// @route   PATCH /api/bookings/:bookingId/status
// @desc    Update booking status (Accept/Decline/Cancel)
// @access  Private
router.patch('/:bookingId/status', authMiddleware, bookingIdValidation, updateBookingStatus);

export default router;
