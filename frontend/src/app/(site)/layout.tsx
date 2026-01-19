"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/shared/Navbar/Navbar";
import VideoBackground from "@/components/features/landing/VideoBackground";
import api from "@/lib/api";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
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

    return (
        <div className="relative min-h-screen bg-background">
            {/* Persistent Video Background */}
            <VideoBackground videoId={videoId} />

            <Navbar />
            {children}
        </div>
    );
}
