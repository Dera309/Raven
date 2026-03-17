import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';
import Booking, { BookingStatus } from '../models/Booking';
import User, { UserRole } from '../models/User';
import { createNotification } from './NotificationController';

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const { vixenId, projectTitle, description, date, location, rateOffered } = req.body;

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Service temporarily unavailable' });
        }

        // Verify artist role
        const artist = await User.findById(req.user.id);
        if (artist?.role !== UserRole.ARTIST) {
            return res.status(403).json({ message: 'Only artists can create bookings' });
        }

        // Verify vixen exists and is actually a vixen
        const vixen = await User.findById(vixenId);
        if (!vixen || vixen.role !== UserRole.VIXEN) {
            return res.status(404).json({ message: 'Vixen not found' });
        }

        const booking = new Booking({
            artist: req.user.id,
            vixen: vixenId,
            projectTitle,
            description,
            date,
            location,
            rateOffered,
            status: BookingStatus.PENDING
        });

        await booking.save();

        // Create notification for vixen
        try {
            await createNotification(vixenId, {
                type: 'booking_request',
                title: 'New Booking Request',
                message: `You have a new booking request for "${projectTitle}" from ${artist.name}`,
                relatedId: booking._id.toString()
            }, req.user.id);
        } catch (notifError) {
            console.error('Notification error (non-critical):', notifError);
        }

        res.status(201).json({
            message: 'Booking request sent successfully',
            booking
        });
    } catch (error: any) {
        console.error('Booking creation error:', error);
        res.status(500).json({ message: error.message || 'Failed to create booking' });
    }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const { bookingId } = req.params;
        const { status } = req.body;

        const booking = await Booking.findById(bookingId).populate('artist vixen');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Authorization logic:
        // - Vixen can accept/decline/complete their bookings
        // - Artist can cancel their own bookings
        const isVixen = booking.vixen._id.toString() === req.user.id;
        const isArtist = booking.artist._id.toString() === req.user.id;

        if (status === BookingStatus.CANCELLED) {
            // Both can cancel
            if (!isVixen && !isArtist) {
                return res.status(403).json({ message: 'Not authorized to cancel this booking' });
            }
        } else if (status === BookingStatus.ACCEPTED || status === BookingStatus.DECLINED || status === BookingStatus.COMPLETED) {
            // Only vixen can accept/decline/complete
            if (!isVixen) {
                return res.status(403).json({ message: 'Only the vixen can change this status' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid status' });
        }

        booking.status = status;
        await booking.save();

        // Notify artist
        try {
            await createNotification(booking.artist._id.toString(), {
                type: 'booking_status',
                title: 'Booking Status Updated',
                message: `Your booking for "${booking.projectTitle}" has been ${status}`,
                relatedId: booking._id.toString()
            }, req.user.id);
        } catch (notifError) {
            console.error('Notification error (non-critical):', notifError);
        }

        res.status(200).json({
            message: `Booking ${status} successfully`,
            booking
        });
    } catch (error: any) {
        console.error('Update booking status error:', error);
        res.status(500).json({ message: error.message || 'Failed to update booking' });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Service temporarily unavailable' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const query = user.role === UserRole.ARTIST ? { artist: user._id } : { vixen: user._id };

        const bookings = await Booking.find(query)
            .populate('artist', 'name profilePicture')
            .populate('vixen', 'name profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json({ bookings });
    } catch (error: any) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch bookings' });
    }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate('artist', 'name profilePicture email')
            .populate('vixen', 'name profilePicture email');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Ensure user is part of the booking
        if (booking.artist._id.toString() !== req.user.id && booking.vixen._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.status(200).json({ booking });
    } catch (error: any) {
        console.error('Get booking error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch booking' });
    }
};
