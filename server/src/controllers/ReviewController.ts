import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Review from '../models/Review';
import Booking from '../models/Booking';
import VixenProfile from '../models/VixenProfile';

export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const { bookingId, rating, comment } = req.body;

        // Verify booking exists and is completed
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'completed') {
            return res.status(400).json({ message: 'Can only review completed bookings' });
        }

        // Only the artist can review the vixen for now
        if (booking.artist.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the hiring artist can leave a review' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ booking: bookingId, reviewer: req.user.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this booking' });
        }

        const review = new Review({
            booking: bookingId,
            reviewer: req.user.id,
            reviewee: booking.vixen,
            rating,
            comment
        });

        await review.save();

        // Update vixen's average rating
        const reviews = await Review.find({ reviewee: booking.vixen });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await VixenProfile.findOneAndUpdate(
            { user: booking.vixen },
            {
                rating: avgRating,
                reviewCount: reviews.length
            }
        );

        res.status(201).json({
            message: 'Review submitted successfully',
            review
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getVixenReviews = async (req: AuthRequest, res: Response) => {
    try {
        const { vixenId } = req.params;
        const reviews = await Review.find({ reviewee: vixenId })
            .populate('reviewer', 'name profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json({ reviews });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
