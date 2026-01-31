"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import DebugCoordinates from "@/components/features/explore/DebugCoordinates";
import PlanetOverlay from "@/components/features/explore/PlanetOverlay";
import GlobalPlanetConfigPanel from "@/components/features/explore/GlobalPlanetConfigPanel";

const Scene3DAdvanced = dynamic(() => import("@/components/features/explore/Scene3DAdvanced"), {
    ssr: false,
});
import { Eye, EyeOff, Info, Play, Pause, Palette, Settings, ArrowLeft, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanetsOptions } from "@/contexts/PlanetsOptionsContext";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { OrganizationNode } from "@/types/organization";

export default function ExplorePage() {
    // Selection & Overlay state
    const [selectedNodeSlug, setSelectedNodeSlug] = useState<string | null>(null);
    const [selectedPlanetName, setSelectedPlanetName] = useState<string | null>(null);
    const [isPlanetSelected, setIsPlanetSelected] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isGlobalConfigOpen, setIsGlobalConfigOpen] = useState(false);

    // Fetch selected node details (only when overlay is open)
    const { data: selectedNodeData, isLoading: isLoadingNode } = useQuery<OrganizationNode | null>({
        queryKey: ['organization-node', selectedNodeSlug],
        queryFn: async () => {
            if (!selectedNodeSlug) return null;
            const res = await api.get(`/organization/nodes/${selectedNodeSlug}/`);
            return res.data;
        },
        enabled: !!selectedNodeSlug && isOverlayOpen,
    });

    // Called on first click on a planet (zoom in)
    const handlePlanetFirstClick = (nodeSlug: string, planetName: string) => {
        setSelectedNodeSlug(nodeSlug);
        setSelectedPlanetName(planetName);
        setIsPlanetSelected(true);
    };

    // Called when planet is deselected (click empty or double-click)
    const handlePlanetDeselect = () => {
        setIsPlanetSelected(false);
        // Keep slug for potential re-selection
    };

    // Called when user clicks "Détails" button or second click on same planet
    const handleOpenOverlay = (nodeSlug?: string) => {
        if (nodeSlug) {
            setSelectedNodeSlug(nodeSlug);
        }
        setIsOverlayOpen(true);
    };

    // Called when user clicks "Retour" button
    const handleBackClick = () => {
        setIsPlanetSelected(false);
        triggerReset(); // Triggers camera reset and unfreezes planets
    };

    const handleOverlayClose = () => {
        setIsOverlayOpen(false);
        // Keep selectedNodeSlug and isPlanetSelected for potential re-opening
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
        setGrayscaleVideo,
        fishEye,
        setFishEye,
        orbitSpacing,
        setOrbitSpacing,
        mouseForce,
        setMouseForce,
        collisionForce,
        setCollisionForce,
        damping,
        setDamping,
        returnForce,
        setReturnForce,
        triggerRestart,
        // Squircle
        orbitShape,
        setOrbitShape,
        orbitRoundness,
        setOrbitRoundness,
        globalShapeOverride,
        setGlobalShapeOverride,
        // Entry Animation
        entryStartX,
        setEntryStartX,
        entryStartY,
        setEntryStartY,
        entryStartZ,
        setEntryStartZ,
        entrySpeed,
        setEntrySpeed,
        // Video Overlay Cycle
        videoCycleVisible,
        setVideoCycleVisible,
        videoCycleHidden,
        setVideoCycleHidden,
        videoTransitionDuration,
        setVideoTransitionDuration,
        triggerReset
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
                onPlanetDoubleClick={handleOpenOverlay}
                onPlanetFirstClick={handlePlanetFirstClick}
                onPlanetDeselect={handlePlanetDeselect}
            />

            {/* Debug Coordinates */}
            {showDebugInfo && (
                <DebugCoordinates
                    sceneRef={sceneRef}
                    cameraRef={cameraRef}
                    controlsRef={controlsRef}
                />
            )}

            {/* Planet Selection Action Bar - Centered */}
            <AnimatePresence>
                {isPlanetSelected && !isOverlayOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-6 px-10 py-8 bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl pointer-events-auto">
                            {/* Planet Name */}
                            <div className="text-center">
                                <p className="text-white/50 text-sm uppercase tracking-wider mb-2">Sélectionné</p>
                                <p className="text-white font-bold text-3xl">{selectedPlanetName}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                {/* Details Button */}
                                <button
                                    onClick={() => handleOpenOverlay()}
                                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-lg font-semibold rounded-2xl transition-all hover:scale-105 shadow-xl shadow-purple-500/30"
                                >
                                    <ExternalLink className="w-6 h-6" />
                                    Détails
                                </button>

                                {/* Back Button */}
                                <button
                                    onClick={handleBackClick}
                                    className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-2xl transition-all border border-white/20 hover:border-white/30"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                    Retour
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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

            {/* DEBUG: Enhanced Sound Control Button with Audio Detection */}
            <button
                onClick={() => {
                    const video = document.querySelector('video');
                    if (video) {
                        // Toggle mute
                        video.muted = !video.muted;

                        // Check for audio tracks
                        const audioTracks = (video as any).audioTracks;
                        const hasAudio = audioTracks && audioTracks.length > 0;

                        console.log('=== VIDEO AUDIO DEBUG ===');
                        console.log('Video muted:', video.muted);
                        console.log('Video volume:', video.volume);
                        console.log('Has audio tracks:', hasAudio);
                        console.log('Audio tracks count:', audioTracks?.length || 0);
                        console.log('Video current time:', video.currentTime);
                        console.log('Video duration:', video.duration);
                        console.log('Video paused:', video.paused);

                        // Try to play a test beep
                        const audioContext = new AudioContext();
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();

                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);

                        oscillator.frequency.value = 440; // A4 note
                        gainNode.gain.value = 0.3;

                        oscillator.start();
                        setTimeout(() => oscillator.stop(), 200);

                        alert(`Vidéo ${video.muted ? 'MUET' : 'SON ACTIVÉ'}\n\nPiste audio détectée: ${hasAudio ? 'OUI ✅' : 'NON ❌'}\nVolume: ${Math.round(video.volume * 100)}%\n\n${hasAudio ? 'La vidéo a du son' : '⚠️ La vidéo N\'A PAS de piste audio!\nVous devriez entendre un bip de test.'}`);
                    } else {
                        console.error('No video element found!');
                        alert('❌ Aucune vidéo trouvée sur la page!');
                    }
                }}
                className="fixed bottom-8 left-72 z-50 px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg shadow-2xl flex items-center gap-3 transition-all hover:scale-105 pointer-events-auto"
                aria-label="Toggle audio and test"
            >
                <span className="text-2xl">🔊</span>
                <span>TEST SON + DEBUG</span>
            </button>

            {/* Options Panel */}
            <div className="fixed top-24 right-8 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 z-20 space-y-3">
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Options</p>

                <button
                    onClick={() => setIsGlobalConfigOpen(true)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 transition-colors text-purple-300 text-sm font-medium"
                >
                    <Settings className="w-4 h-4" />
                    <span>Configurer les Planètes</span>
                </button>

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

                <div className="pt-2 border-t border-white/10 space-y-3">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Caméra & Espace</p>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Fish Eye (FOV)</span>
                            <span>{Math.round(fishEye)}°</span>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="120"
                            value={fishEye}
                            onChange={(e) => setFishEye(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Espacement Orbites</span>
                            <span>x{orbitSpacing.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.1"
                            value={orbitSpacing}
                            onChange={(e) => setOrbitSpacing(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-3">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Forme Orbites</p>

                    <button
                        onClick={() => setGlobalShapeOverride(!globalShapeOverride)}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-white text-sm ${globalShapeOverride ? 'bg-indigo-500/20 border border-indigo-500/50' : 'bg-white/5 hover:bg-white/10'}`}
                    >
                        <div className={`w-3 h-3 rounded-full border ${globalShapeOverride ? 'bg-indigo-400 border-indigo-400' : 'border-white/50'}`}></div>
                        <span>Forcer la Forme</span>
                    </button>

                    {globalShapeOverride && (
                        <div className="space-y-3 pl-2 border-l border-white/10 ml-1">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOrbitShape('circle')}
                                    className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${orbitShape === 'circle' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                >
                                    Cercle
                                </button>
                                <button
                                    onClick={() => setOrbitShape('squircle')}
                                    className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${orbitShape === 'squircle' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                >
                                    Squircle
                                </button>
                            </div>

                            {orbitShape === 'squircle' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-white/70">
                                        <span>Arrondi (Roundness)</span>
                                        <span>{orbitRoundness.toFixed(2)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={orbitRoundness}
                                        onChange={(e) => setOrbitRoundness(Number(e.target.value))}
                                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                                    />
                                </div>
                            )}

                            <div className="text-[10px] text-white/40 italic">
                                Note: Cliquez sur "Rejouer l'Intro" pour mettre à jour les lignes d'orbite.
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-2 border-t border-white/10 space-y-3">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Physique</p>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Force Souris</span>
                            <span>{mouseForce.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={mouseForce}
                            onChange={(e) => setMouseForce(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Force Collision</span>
                            <span>{collisionForce.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={collisionForce}
                            onChange={(e) => setCollisionForce(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Amortissement</span>
                            <span>{damping.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.8"
                            max="0.99"
                            step="0.01"
                            value={damping}
                            onChange={(e) => setDamping(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Force Retour</span>
                            <span>{returnForce.toFixed(3)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="0.2"
                            step="0.005"
                            value={returnForce}
                            onChange={(e) => setReturnForce(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-3">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Animation d'Entrée</p>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Position X de départ</span>
                            <span>{entryStartX.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="-100"
                            max="0"
                            step="1"
                            value={entryStartX}
                            onChange={(e) => setEntryStartX(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Position Y de départ</span>
                            <span>{entryStartY.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="-20"
                            max="20"
                            step="0.5"
                            value={entryStartY}
                            onChange={(e) => setEntryStartY(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Position Z de départ</span>
                            <span>{entryStartZ !== null ? entryStartZ.toFixed(1) : 'Auto'}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                checked={entryStartZ !== null}
                                onChange={(e) => setEntryStartZ(e.target.checked ? (entryStartZ ?? 10) : null)}
                                className="w-4 h-4 accent-white"
                            />
                            <span className="text-xs text-white/50">Personnaliser Z</span>
                            {entryStartZ !== null && (
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    step="0.5"
                                    value={entryStartZ}
                                    onChange={(e) => setEntryStartZ(Number(e.target.value))}
                                    className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white ml-2"
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Vitesse d'entrée</span>
                            <span>{entrySpeed.toFixed(0)}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="50"
                            step="1"
                            value={entrySpeed}
                            onChange={(e) => setEntrySpeed(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-3">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Superposition Vidéo</p>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Durée visible</span>
                            <span>{videoCycleVisible}s</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={videoCycleVisible}
                            onChange={(e) => setVideoCycleVisible(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Durée cachée</span>
                            <span>{videoCycleHidden}s</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={videoCycleHidden}
                            onChange={(e) => setVideoCycleHidden(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Transition</span>
                            <span>{(videoTransitionDuration / 1000).toFixed(1)}s</span>
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="3000"
                            step="100"
                            value={videoTransitionDuration}
                            onChange={(e) => setVideoTransitionDuration(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-white"
                        />
                    </div>

                    <div className="text-[10px] text-white/40 italic">
                        background-video.mp4 (permanent) + Aftermoovie_vibe.mp4 (cyclique)
                    </div>
                </div>

                <button
                    onClick={triggerRestart}
                    className="flex items-center justify-center gap-2 w-full mt-4 px-3 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-medium transition-colors text-sm border border-indigo-500/30"
                >
                    <Play className="w-3 h-3" />
                    Rejouer l'Intro
                </button>
            </div>

            {/* Planet Overlay (Central Modal) */}
            <PlanetOverlay
                isOpen={isOverlayOpen}
                onClose={handleOverlayClose}
                nodeData={selectedNodeData ?? null}
                isLoading={isLoadingNode}
            />

            {/* Global Planet Config Panel */}
            <GlobalPlanetConfigPanel
                isOpen={isGlobalConfigOpen}
                onClose={() => setIsGlobalConfigOpen(false)}
            />
        </main>
    );
}
