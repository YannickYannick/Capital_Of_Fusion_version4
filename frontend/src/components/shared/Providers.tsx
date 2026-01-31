"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { YouTubeVisibilityProvider } from "@/contexts/YouTubeVisibilityContext";
import { PlanetsOptionsProvider } from "@/contexts/PlanetsOptionsContext";
import { VideoBackgroundProvider } from "@/contexts/VideoBackgroundContext";
import PersistentVideoBackground from "@/components/features/landing/PersistentVideoBackground";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <YouTubeVisibilityProvider>
                <PlanetsOptionsProvider>
                    <VideoBackgroundProvider>
                        {/* Persistent video that never unmounts during navigation */}
                        <PersistentVideoBackground />
                        {children}
                    </VideoBackgroundProvider>
                </PlanetsOptionsProvider>
            </YouTubeVisibilityProvider>
        </QueryClientProvider>
    );
}
