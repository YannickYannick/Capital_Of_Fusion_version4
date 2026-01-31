"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, ExternalLink, Play, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { OrganizationNode, NodeEvent } from "@/types/organization";

interface PlanetOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    nodeData: OrganizationNode | null;
    isLoading?: boolean;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
    });
}

function EventCard({ event }: { event: NodeEvent }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex-shrink-0 w-64 bg-white/5 border rounded-xl overflow-hidden hover:bg-white/10 transition-colors ${
                event.is_featured ? 'border-purple-500/50' : 'border-white/10'
            }`}
        >
            {/* Event Image */}
            {event.image && (
                <div className="relative h-32 w-full">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                    {event.is_featured && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-purple-500 text-white text-[10px] font-bold uppercase rounded">
                            À la une
                        </span>
                    )}
                </div>
            )}
            
            <div className="p-4">
                {/* Date */}
                <div className="flex items-center gap-2 text-purple-400 text-xs mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(event.start_datetime)}</span>
                </div>
                
                {/* Title */}
                <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                    {event.title}
                </h4>
                
                {/* Location */}
                {event.location && (
                    <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location}</span>
                    </div>
                )}
                
                {/* External Link */}
                {event.external_url && (
                    <a
                        href={event.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors"
                    >
                        <span>Voir plus</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>
        </motion.div>
    );
}

export default function PlanetOverlay({ isOpen, onClose, nodeData, isLoading = false }: PlanetOverlayProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
                    >
                        {/* Modal Content */}
                        <div className="relative w-full max-w-5xl max-h-[85vh] bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Loading State */}
                            {isLoading ? (
                                <div className="flex items-center justify-center h-96">
                                    <div className="text-white/50 flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                        <p>Chargement...</p>
                                    </div>
                                </div>
                            ) : nodeData ? (
                                <div className="overflow-y-auto max-h-[85vh] custom-scrollbar">
                                    {/* Header Section - Media + Title */}
                                    <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
                                        {/* Left - Media */}
                                        <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
                                            {nodeData.video_url ? (
                                                <div className="relative w-full h-full group cursor-pointer">
                                                    {/* Video Thumbnail or Placeholder */}
                                                    {nodeData.cover_image ? (
                                                        <Image
                                                            src={nodeData.cover_image}
                                                            alt={nodeData.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                                                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                                                                <Play className="w-8 h-8 text-white ml-1" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Play Overlay */}
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                            <Play className="w-8 h-8 text-white ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : nodeData.cover_image ? (
                                                <Image
                                                    src={nodeData.cover_image}
                                                    alt={nodeData.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                                                    <span className="text-6xl font-bold text-white/20">
                                                        {nodeData.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right - Title & CTA */}
                                        <div className="flex flex-col justify-center">
                                            {/* Type Badge */}
                                            <span className="inline-block w-fit px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/50 mb-4">
                                                {nodeData.type}
                                            </span>

                                            {/* Title */}
                                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                                {nodeData.name}
                                            </h1>

                                            {/* Short Description */}
                                            {nodeData.short_description && (
                                                <p className="text-white/70 text-lg leading-relaxed mb-6">
                                                    {nodeData.short_description}
                                                </p>
                                            )}

                                            {/* CTA Button */}
                                            {nodeData.cta_url && (
                                                <Link
                                                    href={nodeData.cta_url}
                                                    className="inline-flex items-center justify-center gap-2 w-fit px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
                                                >
                                                    {nodeData.cta_text || "En savoir plus"}
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Events Section */}
                                    {nodeData.events && nodeData.events.length > 0 && (
                                        <div className="px-6 md:px-8 pb-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Calendar className="w-5 h-5 text-purple-400" />
                                                <h2 className="text-lg font-semibold text-white">
                                                    Prochains événements
                                                </h2>
                                            </div>

                                            {/* Horizontal Scroll Container */}
                                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-8 md:px-8 custom-scrollbar-horizontal">
                                                {nodeData.events.map((event, index) => (
                                                    <motion.div
                                                        key={event.id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <EventCard event={event} />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Content Section */}
                                    {(nodeData.content || nodeData.description) && (
                                        <div className="px-6 md:px-8 pb-8">
                                            <div className="border-t border-white/10 pt-6">
                                                <h2 className="text-lg font-semibold text-white mb-4">
                                                    À propos
                                                </h2>
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                                                        {nodeData.content || nodeData.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-96">
                                    <p className="text-white/50">Aucune donnée disponible</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
