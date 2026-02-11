'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

interface Vixen {
    _id: string;
    stageName: string;
    location: string;
    rate: number;
    currency: string;
    rating: number;
    featured: boolean;
    portfolio: any[];
    user: {
        _id: string;
        name: string;
        profilePicture: string;
    };
}

export default function VixenDiscovery() {
    const [vixens, setVixens] = useState<Vixen[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: '',
        minRate: '',
        maxRate: '',
        isAvailable: true
    });
    const router = useRouter();

    const fetchVixens = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                location: filters.location,
                minRate: filters.minRate,
                maxRate: filters.maxRate,
                isAvailable: filters.isAvailable.toString()
            });
            const data = await api.get(`/profiles/vixens?${queryParams}`);
            setVixens(data.vixens);
        } catch (error) {
            console.error('Failed to fetch vixens:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVixens();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-black text-white">
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Discover Vixens
                </h1>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Find the perfect talent for your next project.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1 bg-zinc-900/50 p-4 sm:p-6 rounded-2xl border border-zinc-800 h-fit lg:sticky lg:top-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Filters</h2>

                    <div className="space-y-4 sm:space-y-6">
                        <Input
                            label="Location"
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            placeholder="e.g. Lagos, Abuja"
                        />

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <Input
                                label="Min Rate"
                                name="minRate"
                                type="number"
                                value={filters.minRate}
                                onChange={handleFilterChange}
                                placeholder="0"
                                className="min-w-0"
                            />
                            <Input
                                label="Max Rate"
                                name="maxRate"
                                type="number"
                                value={filters.maxRate}
                                onChange={handleFilterChange}
                                placeholder="Any"
                                className="min-w-0"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                checked={filters.isAvailable}
                                onChange={(e) => setFilters(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-purple-500"
                            />
                            <label htmlFor="isAvailable" className="text-sm text-gray-300">Available Now</label>
                        </div>

                        <Button
                            className="w-full"
                            variant="gradient"
                            onClick={fetchVixens}
                            isLoading={loading}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </aside>

                {/* Vixen Grid */}
                <main className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-80 bg-zinc-900 animate-pulse rounded-2xl border border-zinc-800"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {vixens.length > 0 ? (
                                vixens.map((vixen) => (
                                    <VixenCard key={vixen._id} vixen={vixen} />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <p className="text-gray-500 text-lg">No vixens found matching your criteria.</p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => {
                                            setFilters({ location: '', minRate: '', maxRate: '', isAvailable: true });
                                            fetchVixens();
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function VixenCard({ vixen }: { vixen: Vixen }) {
    const router = useRouter();
    const mainMedia = vixen.portfolio && vixen.portfolio.length > 0 ? vixen.portfolio[0] : null;

    return (
        <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
            {/* Media Preview */}
            <div className="relative h-64 bg-zinc-800">
                {mainMedia ? (
                    <img
                        src={mainMedia.url}
                        alt={vixen.stageName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {vixen.featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Featured
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-xl font-bold text-white">{vixen.stageName}</h3>
                            <p className="text-zinc-300 text-sm flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {vixen.location}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-purple-400 font-bold">{vixen.currency} {vixen.rate.toLocaleString()}</p>
                            <p className="text-zinc-500 text-[10px]">per session</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-3 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                    variant="gradient"
                    className="py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide sm:tracking-widest"
                    onClick={() => router.push(`/dashboard/artist/booking/new?vixenId=${vixen._id}`)}
                >
                    Book Now
                </Button>
                <Button
                    variant="outline"
                    className="py-2 text-[9px] sm:text-[10px] font-bold border-zinc-700 text-zinc-300 hover:text-white uppercase tracking-wide sm:tracking-widest"
                    onClick={() => router.push(`/dashboard/messages?recipientId=${vixen.user._id}`)}
                >
                    Message
                </Button>
            </div>
        </div>
    );
}
