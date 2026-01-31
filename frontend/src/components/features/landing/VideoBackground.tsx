"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { usePlanetsOptions } from "@/contexts/PlanetsOptionsContext";

interface VideoBackgroundProps {
    // videoId is kept for backward compatibility but ignored for local video now
    videoId?: string;
    videoSrc?: string; // Primary video source (permanent, base layer)
    secondaryVideoSrc?: string; // Secondary video source (cyclically visible on top)
    enableDualVideo?: boolean; // Enable dual video overlay mode
    isGrayscale?: boolean;
    enableCycle?: boolean;
    isVisible?: boolean;
    overlayOpacity?: number; // Overlay opacity (0-1), defaults to 0.3
}

export default function VideoBackground({ 
    videoSrc = "/background-video.mp4", 
    secondaryVideoSrc = "/Aftermoovie_vibe.mp4",
    enableDualVideo = false,
    isGrayscale = false, 
    enableCycle = false, 
    isVisible = true, 
    overlayOpacity = 0.3 
}: VideoBackgroundProps) {
    const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay compatibility
    const videoRef = useRef<HTMLVideoElement>(null);
    const secondaryVideoRef = useRef<HTMLVideoElement>(null);
    const [showSecondary, setShowSecondary] = useState(false);
    
    // Get video cycle parameters from context
    const { videoCycleVisible, videoCycleHidden, videoTransitionDuration } = usePlanetsOptions();
    
    // Cycle logic for dual video mode
    useEffect(() => {
        if (!enableDualVideo) return;
        
        const cycleDuration = showSecondary ? videoCycleVisible * 1000 : videoCycleHidden * 1000;
        
        const timeout = setTimeout(() => {
            setShowSecondary(prev => !prev);
        }, cycleDuration);
        
        return () => clearTimeout(timeout);
    }, [enableDualVideo, showSecondary, videoCycleVisible, videoCycleHidden]);


    // Force play if autoplay fails (Chrome autoplay policy)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video is muted for autoplay
        video.muted = true;
        video.setAttribute('muted', '');
        
        const tryPlay = async () => {
            try {
                if (video.paused) {
                    await video.play();
                    console.log('[VideoBackground] Video play() successful');
                }
            } catch (error) {
                console.warn('[VideoBackground] Autoplay prevented:', error);
                // Try again after a short delay
                setTimeout(() => {
                    video.muted = true;
                    video.play().catch(e => console.warn('[VideoBackground] Retry play failed:', e));
                }, 500);
            }
        };

        // Try to play when video can play
        const handleCanPlay = () => {
            tryPlay();
        };

        // Try to play when video has loaded metadata
        const handleLoadedMetadata = () => {
            video.muted = true;
            tryPlay();
        };

        // Try to play when video has loaded data
        const handleLoadedData = () => {
            video.muted = true;
            tryPlay();
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('loadeddata', handleLoadedData);

        // Also try immediately if video is already ready
        if (video.readyState >= 2) {
            video.muted = true;
            tryPlay();
        }

        // Fallback: try play after component mount
        const timeoutId = setTimeout(() => {
            if (video.paused) {
                video.muted = true;
                tryPlay();
            }
        }, 1000);

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('loadeddata', handleLoadedData);
            clearTimeout(timeoutId);
        };
    }, [videoSrc]);



    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            console.error('❌ [VideoBackground] Video element ref is null!');
            return;
        }

        // Force muted for autoplay
        video.muted = true;
        video.setAttribute('muted', '');

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
        const handleLoadStart = () => {
            console.log('🔄 [VideoBackground] Load started');
            video.muted = true;
        };
        const handleLoadedData = () => {
            console.log('✅ [VideoBackground] Video data loaded');
            video.muted = true;
            // Try to play when data is loaded
            video.play().catch(e => console.warn('[VideoBackground] Play on loadedData failed:', e));
        };
        const handleCanPlay = () => {
            console.log('▶️ [VideoBackground] Video can play');
            video.muted = true;
            // Try to play when video can play
            video.play().catch(e => console.warn('[VideoBackground] Play on canPlay failed:', e));
        };
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

        // Fallback: try to play after a delay
        const playTimeout = setTimeout(() => {
            if (video.paused) {
                video.muted = true;
                video.play().catch(e => console.warn('[VideoBackground] Fallback play failed:', e));
            }
        }, 2000);

        return () => {
            video.removeEventListener('loadstart', handleLoadStart);
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('error', handleError);
            video.removeEventListener('stalled', handleStalled);
            video.removeEventListener('waiting', handleWaiting);
            clearTimeout(playTimeout);
            console.log('🔚 [VideoBackground] Component unmounted');
        };
    }, [videoSrc]);

    console.log('[VideoBackground] Video src:', videoSrc, 'Overlay opacity:', overlayOpacity, 'Is visible:', isVisible);
    const toggleMute = () => {
        if (videoRef.current) {
            console.log(`🔊 [VideoBackground] Toggling mute: ${!videoRef.current.muted}`);
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    // Autoplay logic for secondary video
    useEffect(() => {
        const video = secondaryVideoRef.current;
        if (!video || !enableDualVideo) return;

        video.muted = true;
        video.setAttribute('muted', '');

        const tryPlay = async () => {
            try {
                if (video.paused) {
                    await video.play();
                }
            } catch (error) {
                setTimeout(() => {
                    video.muted = true;
                    video.play().catch(() => {});
                }, 500);
            }
        };

        video.addEventListener('canplay', tryPlay);
        video.addEventListener('loadeddata', tryPlay);

        if (video.readyState >= 2) {
            tryPlay();
        }

        return () => {
            video.removeEventListener('canplay', tryPlay);
            video.removeEventListener('loadeddata', tryPlay);
        };
    }, [enableDualVideo, secondaryVideoSrc]);

    return (
        <>
            {/* Video Background Container - z-0 to be behind content but visible */}
            <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-1000 ${isGrayscale ? 'grayscale' : ''} ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Primary Video - Base layer (always visible) */}
                <div className="absolute inset-0 w-full h-full">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        webkit-playsinline="true"
                        x5-playsinline="true"
                    />
                </div>

                {/* Secondary Video - Overlay layer (cyclically visible) */}
                {enableDualVideo && (
                    <div 
                        className="absolute inset-0 w-full h-full transition-opacity"
                        style={{ 
                            opacity: showSecondary ? 1 : 0,
                            transitionDuration: `${videoTransitionDuration}ms`
                        }}
                    >
                        <video
                            ref={secondaryVideoRef}
                            className="w-full h-full object-cover"
                            src={secondaryVideoSrc}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            webkit-playsinline="true"
                            x5-playsinline="true"
                        />
                    </div>
                )}

                {/* Dark Overlay with Gradient - on top of videos */}
                <div className={`absolute inset-0 transition-opacity duration-[3000ms] ${enableCycle ? 'animate-pulse opacity-80' : 'opacity-100'}`} style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`, backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, ${Math.min(overlayOpacity * 3, 0.9)}), rgba(0, 0, 0, ${overlayOpacity * 0.67}), rgba(0, 0, 0, ${Math.min(overlayOpacity * 2, 0.6)}))` }} />
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















