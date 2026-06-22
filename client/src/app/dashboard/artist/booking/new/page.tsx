'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function BookingForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const vixenId = searchParams.get('vixenId');

    console.log('BookingForm rendered with vixenId:', vixenId);

    const [vixen, setVixen] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        projectTitle: '',
        description: '',
        date: '',
        location: '',
        rateOffered: ''
    });

    useEffect(() => {
        console.log('useEffect called with vixenId:', vixenId);
        if (!vixenId) {
            setError('No vixen ID provided');
            setLoading(false);
            return;
        }

        const fetchVixen = async () => {
            try {
                console.log('Fetching vixen with ID:', vixenId);
                const data = await api.get(`/profiles/vixen/${vixenId}`);
                console.log('Vixen data received:', data);
                setVixen(data.user);
                // Pre-fill rate if available from profile
                if (data.profile?.rate) {
                    setFormData(prev => ({ ...prev, rateOffered: data.profile.rate.toString() }));
                }
            } catch (err: any) {
                console.error('Failed to fetch vixen:', err);
                setError(err.message || 'Vixen not found or unable to fetch details.');
            } finally {
                setLoading(false);
            }
        };

        fetchVixen();
    }, [vixenId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await api.post('/bookings', {
                vixenId,
                ...formData,
                rateOffered: Number(formData.rateOffered)
            });
            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/artist/bookings');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to send booking request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-500">Loading vixen details...</div>;
    if (!vixen && !loading) return (
        <div className="p-20 text-center">
            <div className="text-red-500 mb-4">Vixen not found.</div>
            {error && <div className="text-gray-400 text-sm">{error}</div>}
            <button 
                onClick={() => router.back()}
                className="mt-4 text-purple-500 hover:text-purple-400"
            >
                Go Back
            </button>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto min-h-screen">
            <header className="mb-8 sm:mb-10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full border-2 border-purple-500 overflow-hidden">
                    <img
                        src={vixen.profilePicture || '/default-avatar.png'}
                        alt={vixen.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Book {vixen.name}</h1>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Send a project request to start collaborating.</p>
            </header>

            {success ? (
                <div className="bg-zinc-900 border border-green-500/50 p-8 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Request Sent!</h2>
                    <p className="text-gray-400">Your booking request has been sent to {vixen.name}. Redirecting...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Project Title"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Music Video Shoot - Afrobeat Central"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Project Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                            placeholder="Describe the role, scene, and requirements..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Shoot Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="Studio address or City"
                        />
                    </div>

                    <Input
                        label="Rate Offered (NGN)"
                        name="rateOffered"
                        type="number"
                        value={formData.rateOffered}
                        onChange={handleChange}
                        required
                        placeholder="50000"
                    />

                    <div className="pt-4 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="gradient"
                            className="flex-1"
                            isLoading={submitting}
                        >
                            Send Request
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function NewBookingPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-gray-500">Loading search parameters...</div>}>
            <BookingForm />
        </Suspense>
    );
}
