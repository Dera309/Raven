'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';
import NotificationBell from '../../../components/notifications/NotificationBell';

export default function VixenDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center font-bold text-xl sm:text-2xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                Raven
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                            <NotificationBell />
                            <span className="hidden sm:inline text-zinc-400 text-sm truncate max-w-[100px] md:max-w-none">Welcome, <span className="text-white font-bold">{user?.name}</span></span>
                            <Button onClick={logout} variant="outline" size="sm" className="border-zinc-700 hover:border-zinc-500 text-xs sm:text-sm">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg min-h-96 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">Vixen Dashboard</h2>
                        <p className="text-gray-500 mb-6">Manage your portfolio and bookings.</p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button onClick={() => router.push('/dashboard/vixen/edit-profile')} className="w-full sm:w-auto">Update Portfolio</Button>
                            <Button variant="secondary" onClick={() => router.push('/dashboard/vixen/bookings')} className="w-full sm:w-auto">View Requests</Button>
                            <Button variant="outline" onClick={() => router.push('/dashboard/vixen/edit-profile')} className="w-full sm:w-auto">Profile Settings</Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
