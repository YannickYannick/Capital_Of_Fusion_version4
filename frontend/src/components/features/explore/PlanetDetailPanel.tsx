"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Building2, Info, ExternalLink } from "lucide-react";
import Link from "next/link";

interface OrganizationNode {
    id: number;
    name: string;
    description: string;
    node_type: string;
    parent?: {
        id: number;
        name: string;
    };
    members_count?: number;
}

interface PlanetDetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    nodeData: OrganizationNode | null;
    isLoading?: boolean;
}

export default function PlanetDetailPanel({ isOpen, onClose, nodeData, isLoading = false }: PlanetDetailPanelProps) {
    if (!isOpen && !nodeData) return null;

    const getNodeTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'school':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            case 'association':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
            case 'company':
                return 'bg-green-500/20 text-green-300 border-green-500/50';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    const getNodeTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'school': 'École',
            'association': 'Association',
            'company': 'Entreprise',
            'community': 'Communauté'
        };
        return labels[type.toLowerCase()] || type;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full sm:w-[480px] z-40 bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-white/50 flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                    <p>Chargement...</p>
                                </div>
                            </div>
                        ) : nodeData ? (
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <div className="p-6 border-b border-white/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getNodeTypeColor(nodeData.node_type)} mb-3`}>
                                                {getNodeTypeLabel(nodeData.node_type)}
                                            </span>
                                            <h2 className="text-2xl font-bold text-white mb-2">
                                                {nodeData.name}
                                            </h2>
                                            {nodeData.parent && (
                                                <p className="text-sm text-white/50 flex items-center gap-2">
                                                    <Building2 className="w-4 h-4" />
                                                    Membre de : {nodeData.parent.name}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Description */}
                                    {nodeData.description && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                Description
                                            </h3>
                                            <p className="text-white/80 leading-relaxed">
                                                {nodeData.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                                    <Users className="w-5 h-5 text-purple-300" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-white">
                                                        {nodeData.members_count || 0}
                                                    </p>
                                                    <p className="text-xs text-white/50">Membres</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                                    <Building2 className="w-5 h-5 text-blue-300" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-white">
                                                        {nodeData.node_type}
                                                    </p>
                                                    <p className="text-xs text-white/50">Type</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <Link
                                            href={`/organisation/${nodeData.id}`}
                                            className="flex items-center justify-between w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-white font-medium transition-colors group"
                                        >
                                            <span>Voir la page complète</span>
                                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>

                                        <button className="flex items-center justify-center w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white font-medium transition-colors">
                                            Rejoindre l'organisation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
