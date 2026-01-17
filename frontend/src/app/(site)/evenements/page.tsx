"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Ticket, Sparkles, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EventsPage() {
    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await api.get('/events/');
            return res.data.results;
        }
    });

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        Agenda BachataVibe
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
                    >
                        NE MANQUEZ <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-400">AUCUN BEAT</span>
                    </motion.h1>
                </div>

                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {events?.map((event: any) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:border-emerald-500/30 transition-all duration-500"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Image / Date block */}
                                    <div className="relative w-full lg:w-80 h-64 lg:h-auto overflow-hidden">
                                        {event.image ? (
                                            <Image src={event.image} alt={event.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-400/20" />
                                        )}
                                        <div className="absolute top-6 left-6 z-20 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center min-w-[70px]">
                                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                                                {new Date(event.start_date).toLocaleString('default', { month: 'short' })}
                                            </p>
                                            <p className="text-3xl font-black text-white">
                                                {new Date(event.start_date).getDate()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content block */}
                                    <div className="flex-1 p-8 md:p-12 relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                {event.type}
                                            </span>
                                            {event.node_name && (
                                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                                    by {event.node_name}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">
                                            {event.name}
                                        </h2>

                                        <p className="text-white/50 text-sm md:text-base font-medium max-w-2xl mb-8 leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="flex flex-wrap gap-8 items-center">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                                                    {new Date(event.start_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                                                    {event.location_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                                                <Ticket className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                    À partir de {event.passes?.[0]?.price || 'N/A'}€
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/evenements/${event.slug}`}
                                            className="absolute md:top-12 md:right-12 mt-8 md:mt-0 p-4 rounded-2xl bg-white/5 hover:bg-emerald-600 text-white/40 hover:text-white transition-all duration-300 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest group/cta"
                                        >
                                            Voir l'événement
                                            <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
