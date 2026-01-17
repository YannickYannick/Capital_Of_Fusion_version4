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
}

const PlanetsOptionsContext = createContext<PlanetsOptionsContextType | undefined>(undefined);

export function PlanetsOptionsProvider({ children }: { children: ReactNode }) {
    const [showOrbits, setShowOrbits] = useState(true);
    const [planetSpeed, setPlanetSpeed] = useState(1);
    const [enableVideoCycle, setEnableVideoCycle] = useState(true);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const [freezePlanets, setFreezePlanets] = useState(false);
    const [grayscaleVideo, setGrayscaleVideo] = useState(true);

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
            setGrayscaleVideo
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
