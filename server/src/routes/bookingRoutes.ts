import express from 'express';
import {
    createBooking,
    updateBookingStatus,
    getMyBookings,
    getBookingById,
    initiateBookingPayment,
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

// @route   POST /api/bookings/payment
// @desc    Initiate booking payment via Paystack
// @access  Private (Artist only)
router.post('/payment', authMiddleware, initiateBookingPayment);

export default router;
