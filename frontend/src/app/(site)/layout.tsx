"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar/Navbar";
import VideoBackground from "@/components/features/landing/VideoBackground";
import { usePlanetsOptions } from "@/contexts/PlanetsOptionsContext";
import api from "@/lib/api";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isExplorePage = pathname === '/explore';

    // Fetch site config for video
    const { data: siteConfig } = useQuery({
        queryKey: ['siteConfig'],
        queryFn: async () => {
            const res = await api.get('/common/config/');
            return res.data;
        }
    });

    const videoId = useMemo(() => {
        if (!siteConfig?.hero_video_url) return "jfKfPfyJRdk";
        try {
            const url = new URL(siteConfig.hero_video_url);
            if (url.hostname.includes('youtube.com')) {
                return url.searchParams.get('v') || "jfKfPfyJRdk";
            } else if (url.hostname.includes('youtu.be')) {
                return url.pathname.slice(1) || "jfKfPfyJRdk";
            }
            return "jfKfPfyJRdk";
        } catch (e) {
            return "jfKfPfyJRdk";
        }
    }, [siteConfig]);

    // Get video options from context
    const { enableVideoCycle, grayscaleVideo } = usePlanetsOptions();

    return (
        <div className="relative min-h-screen">
            {/* Local MP4 Video Background */}
            {/* Use Aftermoovie_vibe.mp4 on all pages, with different overlay opacity */}
            <VideoBackground
                videoId={videoId}
                videoSrc="/Aftermoovie_vibe.mp4"
                overlayOpacity={isExplorePage ? 0.05 : 0.3}
                enableCycle={enableVideoCycle}
                isGrayscale={grayscaleVideo}
            />

            {/* Content container with relative positioning to be above video */}
            <div className="relative z-10">
                <Navbar />
                {children}
            </div>
        </div>
    );
}





