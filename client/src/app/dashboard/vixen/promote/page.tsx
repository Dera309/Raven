'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';

const TIERS = [
    {
        id: '7_days',
        name: 'Weekly Boost',
        price: '5,000',
        duration: '7 Days',
        features: ['Priority in search results', 'Featured Badge', 'Increased visibility'],
        color: 'from-amber-400 to-orange-500'
    },
    {
        id: '30_days',
        name: 'Monthly Pro',
        price: '15,000',
        duration: '30 Days',
        features: ['30 days of priority', 'Premium Featured Badge', 'Analytics (Coming Soon)', 'Higher reach'],
        color: 'from-purple-500 to-pink-600',
        popular: true
    },
    {
        id: '90_days',
        name: 'Quarterly Star',
        price: '40,000',
        duration: '90 Days',
        features: ['Maximized visibility', 'VVIP Featured Badge', 'Priority support', '24/7 exposure'],
        color: 'from-blue-500 to-cyan-400'
    }
];

export default function PromoteProfilePage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchStatus = async () => {
        try {
            const data = await api.get('/ads/status');
            setStatus(data);
        } catch (err) {
            console.error('Failed to fetch ad status:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handlePurchase = async (tier: string) => {
        setSubmitting(true);
        try {
            const response = await api.post('/ads/purchase', { tier });
            if (response.authorization_url) {
                window.location.href = response.authorization_url;
            }
        } catch (err: any) {
            alert(err.message || 'Failed to initialize payment');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-500">Loading promotion status...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto min-h-screen">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black bg-gradient-to-r from-amber-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                    Boost Your Visibility
                </h1>
                <p className="text-gray-400 mt-4 text-lg">Promote your profile to the top of search results and attract more music artists.</p>
            </header>

            {status?.featured && (
                <div className="mb-12 bg-zinc-900 border border-amber-500/30 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-amber-500/5">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Your Profile is Featured!</h2>
                            <p className="text-gray-400">Collaborations are easier when you're at the top.</p>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Expires On</p>
                        <p className="text-amber-400 text-xl font-bold">{new Date(status.featuredExpiresAt).toLocaleDateString()}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TIERS.map((tier) => (
                    <div
                        key={tier.id}
                        className={`relative bg-zinc-900 border ${tier.popular ? 'border-purple-500/50 scale-105' : 'border-zinc-800'} p-8 rounded-3xl flex flex-col transition-all hover:border-zinc-700 shadow-xl`}
                    >
                        {tier.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm text-gray-500 font-medium">NGN</span>
                                <span className="text-4xl font-black text-white">{tier.price}</span>
                            </div>
                            <p className="text-zinc-500 text-sm mt-1">{tier.duration}</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant={tier.popular ? 'gradient' : 'outline'}
                            className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all ${!tier.popular && 'border-zinc-800 hover:border-zinc-600'}`}
                            onClick={() => handlePurchase(tier.id)}
                            isLoading={submitting}
                        >
                            Promote Now
                        </Button>
                    </div>
                ))}
            </div>

            <section className="mt-20">
                <h2 className="text-2xl font-bold mb-8 text-center">Promotion History</h2>
                <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900">
                                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Tier</th>
                                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Amount</th>
                                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status?.history?.length > 0 ? (
                                status.history.map((ad: any) => (
                                    <tr key={ad._id} className="border-b border-zinc-900 hover:bg-zinc-800/30">
                                        <td className="p-4 text-sm text-gray-300">{new Date(ad.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm font-medium text-white">{ad.tier.replace('_', ' ')}</td>
                                        <td className="p-4 text-sm text-gray-300">NGN {ad.amountPaid.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${ad.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                {ad.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500 italic">No previous promotions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
