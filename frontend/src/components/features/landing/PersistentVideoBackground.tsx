"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { usePathname } from "next/navigation";
import { useVideoBackground } from "@/contexts/VideoBackgroundContext";
import { usePlanetsOptions } from "@/contexts/PlanetsOptionsContext";

/**
 * PersistentVideoBackground - A video component that persists across page navigations.
 * 
 * This component is mounted at the Providers level (root) so it never unmounts
 * when navigating between pages, ensuring seamless video playback.
 * 
 * The overlay opacity and other visual settings are controlled via context,
 * allowing different pages to adjust the appearance without remounting the video.
 * 
 * On /explore page, this video cycles opacity to blend with SecondaryVideoOverlay.
 */
export default function PersistentVideoBackground() {
    const { videoRef, isMuted, toggleMute, overlayOpacity, isGrayscale } = useVideoBackground();
    const { videoCycleVisible, videoCycleHidden, videoTransitionDuration } = usePlanetsOptions();
    const pathname = usePathname();
    const isExplorePage = pathname === '/explore';
    
    // Cycle state for /explore page blend effect
    const [showVideo, setShowVideo] = useState(true);
    
    // Cycle logic - only active on /explore page
    useEffect(() => {
        if (!isExplorePage) {
            setShowVideo(true); // Always visible on other pages
            return;
        }
        
        const cycleDuration = showVideo ? videoCycleVisible * 1000 : videoCycleHidden * 1000;
        
        const timeout = setTimeout(() => {
            setShowVideo(prev => !prev);
        }, cycleDuration);
        
        return () => clearTimeout(timeout);
    }, [isExplorePage, showVideo, videoCycleVisible, videoCycleHidden]);

    // Autoplay handling
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video is muted for autoplay compliance
        video.muted = isMuted;

        const tryPlay = async () => {
            try {
                if (video.paused) {
                    await video.play();
                    console.log('[PersistentVideo] Video play() successful');
                }
            } catch (error) {
                console.warn('[PersistentVideo] Autoplay prevented:', error);
                // Force muted and retry
                video.muted = true;
                setTimeout(() => {
                    video.play().catch(e => console.warn('[PersistentVideo] Retry play failed:', e));
                }, 500);
            }
        };

        const handleCanPlay = () => tryPlay();
        const handleLoadedData = () => {
            video.muted = isMuted;
            tryPlay();
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('loadeddata', handleLoadedData);

        // Try immediately if already ready
        if (video.readyState >= 2) {
            tryPlay();
        }

        // Fallback timeout
        const timeoutId = setTimeout(() => {
            if (video.paused) {
                tryPlay();
            }
        }, 1000);

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('loadeddata', handleLoadedData);
            clearTimeout(timeoutId);
        };
    }, [videoRef, isMuted]);

    // Sync muted state when it changes
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = isMuted;
        }
    }, [isMuted, videoRef]);

    return (
        <>
            {/* Video Background Container - fixed position, z-0 */}
            <div 
                className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-all ${isGrayscale ? 'grayscale' : ''}`}
                style={{
                    opacity: isExplorePage ? (showVideo ? 1 : 0) : 1,
                    transitionDuration: isExplorePage ? `${videoTransitionDuration}ms` : '1000ms'
                }}
            >
                {/* Video Element */}
                <div className="absolute inset-0 w-full h-full">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src="/Aftermoovie_vibe.mp4"
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        preload="auto"
                        webkit-playsinline="true"
                        x5-playsinline="true"
                    />
                </div>

                {/* Dark Overlay with Gradient - opacity controlled via context */}
                <div 
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ 
                        backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`, 
                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, ${Math.min(overlayOpacity * 3, 0.9)}), rgba(0, 0, 0, ${overlayOpacity * 0.67}), rgba(0, 0, 0, ${Math.min(overlayOpacity * 2, 0.6)}))` 
                    }} 
                />
            </div>

            {/* Sound Toggle Button - Outside pointer-events-none container */}
            <button
                onClick={toggleMute}
                className="fixed bottom-8 right-8 z-50 pointer-events-auto group"
                aria-label={isMuted ? "Activer le son" : "Désactiver le son"}
            >
                <div className="relative">
                    {/* Glassmorphism background */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110" />

                    {/* Icon */}
                    <div className="relative p-4">
                        {isMuted ? (
                            <VolumeX className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                            <Volume2 className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                        )}
                    </div>
                </div>
            </button>
        </>
    );
}
