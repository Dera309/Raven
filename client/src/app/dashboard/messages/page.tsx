'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { socketService } from '@/utils/socket';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';

export default function MessagesDashboard() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initChat = async () => {
            try {
                // Get current user for socket connection
                const userData = await api.get('/auth/me');
                setUser(userData.user);
                socketService.connect(userData.user._id);

                // Fetch conversations
                const convData = await api.get('/messages/conversations');
                setConversations(convData.conversations);

                // Check for recipientId in URL
                const params = new URLSearchParams(window.location.search);
                const recipientId = params.get('recipientId');
                if (recipientId) {
                    // Check if conversation already exists
                    let existing = convData.conversations.find((c: any) =>
                        c.participants.some((p: any) => p._id === recipientId)
                    );

                    if (existing) {
                        setActiveConversation(existing);
                    } else {
                        // We'll let ChatWindow handle the creation on first message
                        // Or fetch basic user info to show "New Chat" state
                        const recipient = await api.get(`/auth/users/${recipientId}`);
                        setActiveConversation({
                            _id: null, // Temporary id to signal new conversation
                            participants: [userData.user, recipient.user],
                            isNew: true
                        });
                    }
                }
            } catch (err) {
                console.error('Chat init failed:', err);
            } finally {
                setLoading(false);
            }
        };

        const handleNewMessage = (data: any) => {
            // Update conversation list last message
            setConversations(prev => {
                const index = prev.findIndex(c => c._id === data.conversationId);
                if (index !== -1) {
                    const updated = { ...prev[index], lastMessage: data.message.content, lastMessageAt: data.message.createdAt };
                    const rest = prev.filter((_, i) => i !== index);
                    return [updated, ...rest];
                } else {
                    // Fetch conversations again to get the new one
                    api.get('/messages/conversations').then(d => setConversations(d.conversations));
                    return prev;
                }
            });
        };

        initChat();
        socketService.subscribeToMessages(handleNewMessage);

        return () => {
            socketService.unsubscribeFromMessages();
            socketService.disconnect();
        };
    }, []);

    const handleSelectConversation = (conv: any) => {
        setActiveConversation(conv);
    };

    if (loading) return <div className="p-20 text-center text-gray-500">Loading your messages...</div>;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto h-[calc(100dvh-120px)] flex flex-col md:flex-row gap-4 md:gap-8">
            <div className={`${activeConversation ? 'hidden md:block' : 'block'} w-full md:w-1/3 h-full`}>
                <ConversationList
                    conversations={conversations}
                    currentUserId={user?._id}
                    activeId={activeConversation?._id}
                    onSelect={handleSelectConversation}
                />
            </div>
            <div className={`${activeConversation ? 'block' : 'hidden md:block'} w-full md:flex-1 h-full`}>
                {activeConversation ? (
                    <ChatWindow
                        conversationId={activeConversation._id}
                        currentUserId={user?._id}
                        recipientName={activeConversation.participants.find((p: any) => p._id !== user?._id)?.name}
                        activeConversation={activeConversation}
                        onBack={() => setActiveConversation(null)}
                    />
                ) : (
                    <div className="h-full bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-500 gap-4 p-4">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-center">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
