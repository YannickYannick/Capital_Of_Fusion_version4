"use client";

import React from "react";

interface VideoBackgroundProps {
    videoId: string;
    isGrayscale?: boolean;
    enableCycle?: boolean;
}

export default function VideoBackground({ videoId, isGrayscale = false, enableCycle = false }: VideoBackgroundProps) {
    return (
        <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-1000 ${isGrayscale ? 'grayscale' : ''}`}>
            {/* Dark Overlay with Gradient - Pulsing if cycle enabled */}
            <div className={`absolute inset-0 z-10 bg-black/30 bg-gradient-to-t from-black/90 via-black/20 to-black/60 transition-opacity duration-[3000ms] ${enableCycle ? 'animate-pulse opacity-80' : 'opacity-100'}`} />

            {/* YouTube Iframe Wrapper */}
            <div className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-[300%] h-[300%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000 ${enableCycle ? 'opacity-60' : 'opacity-100'}`}>
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1`}
                    title="Background Video"
                    className="w-full h-full pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: "none" }}
                />
            </div>
        </div>
    );
}
