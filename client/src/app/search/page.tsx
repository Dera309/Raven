'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function SearchPage() {
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
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Raven
                        </Link>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</Link>
                            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
                            <Link href="/register">
                                <Button variant="gradient" size="sm">Join Now</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <header className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Find Your Perfect Talent</h1>
                    <p className="text-gray-400 text-base sm:text-lg">Browse and connect with top-tier video vixens and models.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm sticky top-32">
                            <h2 className="text-xl font-bold mb-6">Filters</h2>
                            <div className="space-y-6">
                                <Input
                                    label="Location"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="e.g. Lagos, Abuja"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Min Rate"
                                        name="minRate"
                                        type="number"
                                        value={filters.minRate}
                                        onChange={handleFilterChange}
                                        placeholder="0"
                                    />
                                    <Input
                                        label="Max Rate"
                                        name="maxRate"
                                        type="number"
                                        value={filters.maxRate}
                                        onChange={handleFilterChange}
                                        placeholder="Any"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isAvailable"
                                        checked={filters.isAvailable}
                                        onChange={(e) => setFilters(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500 focus:ring-offset-black"
                                    />
                                    <label htmlFor="isAvailable" className="text-gray-300">Available Now</label>
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
                        </div>
                    </aside>

                    {/* Vixen Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-96 bg-zinc-900 animate-pulse rounded-2xl border border-white/5"></div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {vixens.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {vixens.map((vixen) => (
                                            <VixenCard key={vixen._id} vixen={vixen} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
                                        <p className="text-gray-500 text-xl mb-6">No results found matching your criteria.</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setFilters({ location: '', minRate: '', maxRate: '', isAvailable: true });
                                                fetchVixens();
                                            }}
                                        >
                                            Reset Filters
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function VixenCard({ vixen }: { vixen: Vixen }) {
    const router = useRouter();
    const mainMedia = vixen.portfolio && vixen.portfolio.length > 0 ? vixen.portfolio[0] : null;

    return (
        <div className="group bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="relative h-72">
                {mainMedia ? (
                    <img
                        src={mainMedia.url}
                        alt={vixen.stageName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                
                {vixen.featured && (
                    <div className="absolute top-4 right-4 bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                        Featured
                    </div>
                )}

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{vixen.stageName}</h3>
                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {vixen.location}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-white font-black text-xl">
                                <span className="text-purple-400 text-sm mr-1">{vixen.currency}</span>
                                {vixen.rate.toLocaleString()}
                            </div>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">per session</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
                <Button 
                    variant="gradient" 
                    className="w-full font-bold uppercase tracking-widest text-xs py-3"
                    onClick={() => router.push(`/login?redirect=/dashboard/artist/booking/new?vixenId=${vixen.user._id}`)}
                >
                    Book Now
                </Button>
                <Link href={`/login?redirect=/dashboard/messages?recipientId=${vixen.user._id}`} className="block">
                    <Button 
                        variant="outline" 
                        className="w-full font-bold uppercase tracking-widest text-xs py-3 border-white/10 text-zinc-400 hover:text-white"
                    >
                        Send Message
                    </Button>
                </Link>
            </div>
        </div>
    );
}
