'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-white hover:text-purple-400 transition-colors"
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeMenu}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-zinc-900 border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Close Button */}
                    <div className="flex justify-end p-4">
                        <button
                            onClick={closeMenu}
                            className="p-2 text-white hover:text-purple-400 transition-colors"
                            aria-label="Close menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex flex-col space-y-6 px-8 py-4">
                        <Link
                            href="/search"
                            className="text-white hover:text-purple-400 transition-colors text-lg font-medium"
                            onClick={closeMenu}
                        >
                            Find Vixens
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="text-white hover:text-purple-400 transition-colors text-lg font-medium"
                            onClick={closeMenu}
                        >
                            How it Works
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-white hover:text-purple-400 transition-colors text-lg font-medium"
                            onClick={closeMenu}
                        >
                            Pricing
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
}
