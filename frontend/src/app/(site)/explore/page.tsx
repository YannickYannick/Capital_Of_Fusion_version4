"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import DebugCoordinates from "@/components/features/explore/DebugCoordinates";
import PlanetDetailPanel from "@/components/features/explore/PlanetDetailPanel";

const Scene3DAdvanced = dynamic(() => import("@/components/features/explore/Scene3DAdvanced"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center text-white/50">Chargement de la scène 3D...</div>
});
import { Eye, EyeOff, Info, Play, Pause, Palette } from "lucide-react";
import { usePlanetsOptions } from "@/contexts/PlanetsOptionsContext";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function ExplorePage() {
    // Panel state
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Fetch selected node details
    const { data: selectedNodeData, isLoading: isLoadingNode } = useQuery({
        queryKey: ['organization-node', selectedNodeId],
        queryFn: async () => {
            if (!selectedNodeId) return null;
            const res = await api.get(`/organization/nodes/${selectedNodeId}/`);
            return res.data;
        },
        enabled: !!selectedNodeId && isPanelOpen,
    });

    const handlePlanetDoubleClick = (nodeId: number) => {
        setSelectedNodeId(nodeId);
        setIsPanelOpen(true);
    };

    const handlePanelClose = () => {
        setIsPanelOpen(false);
        // Keep selectedNodeId for potential re-opening
    };

    const {
        showOrbits,
        setShowOrbits,
        showDebugInfo,
        setShowDebugInfo,
        freezePlanets,
        setFreezePlanets,
        enableVideoCycle,
        setEnableVideoCycle,
        grayscaleVideo,
        setGrayscaleVideo
    } = usePlanetsOptions();

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    const handleRefsReady = (
        scene: React.RefObject<THREE.Scene | null>,
        camera: React.RefObject<THREE.PerspectiveCamera | null>,
        controls: React.RefObject<OrbitControls | null>
    ) => {
        sceneRef.current = scene.current;
        cameraRef.current = camera.current;
        controlsRef.current = controls.current;
    };

    return (
        <main className="relative h-screen w-full overflow-hidden">
            {/* 3D Scene */}
            <Scene3DAdvanced
                onRefsReady={handleRefsReady}
                onPlanetDoubleClick={handlePlanetDoubleClick}
            />

            {/* Debug Coordinates */}
            {showDebugInfo && (
                <DebugCoordinates
                    sceneRef={sceneRef}
                    cameraRef={cameraRef}
                    controlsRef={controlsRef}
                />
            )}

            {/* Hint Overlay */}
            <div className="fixed bottom-8 left-8 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 pointer-events-none z-20">
                <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-2">Navigation</p>
                <ul className="text-white/80 text-[10px] space-y-1">
                    <li>• Clic gauche + glisser : Rotation</li>
                    <li>• Clic droit + glisser : Panoramique</li>
                    <li>• Molette : Zoom</li>
                    <li>• Clic sur planète : Figer + Zoomer</li>
                    <li>• Double-clic : Réinitialiser</li>
                </ul>
            </div>

            {/* Options Panel */}
            <div className="fixed top-24 right-8 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 z-20 space-y-3">
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Options</p>

                <button
                    onClick={() => setShowOrbits(!showOrbits)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white text-sm"
                >
                    {showOrbits ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>{showOrbits ? 'Masquer' : 'Afficher'} trajectoires</span>
                </button>

                <button
                    onClick={() => setFreezePlanets(!freezePlanets)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white text-sm"
                >
                    {freezePlanets ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{freezePlanets ? 'Animer' : 'Figer'} planètes</span>
                </button>

                <button
                    onClick={() => setEnableVideoCycle(!enableVideoCycle)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white text-sm"
                >
                    <Eye className="w-4 h-4" />
                    <span>Vidéo en {enableVideoCycle ? 'continue' : 'fondue'}</span>
                </button>

                <button
                    onClick={() => setGrayscaleVideo(!grayscaleVideo)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white text-sm"
                >
                    <Palette className="w-4 h-4" />
                    <span>Vidéo {grayscaleVideo ? 'couleur' : 'N&B'}</span>
                </button>

                <button
                    onClick={() => setShowDebugInfo(!showDebugInfo)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white text-sm"
                >
                    <Info className="w-4 h-4" />
                    <span>{showDebugInfo ? 'Masquer' : 'Afficher'} contrôles</span>
                </button>
            </div>

            {/* Planet Detail Panel */}
            <PlanetDetailPanel
                isOpen={isPanelOpen}
                onClose={handlePanelClose}
                nodeData={selectedNodeData}
                isLoading={isLoadingNode}
            />
        </main>
    );
}
