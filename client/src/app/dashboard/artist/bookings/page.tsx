'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Booking {
    _id: string;
    projectTitle: string;
    vixen: {
        name: string;
        profilePicture: string;
    };
    date: string;
    status: string;
    rateOffered: number;
    createdAt: string;
}

export default function ArtistBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchBookings = async () => {
        try {
            const data = await api.get('/bookings/my');
            setBookings(data.bookings);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'completed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'declined':
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-black text-white">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Bookings</h1>
                    <p className="text-gray-400 mt-1">Track your project requests and collaborations.</p>
                </div>
                <Button variant="gradient" onClick={() => router.push('/dashboard/artist/discovery')}>
                    Find Vixens
                </Button>
            </header>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-zinc-900 animate-pulse rounded-2xl border border-zinc-800"></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-all cursor-pointer"
                                onClick={() => router.push(`/dashboard/artist/bookings/${booking._id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={booking.vixen.profilePicture || '/default-avatar.png'}
                                        alt={booking.vixen.name}
                                        className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg">{booking.projectTitle}</h3>
                                        <p className="text-gray-400 text-sm">With {booking.vixen.name} • {new Date(booking.date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-white font-semibold">NGN {booking.rateOffered.toLocaleString()}</p>
                                        <p className="text-zinc-500 text-[10px]">Offered Rate</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                    <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                            <p className="text-gray-500">You haven't made any bookings yet.</p>
                            <Button
                                variant="outline"
                                className="mt-4 border-zinc-700"
                                onClick={() => router.push('/dashboard/artist/discovery')}
                            >
                                Explore Vixens
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
