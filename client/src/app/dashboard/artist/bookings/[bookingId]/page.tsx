'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ArtistBookingDetailPage() {
    const { bookingId } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reviewMode, setReviewMode] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchBooking = async () => {
        try {
            const data = await api.get(`/bookings/${bookingId}`);
            setBooking(data.booking);
        } catch (err) {
            console.error('Failed to fetch booking:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await api.post('/reviews', {
                bookingId,
                rating,
                comment
            });
            alert('Review submitted! Thank you.');
            setReviewMode(false);
            fetchBooking();
        } catch (err: any) {
            alert(err.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-500">Loading booking details...</div>;
    if (!booking) return <div className="p-20 text-center text-red-500">Booking not found.</div>;

    const statusColors: any = {
        pending: 'text-amber-400',
        accepted: 'text-green-400',
        completed: 'text-blue-400',
        cancelled: 'text-red-400',
        declined: 'text-red-400'
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen">
            <header className="mb-6 sm:mb-8 flex items-center gap-4">
                <Button variant="outline" className="p-2 rounded-full" onClick={() => router.back()}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">{booking.projectTitle}</h1>
                    <p className="text-gray-400 text-xs sm:text-sm">Booking ID: {booking._id}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                        <h2 className="text-lg font-bold mb-4 border-b border-zinc-800 pb-2">Project Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Description</label>
                                <p className="text-gray-300 mt-1">{booking.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Shoot Date</label>
                                    <p className="text-gray-200 mt-1">{new Date(booking.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Location</label>
                                    <p className="text-gray-200 mt-1">{booking.location}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {booking.status === 'completed' && !reviewMode && (
                        <div className="bg-purple-600/10 border border-purple-500/50 p-6 rounded-2xl text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Project Completed!</h3>
                            <p className="text-gray-400 mb-4">How was your experience working with {booking.vixen.name}?</p>
                            <Button variant="gradient" onClick={() => setReviewMode(true)}>
                                Leave a Review
                            </Button>
                        </div>
                    )}

                    {reviewMode && (
                        <section className="bg-zinc-900 p-6 rounded-2xl border border-purple-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-lg font-bold mb-6">Rate Your Experience</h2>
                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                                <div className="flex justify-center gap-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-3xl transition-transform hover:scale-125 ${star <= rating ? 'text-amber-400' : 'text-zinc-700'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Your Feedback</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white min-h-[120px] focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="Tell us about the collaboration..."
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setReviewMode(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="gradient" className="flex-1" isLoading={submittingReview}>
                                        Submit Feedback
                                    </Button>
                                </div>
                            </form>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                        <h2 className="text-lg font-bold mb-4">Talent</h2>
                        <div className="flex items-center gap-4">
                            <img src={booking.vixen.profilePicture || '/default-avatar.png'} className="w-12 h-12 rounded-full border border-zinc-700" alt="" />
                            <div>
                                <p className="font-bold">{booking.vixen.name}</p>
                                <p className="text-zinc-500 text-xs">Video Vixen</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button
                                variant="outline"
                                className="flex-1 py-2 text-xs border-zinc-800"
                                onClick={() => router.push(`/profiles/vixen/${booking.vixen._id}`)}
                            >
                                View Portfolio
                            </Button>
                            <Button
                                variant="gradient"
                                className="flex-1 py-2 text-xs"
                                onClick={() => router.push(`/dashboard/messages?recipientId=${booking.vixen.user}`)}
                            >
                                Message Talent
                            </Button>
                        </div>
                    </section>

                    <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                        <h2 className="text-lg font-bold mb-4">Status & Payment</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Status</span>
                                <span className={`font-bold uppercase text-xs ${statusColors[booking.status]}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Offered Rate</span>
                                <span className="font-bold text-lg">NGN {booking.rateOffered.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Payment</span>
                                <span className="text-amber-400 text-xs font-bold uppercase">{booking.paymentStatus}</span>
                            </div>
                        </div>

                        {booking.status === 'accepted' && (
                            <Button variant="gradient" className="w-full mt-6">
                                Pay Now
                            </Button>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
