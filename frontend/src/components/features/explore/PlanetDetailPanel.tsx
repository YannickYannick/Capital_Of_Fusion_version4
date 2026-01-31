"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Building2, Info, ExternalLink, Save, Settings } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";

interface OrganizationNode {
    id: number;
    name: string;
    slug: string;
    description: string;
    type: string;
    parent?: {
        id: number;
        name: string;
    };
    members_count?: number;
    // 3D orbit parameters
    orbit_radius?: number;
    orbit_speed?: number;
    orbit_phase?: number;
    orbit_shape?: 'circle' | 'squircle';
    orbit_roundness?: number;
    planet_scale?: number;
    rotation_speed?: number;
    // Entry animation parameters
    entry_start_x?: number;
    entry_start_y?: number;
    entry_start_z?: number | null;
    entry_speed?: number;
}

interface PlanetDetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    nodeData: OrganizationNode | null;
    isLoading?: boolean;
}

export default function PlanetDetailPanel({ isOpen, onClose, nodeData, isLoading = false }: PlanetDetailPanelProps) {
    const queryClient = useQueryClient();
    const [editMode, setEditMode] = useState(false);
    const [orbitParams, setOrbitParams] = useState({
        orbit_shape: nodeData?.orbit_shape || 'circle' as 'circle' | 'squircle',
        orbit_roundness: nodeData?.orbit_roundness || 0.6,
        orbit_radius: nodeData?.orbit_radius || 10,
        orbit_speed: nodeData?.orbit_speed || 0.1,
        orbit_phase: nodeData?.orbit_phase || 0,
        planet_scale: nodeData?.planet_scale || 1,
        rotation_speed: nodeData?.rotation_speed || 0.5,
        entry_start_x: nodeData?.entry_start_x ?? -60.0,
        entry_start_y: nodeData?.entry_start_y ?? 0.0,
        entry_start_z: nodeData?.entry_start_z ?? null,
        entry_speed: nodeData?.entry_speed ?? 0.4,
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Update local state when nodeData changes
    useEffect(() => {
        if (nodeData) {
            setOrbitParams({
                orbit_shape: nodeData.orbit_shape || 'circle',
                orbit_roundness: nodeData.orbit_roundness || 0.6,
                orbit_radius: nodeData.orbit_radius || 10,
                orbit_speed: nodeData.orbit_speed || 0.1,
                orbit_phase: nodeData.orbit_phase || 0,
                planet_scale: nodeData.planet_scale || 1,
                rotation_speed: nodeData.rotation_speed || 0.5,
                entry_start_x: nodeData.entry_start_x ?? -60.0,
                entry_start_y: nodeData.entry_start_y ?? 0.0,
                entry_start_z: nodeData.entry_start_z ?? null,
                entry_speed: nodeData.entry_speed ?? 0.4,
            });
        }
    }, [nodeData]);

    const saveMutation = useMutation({
        mutationFn: async (params: typeof orbitParams) => {
            if (!nodeData) throw new Error('No node data');
            const response = await api.patch(`/organization/nodes/${nodeData.slug}/`, params);
            return response.data;
        },
        onSuccess: () => {
            setSaveStatus('success');
            queryClient.invalidateQueries({ queryKey: ['organization-nodes'] });
            setTimeout(() => setSaveStatus('idle'), 3000);
        },
        onError: (error) => {
            console.error('Save error:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        },
    });

    const handleSave = () => {
        setSaveStatus('saving');
        saveMutation.mutate(orbitParams);
    };

    if (!isOpen && !nodeData) return null;

    const getNodeTypeColor = (type?: string) => {
        if (!type) return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
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
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getNodeTypeColor(nodeData.type)} mb-3`}>
                                                {getNodeTypeLabel(nodeData.type)}
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
                                                        {getNodeTypeLabel(nodeData.type)}
                                                    </p>
                                                    <p className="text-xs text-white/50">Type</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Orbit Parameters Editor */}
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide flex items-center gap-2">
                                                <Settings className="w-4 h-4" />
                                                Paramètres d'Orbite
                                            </h3>
                                            <button
                                                onClick={() => setEditMode(!editMode)}
                                                className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-white"
                                            >
                                                {editMode ? 'Annuler' : 'Modifier'}
                                            </button>
                                        </div>

                                        {editMode ? (
                                            <div className="space-y-4">
                                                {/* Orbit Shape */}
                                                <div>
                                                    <label className="text-xs text-white/50 block mb-2">Forme de l'orbite</label>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setOrbitParams({ ...orbitParams, orbit_shape: 'circle' })}
                                                            className={`flex-1 px-3 py-2 rounded text-xs transition-colors ${orbitParams.orbit_shape === 'circle' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                                        >
                                                            Cercle
                                                        </button>
                                                        <button
                                                            onClick={() => setOrbitParams({ ...orbitParams, orbit_shape: 'squircle' })}
                                                            className={`flex-1 px-3 py-2 rounded text-xs transition-colors ${orbitParams.orbit_shape === 'squircle' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                                        >
                                                            Squircle
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Roundness (only for squircle) */}
                                                {orbitParams.orbit_shape === 'squircle' && (
                                                    <div>
                                                        <div className="flex justify-between text-xs text-white/50 mb-2">
                                                            <span>Arrondi</span>
                                                            <span>{orbitParams.orbit_roundness.toFixed(2)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.05"
                                                            value={orbitParams.orbit_roundness}
                                                            onChange={(e) => setOrbitParams({ ...orbitParams, orbit_roundness: parseFloat(e.target.value) })}
                                                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                    </div>
                                                )}

                                                {/* Orbit Radius */}
                                                <div>
                                                    <div className="flex justify-between text-xs text-white/50 mb-2">
                                                        <span>Rayon de l'orbite</span>
                                                        <span>{orbitParams.orbit_radius.toFixed(1)}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="3"
                                                        max="20"
                                                        step="0.5"
                                                        value={orbitParams.orbit_radius}
                                                        onChange={(e) => setOrbitParams({ ...orbitParams, orbit_radius: parseFloat(e.target.value) })}
                                                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                    />
                                                </div>

                                                {/* Orbit Speed */}
                                                <div>
                                                    <div className="flex justify-between text-xs text-white/50 mb-2">
                                                        <span>Vitesse orbitale</span>
                                                        <span>{orbitParams.orbit_speed.toFixed(2)}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0.05"
                                                        max="0.5"
                                                        step="0.01"
                                                        value={orbitParams.orbit_speed}
                                                        onChange={(e) => setOrbitParams({ ...orbitParams, orbit_speed: parseFloat(e.target.value) })}
                                                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                    />
                                                </div>

                                                {/* Planet Scale */}
                                                <div>
                                                    <div className="flex justify-between text-xs text-white/50 mb-2">
                                                        <span>Taille de la planète</span>
                                                        <span>{orbitParams.planet_scale.toFixed(2)}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0.5"
                                                        max="2"
                                                        step="0.1"
                                                        value={orbitParams.planet_scale}
                                                        onChange={(e) => setOrbitParams({ ...orbitParams, planet_scale: parseFloat(e.target.value) })}
                                                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                    />
                                                </div>

                                                {/* Entry Animation Section */}
                                                <div className="pt-4 border-t border-white/10">
                                                    <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-3">
                                                        Animation d'Entrée
                                                    </h4>
                                                    
                                                    {/* Entry Start X */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs text-white/50 mb-2">
                                                            <span>Position X de départ</span>
                                                            <span>{orbitParams.entry_start_x.toFixed(1)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="-100"
                                                            max="0"
                                                            step="1"
                                                            value={orbitParams.entry_start_x}
                                                            onChange={(e) => setOrbitParams({ ...orbitParams, entry_start_x: parseFloat(e.target.value) })}
                                                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                    </div>

                                                    {/* Entry Start Y */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs text-white/50 mb-2">
                                                            <span>Position Y de départ</span>
                                                            <span>{orbitParams.entry_start_y.toFixed(1)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="-20"
                                                            max="20"
                                                            step="0.5"
                                                            value={orbitParams.entry_start_y}
                                                            onChange={(e) => setOrbitParams({ ...orbitParams, entry_start_y: parseFloat(e.target.value) })}
                                                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                    </div>

                                                    {/* Entry Start Z */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs text-white/50 mb-2">
                                                            <span>Position Z de départ (null = utilise rayon orbite)</span>
                                                            <span>{orbitParams.entry_start_z !== null ? orbitParams.entry_start_z.toFixed(1) : 'Auto'}</span>
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={orbitParams.entry_start_z !== null}
                                                                onChange={(e) => setOrbitParams({ 
                                                                    ...orbitParams, 
                                                                    entry_start_z: e.target.checked ? (orbitParams.entry_start_z ?? orbitParams.orbit_radius) : null 
                                                                })}
                                                                className="w-4 h-4 accent-indigo-500"
                                                            />
                                                            <span className="text-xs text-white/50">Personnaliser Z</span>
                                                            {orbitParams.entry_start_z !== null && (
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="30"
                                                                    step="0.5"
                                                                    value={orbitParams.entry_start_z}
                                                                    onChange={(e) => setOrbitParams({ ...orbitParams, entry_start_z: parseFloat(e.target.value) })}
                                                                    className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500 ml-2"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Entry Speed */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs text-white/50 mb-2">
                                                            <span>Vitesse d'entrée</span>
                                                            <span>{orbitParams.entry_speed.toFixed(2)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0.1"
                                                            max="2.0"
                                                            step="0.05"
                                                            value={orbitParams.entry_speed}
                                                            onChange={(e) => setOrbitParams({ ...orbitParams, entry_speed: parseFloat(e.target.value) })}
                                                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Save Button */}
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saveStatus === 'saving'}
                                                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium transition-colors ${saveStatus === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-300' :
                                                            saveStatus === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-300' :
                                                                'bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/50 text-indigo-300'
                                                        } border`}
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {saveStatus === 'saving' ? 'Sauvegarde...' :
                                                        saveStatus === 'success' ? 'Sauvegardé !' :
                                                            saveStatus === 'error' ? 'Erreur' :
                                                                'Sauvegarder'}
                                                </button>

                                                <p className="text-[10px] text-white/40 italic text-center">
                                                    Cliquez sur "Rejouer l'Intro" après sauvegarde pour voir les changements
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-xs text-white/60">
                                                <div className="flex justify-between">
                                                    <span>Forme:</span>
                                                    <span className="text-white/80">{nodeData.orbit_shape === 'squircle' ? 'Squircle' : 'Cercle'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Rayon:</span>
                                                    <span className="text-white/80">{nodeData.orbit_radius?.toFixed(1) || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Vitesse:</span>
                                                    <span className="text-white/80">{nodeData.orbit_speed?.toFixed(2) || 'N/A'}</span>
                                                </div>
                                            </div>
                                        )}
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
