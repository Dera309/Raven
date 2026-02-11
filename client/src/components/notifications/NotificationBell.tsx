'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { socketService } from '@/utils/socket';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const data = await api.get('/notifications');
            setNotifications(data.notifications);
            setUnreadCount(data.notifications.filter((n: any) => !n.isRead).length);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleNewNotification = (notification: any) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            // Optionally show a toast here
        };

        socketService.subscribeToNotifications(handleNewNotification);
        return () => socketService.unsubscribeFromNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification._id);
        setIsOpen(false);

        // Routing logic based on notification type
        switch (notification.type) {
            case 'message':
                router.push(`/dashboard/messages?conversationId=${notification.relatedId}`);
                break;
            case 'booking_request':
            case 'booking_status':
                // Check user role to redirect correctly
                // For now, generic bookings page
                router.push('/dashboard/bookings');
                break;
            default:
                break;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <header className="p-4 border-b border-zinc-800 flex justify-between items-center">
                            <h3 className="font-bold text-sm">Notifications</h3>
                            <button className="text-[10px] text-zinc-500 hover:text-purple-400 uppercase tracking-widest font-bold">Mark all read</button>
                        </header>
                        <div className="max-h-96 overflow-y-auto scrollbar-hide">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`p-4 border-b border-zinc-800/50 cursor-pointer transition-colors ${n.isRead ? 'opacity-60 grayscale' : 'bg-purple-500/5 hover:bg-purple-500/10'}`}
                                    >
                                        <h4 className="text-xs font-bold text-white mb-1">{n.title}</h4>
                                        <p className="text-[11px] text-zinc-400 line-clamp-2">{n.message}</p>
                                        <span className="text-[9px] text-zinc-600 mt-2 block">
                                            {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-zinc-600 text-xs italic">
                                    No notifications yet.
                                </div>
                            )}
                        </div>
                        <footer className="p-3 border-t border-zinc-800 bg-zinc-900/50 text-center">
                            <button className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest font-bold">See all activity</button>
                        </footer>
                    </div>
                </>
            )}
        </div>
    );
}
