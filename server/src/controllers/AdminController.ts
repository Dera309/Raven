import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import Booking from '../models/Booking';
import Ad from '../models/Ad';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVixens = await User.countDocuments({ role: 'vixen' });
        const totalArtists = await User.countDocuments({ role: 'artist' });

        const totalBookings = await Booking.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'accepted'] } });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });

        const adRevenue = await Ad.aggregate([
            { $match: { paymentReference: { $exists: true } } },
            { $group: { _id: null, total: { $sum: "$amountPaid" } } }
        ]);

        res.status(200).json({
            stats: {
                users: {
                    total: totalUsers,
                    vixens: totalVixens,
                    artists: totalArtists
                },
                bookings: {
                    total: totalBookings,
                    active: activeBookings,
                    completed: completedBookings
                },
                revenue: {
                    totalAdRevenue: adRevenue.length > 0 ? adRevenue[0].total : 0
                }
            }
        });
    } catch (error: any) {
        console.error('getDashboardStats error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (error: any) {
        console.error('getAllUsers error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const { isVerified } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (typeof isVerified === 'boolean') user.isVerified = isVerified;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error: any) {
        console.error('updateUserStatus error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getRevenueDetails = async (req: AuthRequest, res: Response) => {
    try {
        const ads = await Ad.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ ads });
    } catch (error: any) {
        console.error('getRevenueDetails error:', error);
        res.status(500).json({ message: error.message });
    }
};
