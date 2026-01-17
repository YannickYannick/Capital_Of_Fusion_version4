"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOrganizationStore } from "@/store/useOrganizationStore";
import { X, ExternalLink, Video, Info } from "lucide-react";

export default function DetailsPanel() {
    const { selectedNode, isPanelOpen, setSelectedNode } = useOrganizationStore();

    return (
        <AnimatePresence>
            {isPanelOpen && selectedNode && (
                <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-24 right-8 z-40 w-80 md:w-96"
                >
                    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        {/* Header Image/Pattern */}
                        <div className="relative h-32 bg-gradient-to-br from-blue-600/20 to-emerald-400/20 flex items-center justify-center">
                            <div className="absolute inset-0 bg-grid-white/[0.02]" />
                            <span className="text-4xl font-bold text-white/20 select-none uppercase tracking-tighter">
                                {selectedNode.type}
                            </span>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                                {selectedNode.name}
                            </h2>
                            <p className="text-xs font-bold text-blue-400 mb-6 uppercase tracking-[0.2em]">
                                {selectedNode.type === 'ROOT' ? 'Quartier Général' : 'Filiale / Événement'}
                            </p>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 mb-2 text-white/50">
                                        <Info className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Description</span>
                                    </div>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Découvrez l'univers de {selectedNode.name}. Un lieu d'excellence pour la danse et la passion. Prochainement plus de détails ici.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all hover:scale-[1.02] active:scale-95">
                                        <Video className="w-4 h-4" />
                                        Vidéo
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-95">
                                        <ExternalLink className="w-4 h-4" />
                                        Site
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-white/5 border-t border-white/5">
                            <p className="text-[9px] text-white/30 text-center uppercase tracking-widest font-bold">
                                BachataVibe v4 • Ecosystem Node
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
