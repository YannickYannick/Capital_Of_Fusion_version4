"use client";

import Link from "next/link";
import VideoBackground from "@/components/features/landing/VideoBackground";
import { ArrowRight, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function HomePage() {
    // Reuse the same video config logic as ExplorePage
    const { data: siteConfig } = useQuery({
        queryKey: ['siteConfig'],
        queryFn: async () => {
            const res = await api.get('/common/config/');
            return res.data;
        }
    });

    const videoId = siteConfig?.hero_video_url ?
        (siteConfig.hero_video_url.includes('v=') ? siteConfig.hero_video_url.split('v=')[1] : "jfKfPfyJRdk")
        : "jfKfPfyJRdk";

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <VideoBackground videoId={videoId} />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
                <span className="inline-block py-1 px-3 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm">
                    Nouvelle Version Immersive
                </span>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-200">
                    Capital of Fusion
                </h1>

                <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Découvrez l'univers de la Bachata comme jamais auparavant.
                    Une expérience interactive en 3D au cœur de la danse.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/explore"
                        className="group relative px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-3 hover:bg-purple-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        Commencer l'Expérience
                        <div className="absolute inset-0 rounded-full ring-2 ring-white/50 animate-ping opacity-20" />
                    </Link>

                    <Link
                        href="/cours"
                        className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-full flex items-center gap-2 hover:bg-white/20 transition-all"
                    >
                        Voir les Cours
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Footer Text */}
            <div className="absolute bottom-10 left-0 w-full text-center z-20">
                <p className="text-white/40 text-sm uppercase tracking-widest">
                    Paris • France
                </p>
            </div>
        </main>
    );
}
