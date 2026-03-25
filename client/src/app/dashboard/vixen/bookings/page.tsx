'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Booking {
    _id: string;
    projectTitle: string;
    artist: {
        name: string;
        profilePicture: string;
    };
    date: string;
    status: string;
    rateOffered: number;
    createdAt: string;
}

export default function VixenBookingsPage() {
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

    const handleStatusUpdate = async (bookingId: string, status: string) => {
        try {
            await api.patch(`/bookings/${bookingId}/status`, { status });
            // Update local state
            setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update booking status');
        }
    };

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
        <div className="p-4 sm:p-6 max-w-5xl mx-auto min-h-screen bg-black text-white">
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Project Requests</h1>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage incoming booking requests from music artists.</p>
            </header>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-zinc-900 animate-pulse rounded-2xl border border-zinc-800"></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-all shadow-xl shadow-black/40"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <img
                                        src={booking.artist.profilePicture || '/default-avatar.png'}
                                        alt={booking.artist.name}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-zinc-800 shadow-lg"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-xl">{booking.projectTitle}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(booking.status)} uppercase tracking-tighter`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">Artist: <span className="text-white font-medium">{booking.artist.name}</span></p>
                                        <p className="text-zinc-500 text-xs mt-1">Shoot Date: {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-2xl font-black text-purple-400">NGN {booking.rateOffered.toLocaleString()}</p>
                                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Total Budget</p>
                                    </div>

                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="py-1 px-4 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                                                onClick={() => handleStatusUpdate(booking._id, 'declined')}
                                            >
                                                Decline
                                            </Button>
                                            <Button
                                                variant="gradient"
                                                className="py-1 px-4 text-xs"
                                                onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                                            >
                                                Accept
                                            </Button>
                                        </div>
                                    )}

                                    {booking.status === 'accepted' && (
                                        <Button
                                            variant="outline"
                                            className="py-1 px-4 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                            onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                        >
                                            Mark Completed
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No incoming project requests yet.</p>
                            <p className="text-zinc-600 text-sm mt-1">Complete your profile to increase your visibility!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
