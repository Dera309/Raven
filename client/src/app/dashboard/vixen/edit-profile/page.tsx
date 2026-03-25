'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import PortfolioManager from '../../../../components/profile/PortfolioManager';
import { api } from '../../../../utils/api';

export default function VixenEditProfile() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [portfolio, setPortfolio] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        stageName: '',
        bio: '',
        location: '',
        rate: '',
        currency: 'NGN',
        isAvailable: true,
        measurements: {
            height: '',
            bust: '',
            waist: '',
            hips: '',
            shoeSize: '',
        },
        socialLinks: {
            instagram: '',
            twitter: '',
            tiktok: '',
        },
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.get('/profiles/me');
                if (data.profile) {
                    setFormData({
                        stageName: data.profile.stageName || '',
                        bio: data.profile.bio || '',
                        location: data.profile.location || '',
                        rate: data.profile.rate?.toString() || '',
                        currency: data.profile.currency || 'NGN',
                        isAvailable: data.profile.isAvailable ?? true,
                        measurements: {
                            height: data.profile.measurements?.height || '',
                            bust: data.profile.measurements?.bust || '',
                            waist: data.profile.measurements?.waist || '',
                            hips: data.profile.measurements?.hips || '',
                            shoeSize: data.profile.measurements?.shoeSize || '',
                        },
                        socialLinks: {
                            instagram: data.profile.socialLinks?.instagram || '',
                            twitter: data.profile.socialLinks?.twitter || '',
                            tiktok: data.profile.socialLinks?.tiktok || '',
                        },
                    });
                    setPortfolio(data.profile.portfolio || []);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            if (user.role !== 'vixen') {
                router.push('/dashboard/artist');
            } else {
                fetchProfile();
            }
        }
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as any),
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleToggle = () => {
        setFormData((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            await api.post('/profiles/vixen', formData);
            setMessage('Profile updated successfully!');
            setTimeout(() => router.push('/dashboard/vixen'), 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                    <div className="px-4 sm:px-8 py-6 sm:py-10">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8 border-b border-gray-700 pb-4">
                            Edit Vixen Profile
                        </h1>

                        {error && (
                            <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl overflow-hidden">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-xl overflow-hidden">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Stage Name"
                                    name="stageName"
                                    value={formData.stageName}
                                    onChange={handleChange}
                                    placeholder="e.g. Diamond Queen"
                                    required
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                                <Input
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Lagos, Nigeria"
                                    required
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-sans"
                                    placeholder="Tell us about yourself..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <Input
                                            label="Rate"
                                            type="number"
                                            name="rate"
                                            value={formData.rate}
                                            onChange={handleChange}
                                            placeholder="Amount"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange as any}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-sans"
                                        >
                                            <option value="NGN">NGN</option>
                                            <option value="GHS">GHS</option>
                                            <option value="USD">USD</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 h-full pt-6">
                                    <button
                                        type="button"
                                        onClick={handleToggle}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 ${formData.isAvailable ? 'bg-purple-600 ring-purple-500' : 'bg-gray-600 ring-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isAvailable ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                    <span className="text-sm text-gray-300 font-medium">Available for Booking</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Measurements</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                    <Input
                                        label="Height"
                                        name="measurements.height"
                                        value={formData.measurements.height}
                                        onChange={handleChange}
                                        placeholder="e.g. 5'8"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <Input
                                        label="Bust"
                                        name="measurements.bust"
                                        value={formData.measurements.bust}
                                        onChange={handleChange}
                                        placeholder="e.g. 34"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <Input
                                        label="Waist"
                                        name="measurements.waist"
                                        value={formData.measurements.waist}
                                        onChange={handleChange}
                                        placeholder="e.g. 26"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <Input
                                        label="Hips"
                                        name="measurements.hips"
                                        value={formData.measurements.hips}
                                        onChange={handleChange}
                                        placeholder="e.g. 38"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <Input
                                        label="Shoe Size"
                                        name="measurements.shoeSize"
                                        value={formData.measurements.shoeSize}
                                        onChange={handleChange}
                                        placeholder="e.g. 39"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Social Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input
                                        label="Instagram"
                                        name="socialLinks.instagram"
                                        value={formData.socialLinks.instagram}
                                        onChange={handleChange}
                                        placeholder="@username"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <Input
                                        label="Twitter (X)"
                                        name="socialLinks.twitter"
                                        value={formData.socialLinks.twitter}
                                        onChange={handleChange}
                                        placeholder="@username"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <Input
                                        label="TikTok"
                                        name="socialLinks.tiktok"
                                        value={formData.socialLinks.tiktok}
                                        onChange={handleChange}
                                        placeholder="@username"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Portfolio Media</h3>
                                <PortfolioManager
                                    items={portfolio}
                                    onUploadSuccess={(newPortfolio) => setPortfolio(newPortfolio)}
                                />
                            </div>

                            <div className="pt-8 border-t border-gray-700">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
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
