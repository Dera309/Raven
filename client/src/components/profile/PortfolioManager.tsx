'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';
import { api } from '../../utils/api';

interface PortfolioItem {
    url: string;
    type: 'image' | 'video';
    description?: string;
    publicId: string;
}

interface PortfolioManagerProps {
    items: PortfolioItem[];
    onUploadSuccess: (newPortfolio: PortfolioItem[]) => void;
}

export default function PortfolioManager({ items, onUploadSuccess }: PortfolioManagerProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [description, setDescription] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (100MB for video, 10MB for images)
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;

        if (file.size > maxSize) {
            setError(`File is too large. Max size for ${isVideo ? 'videos' : 'images'} is ${isVideo ? '100MB' : '10MB'}.`);
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('media', file);
        formData.append('description', description);

        try {
            const response = await api.post('/profiles/upload', formData, true);
            onUploadSuccess(response.portfolio);
            setDescription('');
            e.target.value = '';
        } catch (err: any) {
            setError(err.message || 'Failed to upload media');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMedia = (e: React.MouseEvent<HTMLButtonElement>, publicId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm('Are you sure you want to delete this media?')) {
            const updatedPortfolio = items.filter(item => item.publicId !== publicId);
            onUploadSuccess(updatedPortfolio);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Add to Portfolio</h3>

                {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Media description (optional)..."
                        className="w-full px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                        rows={2}
                    />

                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, MP4 (Max 100MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    {uploading && (
                        <div className="flex items-center space-x-2 text-purple-400 text-sm italic animate-pulse">
                            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading your media...</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <div key={item.publicId} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800 border border-gray-700 shadow-lg">
                        {item.type === 'video' ? (
                            <video
                                src={item.url}
                                className="w-full h-full object-cover"
                                onMouseOver={(e) => e.currentTarget.play()}
                                onMouseOut={(e) => e.currentTarget.pause()}
                                muted
                                loop
                            />
                        ) : (
                            <img
                                src={item.url}
                                alt={item.description || 'Portfolio item'}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                            />
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <p className="text-white text-xs truncate font-medium">{item.description || 'No description'}</p>
                            <div className="flex justify-between mt-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.type === 'video' ? 'bg-blue-500' : 'bg-purple-500'} text-white uppercase`}>
                                    {item.type}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => handleDeleteMedia(e, item.publicId)}
                                    className="text-red-400 hover:text-red-300 transition-colors focus:outline-none"
                                    aria-label="Delete media"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {items.length === 0 && !uploading && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-gray-700 border-dashed rounded-2xl bg-gray-800/20">
                        <p className="text-gray-500 text-sm">Your portfolio is empty. Add your first photo or video!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
