"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VideoBackgroundProps {
    // videoId is kept for backward compatibility but ignored for local video now
    videoId?: string;
    videoSrc?: string; // Custom video source, defaults to /Aftermoovie_vibe.mp4
    isGrayscale?: boolean;
    enableCycle?: boolean;
    isVisible?: boolean;
    overlayOpacity?: number; // Overlay opacity (0-1), defaults to 0.3
}

export default function VideoBackground({ videoSrc = "/Aftermoovie_vibe.mp4", isGrayscale = false, enableCycle = false, isVisible = true, overlayOpacity = 0.3 }: VideoBackgroundProps) {
    const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay compatibility
    const videoRef = useRef<HTMLVideoElement>(null);


    // Force play if autoplay fails (Chrome autoplay policy)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const tryPlay = async () => {
            try {
                if (video.paused) {
                    await video.play();
                    console.log('[VideoBackground] Video play() successful');
                }
            } catch (error) {
                console.warn('[VideoBackground] Autoplay prevented, video will play on user interaction:', error);
            }
        };

        // Try to play when video can play
        const handleCanPlay = () => {
            tryPlay();
        };

        video.addEventListener('canplay', handleCanPlay);

        // Also try immediately if video is already ready
        if (video.readyState >= 3) {
            tryPlay();
        }

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
        };
    }, []);



    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            console.error('❌ [VideoBackground] Video element ref is null!');
            return;
        }

        console.log('✅ [VideoBackground] Component mounted');
        console.log('📹 [VideoBackground] Video element properties:', {
            src: video.src,
            autoplay: video.autoplay,
            muted: video.muted,
            loop: video.loop,
            readyState: video.readyState,
            networkState: video.networkState,
            paused: video.paused
        });

        // Event listeners for tracking video loading
        const handleLoadStart = () => console.log('🔄 [VideoBackground] Load started');
        const handleLoadedData = () => console.log('✅ [VideoBackground] Video data loaded');
        const handleCanPlay = () => console.log('▶️ [VideoBackground] Video can play');
        const handlePlaying = () => console.log('🎬 [VideoBackground] Video is playing');
        const handleError = (e: Event) => {
            const videoError = (e.target as HTMLVideoElement).error;
            console.error('❌ [VideoBackground] Video error:', {
                code: videoError?.code,
                message: videoError?.message,
                src: video.src
            });
        };
        const handleStalled = () => console.warn('⏸️ [VideoBackground] Video stalled');
        const handleWaiting = () => console.warn('⏳ [VideoBackground] Video waiting for data');

        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('error', handleError);
        video.addEventListener('stalled', handleStalled);
        video.addEventListener('waiting', handleWaiting);

        return () => {
            video.removeEventListener('loadstart', handleLoadStart);
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('error', handleError);
            video.removeEventListener('stalled', handleStalled);
            video.removeEventListener('waiting', handleWaiting);
            console.log('🔚 [VideoBackground] Component unmounted');
        };
    }, []);

    console.log('[VideoBackground] Video src:', videoSrc, 'Overlay opacity:', overlayOpacity, 'Is visible:', isVisible);
    const toggleMute = () => {
        if (videoRef.current) {
            console.log(`🔊 [VideoBackground] Toggling mute: ${!videoRef.current.muted}`);
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-[-2] overflow-hidden pointer-events-none transition-all duration-1000 ${isGrayscale ? 'grayscale' : ''} ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Dark Overlay with Gradient - Pulsing if cycle enabled */}
                <div className={`absolute inset-0 z-10 transition-opacity duration-[3000ms] ${enableCycle ? 'animate-pulse opacity-80' : 'opacity-100'}`} style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`, backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, ${Math.min(overlayOpacity * 3, 0.9)}), rgba(0, 0, 0, ${overlayOpacity * 0.67}), rgba(0, 0, 0, ${Math.min(overlayOpacity * 2, 0.6)}))` }} />

                {/* Local Video Wrapper */}
                <div className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-[110%] h-[110%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000 ${enableCycle ? 'opacity-60' : 'opacity-100'}`}>
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={videoSrc}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        preload="auto"
                    />
                </div>
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















