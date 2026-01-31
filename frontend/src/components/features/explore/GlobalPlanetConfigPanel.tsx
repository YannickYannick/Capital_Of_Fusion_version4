"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Save, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface OrganizationNode {
    id: string;
    name: string;
    slug: string;
    type: string;
    orbit_radius: number;
    orbit_speed: number;
    orbit_phase: number;
    orbit_shape: 'circle' | 'squircle';
    orbit_roundness: number;
    planet_scale: number;
    rotation_speed: number;
    is_visible_3d: boolean;
}

interface GlobalPlanetConfigPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlobalPlanetConfigPanel({ isOpen, onClose }: GlobalPlanetConfigPanelProps) {
    const queryClient = useQueryClient();
    const [expandedPlanets, setExpandedPlanets] = useState<Set<string>>(new Set());
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Fetch planets
    const { data: planets, isLoading } = useQuery<OrganizationNode[]>({
        queryKey: ['organization-nodes'],
        queryFn: async () => {
            const res = await api.get('/organization/nodes/');
            return Array.isArray(res.data) ? res.data : (res.data.results || []);
        },
        staleTime: 1000 * 60 * 5,
    });

    // Local state for modifications
    const [modifications, setModifications] = useState<Record<string, Partial<OrganizationNode>>>({});

    // Save all mutations
    const saveMutation = useMutation({
        mutationFn: async () => {
            const promises = Object.entries(modifications).map(([slug, changes]) => {
                return api.patch(`/organization/nodes/${slug}/`, changes);
            });
            return Promise.all(promises);
        },
        onSuccess: () => {
            setSaveStatus('success');
            queryClient.invalidateQueries({ queryKey: ['organization-nodes'] });
            setModifications({});
            setTimeout(() => setSaveStatus('idle'), 3000);
        },
        onError: (error) => {
            console.error('Save error:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        },
    });

    const toggleExpand = (slug: string) => {
        setExpandedPlanets(prev => {
            const next = new Set(prev);
            if (next.has(slug)) {
                next.delete(slug);
            } else {
                next.add(slug);
            }
            return next;
        });
    };

    const updatePlanet = (slug: string, field: keyof OrganizationNode, value: any) => {
        setModifications(prev => ({
            ...prev,
            [slug]: {
                ...prev[slug],
                [field]: value,
            }
        }));
    };

    const getPlanetValue = (planet: OrganizationNode, field: keyof OrganizationNode) => {
        return modifications[planet.slug]?.[field] ?? planet[field];
    };

    const hasChanges = Object.keys(modifications).length > 0;

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
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full sm:w-[600px] z-50 bg-black/90 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex-shrink-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Settings className="w-6 h-6 text-purple-400" />
                                        Configuration des Planètes
                                    </h2>
                                    <p className="text-sm text-white/50 mt-1">
                                        {planets?.length || 0} planètes • {hasChanges ? `${Object.keys(modifications).length} modifiée(s)` : 'Aucune modification'}
                                    </p>
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
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-white/50 flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                        <p>Chargement...</p>
                                    </div>
                                </div>
                            ) : planets && planets.length > 0 ? (
                                planets.map((planet) => {
                                    const isExpanded = expandedPlanets.has(planet.slug);
                                    const isVisible = getPlanetValue(planet, 'is_visible_3d') as boolean;
                                    const shape = getPlanetValue(planet, 'orbit_shape') as 'circle' | 'squircle';

                                    return (
                                        <div
                                            key={planet.id}
                                            className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                                        >
                                            {/* Planet Header */}
                                            <div className="p-4 flex items-center justify-between">
                                                <button
                                                    onClick={() => toggleExpand(planet.slug)}
                                                    className="flex items-center gap-3 flex-1 text-left group"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                                                    ) : (
                                                        <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="text-white font-medium">{planet.name}</h3>
                                                        <p className="text-xs text-white/50">{planet.type}</p>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => updatePlanet(planet.slug, 'is_visible_3d', !isVisible)}
                                                    className={`p-2 rounded-lg transition-colors ${isVisible ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                                                    title={isVisible ? 'Visible' : 'Masquée'}
                                                >
                                                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            {/* Planet Controls (Expanded) */}
                                            {isExpanded && (
                                                <div className="p-4 pt-0 space-y-4 border-t border-white/5">
                                                    {/* Orbit Radius */}
                                                    <div>
                                                        <div className="flex justify-between text-xs text-white/50 mb-2">
                                                            <span>Rayon d'orbite</span>
                                                            <span>{(getPlanetValue(planet, 'orbit_radius') as number).toFixed(1)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="3"
                                                            max="20"
                                                            step="0.5"
                                                            value={getPlanetValue(planet, 'orbit_radius') as number}
                                                            onChange={(e) => updatePlanet(planet.slug, 'orbit_radius', parseFloat(e.target.value))}
                                                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                        />
                                                    </div>

                                                    {/* Orbit Speed */}
                                                    <div>
                                                        <div className="flex justify-between text-xs text-white/50 mb-2">
                                                            <span>Vitesse orbitale</span>
                                                            <span>{(getPlanetValue(planet, 'orbit_speed') as number).toFixed(2)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0.05"
                                                            max="0.5"
                                                            step="0.01"
                                                            value={getPlanetValue(planet, 'orbit_speed') as number}
                                                            onChange={(e) => updatePlanet(planet.slug, 'orbit_speed', parseFloat(e.target.value))}
                                                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                        />
                                                    </div>

                                                    {/* Planet Scale */}
                                                    <div>
                                                        <div className="flex justify-between text-xs text-white/50 mb-2">
                                                            <span>Taille</span>
                                                            <span>{(getPlanetValue(planet, 'planet_scale') as number).toFixed(2)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0.5"
                                                            max="2"
                                                            step="0.1"
                                                            value={getPlanetValue(planet, 'planet_scale') as number}
                                                            onChange={(e) => updatePlanet(planet.slug, 'planet_scale', parseFloat(e.target.value))}
                                                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                        />
                                                    </div>

                                                    {/* Orbit Shape */}
                                                    <div>
                                                        <label className="text-xs text-white/50 block mb-2">Forme de l'orbite</label>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => updatePlanet(planet.slug, 'orbit_shape', 'circle')}
                                                                className={`flex-1 px-3 py-2 rounded text-xs transition-colors ${shape === 'circle' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                                            >
                                                                Cercle
                                                            </button>
                                                            <button
                                                                onClick={() => updatePlanet(planet.slug, 'orbit_shape', 'squircle')}
                                                                className={`flex-1 px-3 py-2 rounded text-xs transition-colors ${shape === 'squircle' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                                            >
                                                                Squircle
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Roundness (if squircle) */}
                                                    {shape === 'squircle' && (
                                                        <div>
                                                            <div className="flex justify-between text-xs text-white/50 mb-2">
                                                                <span>Arrondi</span>
                                                                <span>{(getPlanetValue(planet, 'orbit_roundness') as number).toFixed(2)}</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="1"
                                                                step="0.05"
                                                                value={getPlanetValue(planet, 'orbit_roundness') as number}
                                                                onChange={(e) => updatePlanet(planet.slug, 'orbit_roundness', parseFloat(e.target.value))}
                                                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-white/50 py-8">
                                    Aucune planète disponible
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 flex-shrink-0 space-y-3">
                            <button
                                onClick={() => saveMutation.mutate()}
                                disabled={!hasChanges || saveStatus === 'saving'}
                                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium transition-all ${saveStatus === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-300' :
                                        saveStatus === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-300' :
                                            hasChanges ? 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-purple-300' :
                                                'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                                    } border`}
                            >
                                <Save className="w-4 h-4" />
                                {saveStatus === 'saving' ? 'Sauvegarde...' :
                                    saveStatus === 'success' ? 'Sauvegardé !' :
                                        saveStatus === 'error' ? 'Erreur de sauvegarde' :
                                            hasChanges ? `Sauvegarder Tout (${Object.keys(modifications).length})` : 'Aucune modification'}
                            </button>

                            <p className="text-[10px] text-white/40 italic text-center">
                                Cliquez sur "Rejouer l'Intro" après sauvegarde pour voir les changements
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
