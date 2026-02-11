import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Ad, { AdTier } from '../models/Ad';
import VixenProfile from '../models/VixenProfile';
import User from '../models/User';
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';

const PRICING: Record<AdTier, number> = {
    [AdTier.WEEKLY]: 5000,
    [AdTier.MONTHLY]: 15000,
    [AdTier.QUARTERLY]: 40000
};

const DURATIONS: Record<AdTier, number> = {
    [AdTier.WEEKLY]: 7,
    [AdTier.MONTHLY]: 30,
    [AdTier.QUARTERLY]: 90
};

export const initiateAdPurchase = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const { tier } = req.body;
        if (!Object.values(AdTier).includes(tier as AdTier)) {
            return res.status(400).json({ message: 'Invalid ad tier' });
        }

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'vixen') {
            return res.status(403).json({ message: 'Only vixens can promote profiles' });
        }

        const amount = PRICING[tier as AdTier];

        // Initialize Paystack Transaction
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            email: user.email,
            amount: amount * 100, // Paystack uses Kobo
            metadata: {
                userId: user._id,
                tier: tier
            },
            callback_url: `${process.env.FRONTEND_URL}/dashboard/vixen/promote/success`
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({
            message: 'Payment initialized',
            authorization_url: (response.data as any).data.authorization_url,
            reference: (response.data as any).data.reference
        });
    } catch (error: any) {
        console.error('Paystack Init Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to initialize payment' });
    }
};

export const handlePaystackWebhook = async (req: any, res: Response) => {
    try {
        const hash = req.headers['x-paystack-signature'];
        // In production, verify the signature here with crypto.createHmac

        const event = req.body;

        if (event.event === 'charge.success') {
            const { metadata, reference, amount } = event.data;
            const userId = metadata.userId;
            const tier = metadata.tier;

            // Update Vixen Profile
            const duration = DURATIONS[tier as AdTier];
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + duration);

            await VixenProfile.findOneAndUpdate(
                { user: userId },
                {
                    featured: true,
                    featuredExpiresAt: expiryDate
                }
            );

            // Create Ad record
            await Ad.create({
                user: userId,
                tier: tier,
                amountPaid: amount / 100,
                startDate: new Date(),
                endDate: expiryDate,
                paymentReference: reference,
                status: 'active'
            });

            console.log(`Ad activated for user ${userId} until ${expiryDate}`);
        }

        res.status(200).send('Webhook processed');
    } catch (error: any) {
        console.error('Webhook Error:', error.message);
        res.status(500).send('Webhook failed');
    }
};

export const getAdStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        const profile = await VixenProfile.findOne({ user: req.user.id }).select('featured featuredExpiresAt');
        const ads = await Ad.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            featured: profile?.featured || false,
            featuredExpiresAt: profile?.featuredExpiresAt,
            history: ads
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
