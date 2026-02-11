'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';

interface Stats {
    users: { total: number; vixens: number; artists: number };
    bookings: { total: number; active: number; completed: number };
    revenue: { totalAdRevenue: number };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue'>('overview');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsData, usersData, adsData] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/revenue')
            ]);
            setStats(statsData.stats);
            setUsers(usersData.users);
            setAds(adsData.ads);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleUserVerification = async (userId: string, currentStatus: boolean) => {
        try {
            await api.patch(`/admin/users/${userId}`, { isVerified: !currentStatus });
            setUsers(users.map(u => u._id === userId ? { ...u, isVerified: !currentStatus } : u));
        } catch (err) {
            console.error('Failed to update user status:', err);
        }
    };

    if (loading) return <div className="p-20 text-center text-zinc-500">Loading Admin Dashboard...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-black text-white">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent uppercase tracking-tighter">
                        Admin Central
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">Platform overview and management.</p>
                </div>
                <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                    {['overview', 'users', 'revenue'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Revenue" value={`NGN ${(stats?.revenue.totalAdRevenue || 0).toLocaleString()}`} icon="💰" color="text-green-400" />
                        <StatCard title="Total Users" value={stats?.users.total || 0} icon="👥" color="text-blue-400" />
                        <StatCard title="Active Bookings" value={stats?.bookings.active || 0} icon="📅" color="text-purple-400" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-6">User Distribution</h3>
                            <div className="space-y-4">
                                <DistributionBar label="Video Vixens" count={stats?.users.vixens || 0} total={stats?.users.total || 1} color="bg-pink-500" />
                                <DistributionBar label="Music Artists" count={stats?.users.artists || 0} total={stats?.users.total || 1} color="bg-purple-500" />
                            </div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-6">Booking Status</h3>
                            <div className="space-y-4">
                                <DistributionBar label="Completed" count={stats?.bookings.completed || 0} total={stats?.bookings.total || 1} color="bg-blue-500" />
                                <DistributionBar label="In Progress" count={stats?.bookings.active || 0} total={stats?.bookings.total || 1} color="bg-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-800/50">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">User</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Role</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Joined</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
                                                {u.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{u.name}</p>
                                                <p className="text-xs text-zinc-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${u.role === 'vixen' ? 'bg-pink-500/10 text-pink-500' : 'bg-purple-500/10 text-purple-500'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase ${u.isVerified ? 'text-green-400' : 'text-zinc-600'}`}>
                                            {u.isVerified ? 'Verified' : 'Unverified'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-zinc-500">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-[10px] font-bold uppercase tracking-tighter"
                                            onClick={() => toggleUserVerification(u._id, u.isVerified)}
                                        >
                                            {u.isVerified ? 'Unverify' : 'Verify'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'revenue' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 gap-4">
                        {ads.map((ad) => (
                            <div key={ad._id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center group hover:border-purple-500/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold">
                                        {ad.tier.split('_')[0]}d
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Ad Purchase - {ad.user?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-zinc-500">Ref: {ad.paymentReference}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-400 font-black">NGN {ad.amountPaid.toLocaleString()}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{new Date(ad.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                        {ads.length === 0 && (
                            <div className="p-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-500">
                                No revenue data recorded yet.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-zinc-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{icon}</span>
                <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </span>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h2 className={`text-3xl font-black ${color}`}>{value}</h2>
        </div>
    );
}

function DistributionBar({ label, count, total, color }: any) {
    const percentage = Math.round((count / total) * 100);
    return (
        <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                <span className="text-zinc-400">{label}</span>
                <span>{count} ({percentage}%)</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-1000 shadow-lg shadow-purple-500/20`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
