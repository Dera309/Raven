'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { api } from '../../../../utils/api';

export default function ArtistEditProfile() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        stageName: '',
        bio: '',
        genre: '',
        location: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.get('/profiles/me');
                if (data.profile) {
                    setFormData({
                        stageName: data.profile.stageName || '',
                        bio: data.profile.bio || '',
                        genre: data.profile.genre || '',
                        location: data.profile.location || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            if (user.role !== 'artist') {
                router.push('/dashboard/vixen');
            } else {
                fetchProfile();
            }
        }
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            await api.post('/profiles/artist', formData);
            setMessage('Profile updated successfully!');
            setTimeout(() => router.push('/dashboard/artist'), 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                    <div className="px-8 py-10">
                        <h1 className="text-3xl font-extrabold text-white mb-8 border-b border-gray-700 pb-4">
                            Edit Artist Profile
                        </h1>

                        {error && (
                            <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-xl">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Stage Name / Group Name"
                                name="stageName"
                                value={formData.stageName}
                                onChange={handleChange}
                                placeholder="e.g. Burna Boy, Star Boy Crew"
                                required
                                className="bg-gray-700 border-gray-600 text-white"
                            />

                            <Input
                                label="Primary Genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                placeholder="e.g. Afrobeats, Hip Hop, Amapiano"
                                required
                                className="bg-gray-700 border-gray-600 text-white"
                            />

                            <Input
                                label="Base Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Lagos, Nigeria"
                                required
                                className="bg-gray-700 border-gray-600 text-white"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Short Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-sans"
                                    placeholder="Tell us about your musical journey..."
                                ></textarea>
                            </div>

                            <div className="pt-8 border-t border-gray-700">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
