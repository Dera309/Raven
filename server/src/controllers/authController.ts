import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';

// Generate JWT
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / (1000 * 60));
            return res.status(403).json({ 
                message: `Account is temporarily locked. Try again in ${remainingMinutes} minutes.` 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password as string);

        if (isMatch) {
            // Reset login attempts on success
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            // Increment login attempts on failure - ensure it's a number
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 3 * 60 * 60 * 1000); // Lock for 3 hours
                await user.save();
                return res.status(403).json({ 
                    message: 'Too many failed attempts. Account locked for 3 hours.' 
                });
            }

            await user.save();
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
    try {
        res.status(200).json(req.user);
    } catch (error: any) {
        console.error('getMe error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
