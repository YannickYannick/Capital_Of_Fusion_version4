"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { YouTubeVisibilityProvider } from "@/contexts/YouTubeVisibilityContext";
import { PlanetsOptionsProvider } from "@/contexts/PlanetsOptionsContext";
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
                    {children}
                </PlanetsOptionsProvider>
            </YouTubeVisibilityProvider>
        </QueryClientProvider>
    );
}
