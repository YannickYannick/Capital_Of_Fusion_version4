"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar/Navbar";
import SecondaryVideoOverlay from "@/components/features/landing/SecondaryVideoOverlay";
import { usePlanetsOptions } from "@/contexts/PlanetsOptionsContext";
import { useVideoBackground } from "@/contexts/VideoBackgroundContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isExplorePage = pathname === '/explore';

    // Get video options from contexts
    const { grayscaleVideo } = usePlanetsOptions();
    const { setOverlayOpacity, setIsGrayscale } = useVideoBackground();

    // Update persistent video overlay opacity based on current page
    useEffect(() => {
        setOverlayOpacity(isExplorePage ? 0.05 : 0.3);
    }, [isExplorePage, setOverlayOpacity]);

    // Update grayscale based on settings
    useEffect(() => {
        setIsGrayscale(grayscaleVideo);
    }, [grayscaleVideo, setIsGrayscale]);

    return (
        <div className="relative min-h-screen">
            {/* Secondary video overlay - only on /explore page */}
            {/* This adds background-video.mp4 underneath the persistent Aftermoovie_vibe.mp4 */}
            {isExplorePage && <SecondaryVideoOverlay />}

            {/* Content container with relative positioning to be above video */}
            <div className="relative z-10">
                <Navbar />
                {children}
            </div>
        </div>
    );
}





