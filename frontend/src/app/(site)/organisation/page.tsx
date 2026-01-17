"use client";

import { useState, useEffect } from "react";
import PlanetarySystem from "@/components/features/organization/PlanetarySystem";
import DetailsPanel from "@/components/features/organization/DetailsPanel";

export default function OrganisationPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-screen w-full bg-[#050510] flex items-center justify-center">
                <div className="text-white/20 uppercase tracking-widest text-xs font-bold animate-pulse">
                    Chargement du système...
                </div>
            </div>
        );
    }

    return (
        <main className="relative h-screen w-full overflow-hidden">
            <PlanetarySystem />
            <DetailsPanel />
        </main>
    );
}
