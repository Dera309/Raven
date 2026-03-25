'use client';

import React from 'react';

interface Conversation {
    _id: string;
    participants: any[];
    lastMessage?: string;
    lastMessageAt?: string;
}

interface ConversationListProps {
    conversations: Conversation[];
    currentUserId: string;
    activeId: string | null;
    onSelect: (conv: Conversation) => void;
}

export default function ConversationList({ conversations, currentUserId, activeId, onSelect }: ConversationListProps) {
    const getRecipient = (conv: Conversation) => {
        return conv.participants.find(p => p._id !== currentUserId);
    };

    return (
        <div className="h-full flex flex-col bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden">
            <header className="p-4 sm:p-6 border-b border-zinc-800">
                <h2 className="text-lg sm:text-xl font-bold text-white">Messages</h2>
            </header>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {conversations.length > 0 ? (
                    conversations.map((conv) => {
                        const recipient = getRecipient(conv);
                        const isActive = activeId === conv._id;
                        return (
                            <div
                                key={conv._id}
                                onClick={() => onSelect(conv)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${isActive
                                        ? 'bg-purple-600/20 border border-purple-500/30'
                                        : 'hover:bg-zinc-800/50 border border-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800">
                                        <img
                                            src={recipient?.profilePicture || '/default-avatar.png'}
                                            alt={recipient?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-white truncate text-sm">{recipient?.name}</h4>
                                        <span className="text-[10px] text-zinc-500 flex-shrink-0 max-w-[100px] truncate">
                                            {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                        </span>
                                    </div>
                                    <p className="text-zinc-500 text-xs truncate">
                                        {conv.lastMessage || 'Start a conversation'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-zinc-600 text-sm italic">
                        No conversations yet.
                    </div>
                )}
            </div>
        </div>
    );
}
