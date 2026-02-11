'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/utils/api';
import { socketService } from '@/utils/socket';
import Button from '@/components/ui/Button';

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        profilePicture: string;
    };
    content: string;
    createdAt: string;
}

interface ChatWindowProps {
    conversationId: string | null;
    currentUserId: string;
    recipientName: string;
    activeConversation: any;
    onBack?: () => void;
}

export default function ChatWindow({ conversationId, currentUserId, recipientName, activeConversation, onBack }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const data = await api.get(`/messages/${conversationId}`);
            setMessages(data.messages);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    useEffect(() => {
        fetchMessages();

        const handleNewMessage = (data: any) => {
            if (data.conversationId === conversationId) {
                setMessages(prev => [...prev, data.message]);
                setTimeout(scrollToBottom, 50);
            }
        };

        socketService.subscribeToMessages(handleNewMessage);
        return () => socketService.unsubscribeFromMessages();
    }, [conversationId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const content = newMessage;
        setNewMessage('');

        try {
            const payload: any = { content };
            if (conversationId) {
                payload.conversationId = conversationId;
            } else {
                // For new conversations, we need the recipient's ID from participants
                const recipient = (activeConversation as any).participants.find((p: any) => p._id !== currentUserId);
                payload.recipientId = recipient._id;
            }

            const data = await api.post('/messages', payload);

            // If it was a new conversation, we might need to update the URL or parent state
            // For now, just add message to local state
            setMessages(prev => [...prev, data.message]);
            setTimeout(scrollToBottom, 50);

            if (!conversationId) {
                // Refresh conversations list to show the new chat
                window.location.href = `/dashboard/messages?conversationId=${data.message.conversation}`;
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
            {/* Header */}
            <header className="p-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Back to conversations"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                        {recipientName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm sm:text-base">{recipientName}</h3>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Online
                        </p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-zinc-600 text-sm italic">
                        Loading conversation...
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[60%] p-3 rounded-2xl text-sm ${msg.sender._id === currentUserId
                                ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-900/20'
                                : 'bg-zinc-800 text-gray-200 rounded-tl-none border border-zinc-700'
                                }`}>
                                <p className="break-words">{msg.content}</p>
                                <span className="text-[9px] opacity-50 block mt-1 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-zinc-800 border-none rounded-2xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-zinc-600"
                />
                <Button type="submit" variant="gradient" className="rounded-2xl p-3 px-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </Button>
            </form>
        </div>
    );
}
