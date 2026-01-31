"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    // Entry Animation (Global - applies to all planets for now)
    entryStartX: number;
    setEntryStartX: (v: number) => void;
    entryStartY: number;
    setEntryStartY: (v: number) => void;
    entryStartZ: number | null;
    setEntryStartZ: (v: number | null) => void;
    entrySpeed: number;
    setEntrySpeed: (v: number) => void;
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

    // Entry Animation (Global - applies to all planets for now)
    // Load from localStorage or use defaults
    const [entryStartX, setEntryStartXState] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('planets_entryStartX');
            return saved ? parseFloat(saved) : -60.0;
        }
        return -60.0;
    });
    const [entryStartY, setEntryStartYState] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('planets_entryStartY');
            return saved ? parseFloat(saved) : 0.0;
        }
        return 0.0;
    });
    const [entryStartZ, setEntryStartZState] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('planets_entryStartZ');
            if (saved === 'null') return null;
            return saved ? parseFloat(saved) : null;
        }
        return null;
    });
    const [entrySpeed, setEntrySpeedState] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('planets_entrySpeed');
            return saved ? parseFloat(saved) : 30;
        }
        return 30;
    });

    // Wrapper functions to save to localStorage on change
    const setEntryStartX = (value: number) => {
        setEntryStartXState(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem('planets_entryStartX', value.toString());
        }
    };
    const setEntryStartY = (value: number) => {
        setEntryStartYState(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem('planets_entryStartY', value.toString());
        }
    };
    const setEntryStartZ = (value: number | null) => {
        setEntryStartZState(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem('planets_entryStartZ', value === null ? 'null' : value.toString());
        }
    };
    const setEntrySpeed = (value: number) => {
        setEntrySpeedState(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem('planets_entrySpeed', value.toString());
        }
    };

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
            setGlobalShapeOverride,
            entryStartX,
            setEntryStartX,
            entryStartY,
            setEntryStartY,
            entryStartZ,
            setEntryStartZ,
            entrySpeed,
            setEntrySpeed
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
