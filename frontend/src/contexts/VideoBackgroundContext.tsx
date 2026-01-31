"use client";

import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode, RefObject } from 'react';

interface VideoBackgroundContextType {
    // Video ref for direct access
    videoRef: RefObject<HTMLVideoElement | null>;
    // Mute state
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
    toggleMute: () => void;
    // Overlay opacity (varies by page)
    overlayOpacity: number;
    setOverlayOpacity: (opacity: number) => void;
    // Grayscale filter
    isGrayscale: boolean;
    setIsGrayscale: (grayscale: boolean) => void;
}

const VideoBackgroundContext = createContext<VideoBackgroundContextType | undefined>(undefined);

export function VideoBackgroundProvider({ children }: { children: ReactNode }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    
    // Always start muted for SSR compatibility and browser autoplay policy
    const [isMuted, setIsMutedState] = useState(true);
    
    const [overlayOpacity, setOverlayOpacity] = useState(0.3);
    const [isGrayscale, setIsGrayscale] = useState(false);
    
    // Note: We do NOT load isMuted from localStorage on mount.
    // Browser autoplay policy requires user interaction to unmute.
    // Video always starts muted, user must click to unmute.
    // We only save the preference when user explicitly toggles.

    const setIsMuted = useCallback((muted: boolean) => {
        setIsMutedState(muted);
        if (typeof window !== 'undefined') {
            localStorage.setItem('video_isMuted', muted.toString());
        }
        // Also apply to video element directly
        if (videoRef.current) {
            videoRef.current.muted = muted;
        }
    }, []);

    const toggleMute = useCallback(() => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
    }, [isMuted, setIsMuted]);

    return (
        <VideoBackgroundContext.Provider value={{
            videoRef,
            isMuted,
            setIsMuted,
            toggleMute,
            overlayOpacity,
            setOverlayOpacity,
            isGrayscale,
            setIsGrayscale
        }}>
            {children}
        </VideoBackgroundContext.Provider>
    );
}

export function useVideoBackground() {
    const context = useContext(VideoBackgroundContext);
    if (context === undefined) {
        throw new Error('useVideoBackground must be used within a VideoBackgroundProvider');
    }
    return context;
}
