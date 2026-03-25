import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
import ArtistProfile from '../models/ArtistProfile';
import VixenProfile from '../models/VixenProfile';

export const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profile;
        if (user.role === UserRole.ARTIST) {
            profile = await ArtistProfile.findOne({ user: user.id });
        } else if (user.role === UserRole.VIXEN) {
            profile = await VixenProfile.findOne({ user: user.id });
        }

        res.json({ user, profile });
    } catch (error) {
        console.error('getMyProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateArtistProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        const { stageName, bio, genre, location } = req.body;

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Service temporarily unavailable' });
        }

        let profile = await ArtistProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: { stageName, bio, genre, location } },
            { new: true, upsert: true }
        );

        res.json(profile);
    } catch (error) {
        console.error('updateArtistProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateVixenProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        const {
            stageName,
            bio,
            location,
            rate,
            currency,
            isAvailable,
            measurements,
            socialLinks,
        } = req.body;

        let profile = await VixenProfile.findOneAndUpdate(
            { user: req.user.id },
            {
                $set: {
                    stageName,
                    bio,
                    location,
                    rate,
                    currency,
                    isAvailable,
                    measurements,
                    socialLinks,
                },
            },
            { new: true, upsert: true }
        );

        res.json(profile);
    } catch (error) {
        console.error('updateVixenProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPublicProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.userId).select('name role profilePicture');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profile;
        if (user.role === UserRole.ARTIST) {
            profile = await ArtistProfile.findOne({ user: user.id });
        } else if (user.role === UserRole.VIXEN) {
            profile = await VixenProfile.findOne({ user: user.id });
        }

        res.json({ user, profile });
    } catch (error) {
        console.error('getPublicProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const uploadMedia = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fileData = req.file as any;
        
        // Construct the file URL based on storage type
        let fileUrl = fileData.path;
        
        // For local storage, construct a relative URL
        if (!fileUrl.startsWith('http')) {
            fileUrl = `/uploads/${fileData.filename}`;
        }

        const newItem = {
            url: fileUrl,
            type: fileData.mimetype.startsWith('video') ? 'video' : 'image',
            publicId: fileData.filename || fileData.public_id,
            description: req.body.description || '',
        };

        let profile;
        if (user.role === UserRole.ARTIST) {
            profile = await ArtistProfile.findOneAndUpdate(
                { user: user.id },
                { $push: { portfolio: newItem } },
                { new: true }
            );
        } else if (user.role === UserRole.VIXEN) {
            profile = await VixenProfile.findOneAndUpdate(
                { user: user.id },
                { $push: { portfolio: newItem } },
                { new: true }
            );
        }

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Please create a profile first.' });
        }

        res.json({
            message: 'Media uploaded successfully',
            portfolio: (profile as any).portfolio
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message || 'Failed to upload media' });
    }
};

export const getAllVixens = async (req: AuthRequest, res: Response) => {
    try {
        const {
            location,
            minRate,
            maxRate,
            minHeight,
            isAvailable,
            page = 1,
            limit = 10
        } = req.query;

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Service temporarily unavailable. Database connection is down.' });
        }

        // Cleanup expired featured statuses
        await VixenProfile.updateMany(
            { featured: true, featuredExpiresAt: { $lt: new Date() } },
            { $set: { featured: false } }
        );

        const query: any = {};

        if (location) query.location = new RegExp(location as string, 'i');

        if (minRate || maxRate) {
            query.rate = {};
            if (minRate) query.rate.$gte = Number(minRate);
            if (maxRate) query.rate.$lte = Number(maxRate);
        }

        if (minHeight) {
            query['measurements.height'] = { $gte: minHeight };
        }

        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        const skip = (Number(page) - 1) * Number(limit);

        // Sort by featured first, then by rating
        const vixens = await VixenProfile.find(query)
            .sort({ featured: -1, rating: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('user', 'name profilePicture');

        const total = await VixenProfile.countDocuments(query);

        res.status(200).json({
            vixens,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error: any) {
        console.error('getAllVixens error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllArtists = async (req: AuthRequest, res: Response) => {
    try {
        const {
            location,
            genre,
            page = 1,
            limit = 10
        } = req.query;

        const query: any = {};

        if (location) query.location = new RegExp(location as string, 'i');
        if (genre) query.genre = new RegExp(genre as string, 'i');

        const skip = (Number(page) - 1) * Number(limit);

        const artists = await ArtistProfile.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('user', 'name profilePicture');

        const total = await ArtistProfile.countDocuments(query);

        res.status(200).json({
            artists,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('getAllArtists error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getVixenProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('name role profilePicture');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.role !== UserRole.VIXEN) {
            return res.status(404).json({ message: 'User is not a vixen' });
        }

        const profile = await VixenProfile.findOne({ user: userId });
        
        res.json({ user, profile });
    } catch (error) {
        console.error('getVixenProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getArtistProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('name role profilePicture');
        
        if (!user || user.role !== UserRole.ARTIST) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Service temporarily unavailable' });
        }

        const profile = await ArtistProfile.findOne({ user: userId });
        
        res.json({ user, profile });
    } catch (error) {
        console.error('getArtistProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
