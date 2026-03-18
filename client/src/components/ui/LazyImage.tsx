import React, { useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    placeholderColor?: string;
}

export default function LazyImage({ 
    src, 
    alt, 
    className, 
    placeholderColor = 'bg-zinc-800',
    ...props 
}: LazyImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (typeof src === 'string') {
            const img = new Image();
            img.src = src;
            img.onload = () => setLoaded(true);
            img.onerror = () => setError(true);
        }
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Skeleton / Placeholder */}
            {!loaded && !error && (
                <div className={`absolute inset-0 ${placeholderColor} animate-pulse`} />
            )}

            {/* Error State */}
            {error && (
                <div className={`absolute inset-0 ${placeholderColor} flex items-center justify-center text-zinc-700`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            )}

            {/* Actual Image */}
            {src && (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLoaded(true)}
                    {...props}
                />
            )}
        </div>
    );
}
