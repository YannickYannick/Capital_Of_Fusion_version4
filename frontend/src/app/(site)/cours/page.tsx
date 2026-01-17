"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import CourseCard from "@/components/features/courses/CourseCard";
import { motion } from "framer-motion";
import { Filter, Search, Sparkles } from "lucide-react";
import { useState } from "react";

export default function CoursesPage() {
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

    // Fetch Courses
    const { data: courses, isLoading: coursesLoading } = useQuery({
        queryKey: ['courses', selectedStyle],
        queryFn: async () => {
            const params = selectedStyle ? { style__slug: selectedStyle } : {};
            const res = await api.get('/courses/', { params });
            // The DRF router returns { count, next, previous, results }
            return res.data.results;
        }
    });

    // Fetch Styles for filters
    const { data: styles } = useQuery({
        queryKey: ['styles'],
        queryFn: async () => {
            const res = await api.get('/common/styles/');
            return res.data.results;
        }
    });

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-4"
                        >
                            <Sparkles className="w-4 h-4" />
                            Catalogue des cours
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
                        >
                            ELEVE TON <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-400">STYLE</span>
                        </motion.h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedStyle(null)}
                            className={`px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${!selectedStyle ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                            Tous
                        </button>
                        {styles?.map((style: any) => (
                            <button
                                key={style.id}
                                onClick={() => setSelectedStyle(style.slug)}
                                className={`px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${selectedStyle === style.slug ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                            >
                                {style.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Stats bar */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-12 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="RECHERCHER UN COURS, UN PROF..."
                            className="w-full bg-transparent pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/10 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-8 px-6 border-l border-white/5">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white/20 uppercase mb-1">Total</p>
                            <p className="text-sm font-black text-white">{courses?.length || 0}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white/20 uppercase mb-1">Actifs</p>
                            <p className="text-sm font-black text-emerald-400">{courses?.length || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Grid section */}
                {coursesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[400px] rounded-3xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses?.map((course: any) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!coursesLoading && courses?.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="w-8 h-8 text-white/10" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Aucun cours trouvé</h3>
                        <p className="text-white/40 text-sm font-medium">Réessayez avec d'autres filtres ou une autre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
