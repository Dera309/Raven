import express from 'express';
import {
    getMyProfile,
    updateArtistProfile,
    updateVixenProfile,
    getPublicProfile,
    uploadMedia,
    getAllVixens,
    getAllArtists,
    getVixenProfile,
    getArtistProfile,
} from '../controllers/ProfileController';
import { authMiddleware } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';
import { artistProfileValidation, vixenProfileValidation, userIdValidation } from '../middleware/validators';

const router = express.Router();

// @route   POST /api/profiles/upload
// @desc    Upload media to portfolio
// @access  Private
router.post('/upload', authMiddleware, upload.single('media'), uploadMedia);

// @route   GET /api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authMiddleware, getMyProfile);

// @route   POST /api/profiles/artist
// @desc    Create or update artist profile
// @access  Private (Artist only)
router.post('/artist', authMiddleware, artistProfileValidation, updateArtistProfile);

// @route   POST /api/profiles/vixen
// @desc    Create or update vixen profile
// @access  Private (Vixen only)
router.post('/vixen', authMiddleware, vixenProfileValidation, updateVixenProfile);

// @route   GET /api/profiles/vixens
// @desc    Get all vixen profiles with filters
// @access  Public
router.get('/vixens', getAllVixens);

// @route   GET /api/profiles/artists
// @desc    Get all artist profiles with filters
// @access  Public
router.get('/artists', getAllArtists);

// @route   GET /api/profiles/vixen/:userId
// @desc    Get vixen profile by user ID
// @access  Public
router.get('/vixen/:userId', userIdValidation, getVixenProfile);

// @route   GET /api/profiles/artist/:userId
// @desc    Get artist profile by user ID
// @access  Public
router.get('/artist/:userId', userIdValidation, getArtistProfile);

// @route   GET /api/profiles/user/:userId
// @desc    Get public profile by user ID
// @access  Public
router.get('/user/:userId', userIdValidation, getPublicProfile);

export default router;
