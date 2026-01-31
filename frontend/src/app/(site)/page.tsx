"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HomePage() {
    return (
        <main className="relative min-h-screen flex items-center justify-start overflow-hidden pt-20">
            {/* Gradient overlay from left to right (Version_2 style) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e27] via-[#0a0e27]/95 to-transparent z-10"></div>

            {/* Content overlay on the left */}
            <div className="container mx-auto px-6 relative z-20">
                <div className="max-w-2xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm">
                        Nouvelle Version Immersive
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-200">
                        Capital of Fusion
                    </h1>

                    <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed">
                        Découvrez l'univers de la Bachata comme jamais auparavant.
                        Une expérience interactive en 3D au cœur de la danse.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                        <Link
                            href="/explore"
                            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-3 hover:bg-purple-50 transition-all hover:scale-105 active:scale-95"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Commencer l'Expérience
                            <div className="absolute inset-0 rounded-full ring-2 ring-white/50 animate-ping opacity-20" />
                        </Link>

                        <Link
                            href="/cours"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                        >
                            Voir les Cours
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <p className="text-sm text-gray-400 italic">
                        Paris, France • École Nationale de Danse
                    </p>
                </div>
            </div>
        </main>
    );
}
