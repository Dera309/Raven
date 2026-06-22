import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Ad, { AdTier } from '../models/Ad';
import VixenProfile from '../models/VixenProfile';
import User from '../models/User';
import Booking from '../models/Booking';
import axios from 'axios';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

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

        if (!PAYSTACK_SECRET_KEY) {
            return res.status(500).json({ message: 'Payment service not configured' });
        }

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

        const responseData = response.data as any;
        if (!responseData?.data?.authorization_url) {
            throw new Error('Invalid response from Paystack');
        }

        res.status(200).json({
            message: 'Payment initialized',
            authorization_url: responseData.data.authorization_url,
            reference: responseData.data.reference
        });
    } catch (error: any) {
        console.error('Paystack Init Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            return res.status(500).json({ message: 'Invalid Paystack credentials' });
        }
        res.status(500).json({ message: 'Failed to initialize payment' });
    }
};

export const handlePaystackWebhook = async (req: any, res: Response) => {
    try {
        const hash = req.headers['x-paystack-signature'];
        
        // Verify webhook signature for security
        if (PAYSTACK_SECRET_KEY && hash) {
            const hmac = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY);
            hmac.update(JSON.stringify(req.body));
            const calculatedHash = hmac.digest('hex');
            
            if (calculatedHash !== hash) {
                console.error('Invalid webhook signature');
                return res.status(401).send('Invalid signature');
            }
        }

        const event = req.body;

        if (event.event === 'charge.success') {
            const { metadata, reference, amount, status } = event.data;
            const userId = metadata.userId;
            const tier = metadata.tier;
            const bookingId = metadata.bookingId;

            // Verify payment status
            if (status !== 'success') {
                console.error(`Payment not successful for reference ${reference}: ${status}`);
                return res.status(400).send('Payment not successful');
            }

            // Handle booking payment
            if (bookingId) {
                const existingBooking = await Booking.findById(bookingId);
                if (existingBooking && existingBooking.paymentStatus === 'paid') {
                    console.log(`Booking ${bookingId} already paid, skipping`);
                    return res.status(200).send('Webhook processed (duplicate)');
                }

                await Booking.findByIdAndUpdate(bookingId, {
                    paymentStatus: 'paid'
                });
                console.log(`Booking ${bookingId} payment confirmed`);
                return res.status(200).send('Webhook processed');
            }

            // Handle ad promotion payment
            if (tier) {
                // Check if ad already exists for this reference
                const existingAd = await Ad.findOne({ paymentReference: reference });
                if (existingAd) {
                    console.log(`Ad already exists for reference ${reference}, skipping`);
                    return res.status(200).send('Webhook processed (duplicate)');
                }

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

export const getPaystackPublicKey = async (req: any, res: Response) => {
    try {
        if (!PAYSTACK_PUBLIC_KEY) {
            return res.status(500).json({ message: 'Paystack public key not configured' });
        }
        res.status(200).json({ publicKey: PAYSTACK_PUBLIC_KEY });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get public key' });
    }
};
