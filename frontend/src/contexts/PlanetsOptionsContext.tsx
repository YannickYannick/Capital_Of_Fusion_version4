"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface PlanetsOptionsContextType {
    showOrbits: boolean;
    setShowOrbits: (show: boolean) => void;
    planetSpeed: number;
    setPlanetSpeed: (speed: number) => void;
    enableVideoCycle: boolean;
    setEnableVideoCycle: (enable: boolean) => void;
    showDebugInfo: boolean;
    setShowDebugInfo: (show: boolean) => void;
    freezePlanets: boolean;
    setFreezePlanets: (freeze: boolean) => void;
    grayscaleVideo: boolean;
    setGrayscaleVideo: (grayscale: boolean) => void;
    fishEye: number;
    setFishEye: (fov: number) => void;
    orbitSpacing: number;
    setOrbitSpacing: (spacing: number) => void;
    // Physics & Restart
    mouseForce: number;
    setMouseForce: (v: number) => void;
    collisionForce: number;
    setCollisionForce: (v: number) => void;
    damping: number;
    setDamping: (v: number) => void;
    returnForce: number;
    setReturnForce: (v: number) => void;
    restartToken: number;
    triggerRestart: () => void;
    // Squircle Controls
    orbitShape: 'circle' | 'squircle';
    setOrbitShape: (shape: 'circle' | 'squircle') => void;
    orbitRoundness: number;
    setOrbitRoundness: (v: number) => void;
    globalShapeOverride: boolean;
    setGlobalShapeOverride: (v: boolean) => void;
}

const PlanetsOptionsContext = createContext<PlanetsOptionsContextType | undefined>(undefined);

export function PlanetsOptionsProvider({ children }: { children: ReactNode }) {
    const [showOrbits, setShowOrbits] = useState(true);
    const [planetSpeed, setPlanetSpeed] = useState(1);
    const [enableVideoCycle, setEnableVideoCycle] = useState(true);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const [freezePlanets, setFreezePlanets] = useState(false);
    const [grayscaleVideo, setGrayscaleVideo] = useState(true);
    const [fishEye, setFishEye] = useState(50); // Default Three.js FOV
    const [orbitSpacing, setOrbitSpacing] = useState(1); // Muliplier for spacing

    // Physics states
    const [mouseForce, setMouseForce] = useState(0.5);
    const [collisionForce, setCollisionForce] = useState(0.3);
    const [damping, setDamping] = useState(0.92);
    const [returnForce, setReturnForce] = useState(0.08);

    const [restartToken, setRestartToken] = useState(0);
    const triggerRestart = () => setRestartToken(prev => prev + 1);

    const [orbitShape, setOrbitShape] = useState<'circle' | 'squircle'>('circle');
    const [orbitRoundness, setOrbitRoundness] = useState(0.6);
    const [globalShapeOverride, setGlobalShapeOverride] = useState(false);

    return (
        <PlanetsOptionsContext.Provider value={{
            showOrbits,
            setShowOrbits,
            planetSpeed,
            setPlanetSpeed,
            enableVideoCycle,
            setEnableVideoCycle,
            showDebugInfo,
            setShowDebugInfo,
            freezePlanets,
            setFreezePlanets,
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
            restartToken,
            restartToken,
            triggerRestart,
            orbitShape,
            setOrbitShape,
            orbitRoundness,
            setOrbitRoundness,
            globalShapeOverride,
            setGlobalShapeOverride
        }}>
            {children}
        </PlanetsOptionsContext.Provider>
    );
}

export function usePlanetsOptions() {
    const context = useContext(PlanetsOptionsContext);
    if (context === undefined) {
        throw new Error('usePlanetsOptions must be used within a PlanetsOptionsProvider');
    }
    return context;
}
