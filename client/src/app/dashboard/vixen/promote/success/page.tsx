'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function PromotionSuccessPage() {
    const router = useRouter();

    return (
        <div className="p-6 max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-4xl font-black mb-4">You're Featured!</h1>
            <p className="text-gray-400 text-lg mb-10 max-w-md">
                Your payment was successful and your profile is now being promoted. Get ready for new project requests!
            </p>

            <div className="flex flex-col w-full gap-4">
                <Button
                    variant="gradient"
                    className="w-full py-4 text-sm font-bold uppercase tracking-widest"
                    onClick={() => router.push('/dashboard/vixen')}
                >
                    Go to Dashboard
                </Button>
                <Button
                    variant="outline"
                    className="w-full py-4 text-sm font-bold text-gray-400 border-zinc-800"
                    onClick={() => router.push('/dashboard/vixen/promote')}
                >
                    Check Status
                </Button>
            </div>
        </div>
    );
}
