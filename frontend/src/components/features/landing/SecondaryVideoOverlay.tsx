"use client";

import React, { useRef, useEffect, useState } from "react";
import { usePlanetsOptions } from "@/contexts/PlanetsOptionsContext";

/**
 * SecondaryVideoOverlay - Additional video layer for /explore page
 * 
 * This renders background-video.mp4 BELOW the persistent Aftermoovie_vibe.mp4.
 * The persistent video cycles in/out via opacity, creating a blend effect.
 * 
 * Layer order (bottom to top):
 * 1. background-video.mp4 (this component, z-index: -1)
 * 2. Aftermoovie_vibe.mp4 (PersistentVideoBackground, z-index: 0, cycles opacity)
 * 3. Page content (z-index: 10+)
 */
export default function SecondaryVideoOverlay() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { videoCycleVisible, videoCycleHidden, videoTransitionDuration } = usePlanetsOptions();
    
    // The secondary video is always visible, but we control the PRIMARY video's opacity
    // to create the blend effect. This component just needs to autoplay.

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true;

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
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/background-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            />
        </div>
    );
}
