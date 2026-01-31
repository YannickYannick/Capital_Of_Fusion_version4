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
    // Reset camera view
    resetToken: number;
    triggerReset: () => void;
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
    // Video Overlay Cycle (for dual video on explore page)
    videoCycleVisible: number;
    setVideoCycleVisible: (v: number) => void;
    videoCycleHidden: number;
    setVideoCycleHidden: (v: number) => void;
    videoTransitionDuration: number;
    setVideoTransitionDuration: (v: number) => void;
    // Camera reference position (for reset)
    refCameraX: number;
    setRefCameraX: (v: number) => void;
    refCameraY: number;
    setRefCameraY: (v: number) => void;
    refCameraZ: number;
    setRefCameraZ: (v: number) => void;
    refTargetX: number;
    setRefTargetX: (v: number) => void;
    refTargetY: number;
    setRefTargetY: (v: number) => void;
    refTargetZ: number;
    setRefTargetZ: (v: number) => void;
}

const PlanetsOptionsContext = createContext<PlanetsOptionsContextType | undefined>(undefined);

// Default values - used for SSR and as fallback
const DEFAULTS = {
    showOrbits: true,
    planetSpeed: 1,
    enableVideoCycle: true,
    showDebugInfo: false,
    freezePlanets: false,
    grayscaleVideo: true,
    fishEye: 50,
    orbitSpacing: 1,
    mouseForce: 0.5,
    collisionForce: 0.3,
    damping: 0.92,
    returnForce: 0.08,
    orbitShape: 'circle' as const,
    orbitRoundness: 0.6,
    globalShapeOverride: false,
    entryStartX: -60.0,
    entryStartY: 0.0,
    entryStartZ: null as number | null,
    entrySpeed: 30,
    videoCycleVisible: 10,
    videoCycleHidden: 10,
    videoTransitionDuration: 1500,
    // Camera reference position (based on distance=20, angle=20deg)
    refCameraX: 0,
    refCameraY: 6.84,
    refCameraZ: 18.79,
    refTargetX: 0,
    refTargetY: 0,
    refTargetZ: 0,
};

export function PlanetsOptionsProvider({ children }: { children: ReactNode }) {
    // Helper to save to localStorage (client-side only)
    const saveToStorage = (key: string, value: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, typeof value === 'boolean' ? value.toString() : String(value));
        }
    };

    // All states initialized with SSR-safe defaults (no localStorage read during render)
    const [showOrbits, setShowOrbitsState] = useState(DEFAULTS.showOrbits);
    const [planetSpeed, setPlanetSpeedState] = useState(DEFAULTS.planetSpeed);
    const [enableVideoCycle, setEnableVideoCycleState] = useState(DEFAULTS.enableVideoCycle);
    const [showDebugInfo, setShowDebugInfoState] = useState(DEFAULTS.showDebugInfo);
    const [freezePlanets, setFreezePlanetsState] = useState(DEFAULTS.freezePlanets);
    const [grayscaleVideo, setGrayscaleVideoState] = useState(DEFAULTS.grayscaleVideo);
    const [fishEye, setFishEyeState] = useState(DEFAULTS.fishEye);
    const [orbitSpacing, setOrbitSpacingState] = useState(DEFAULTS.orbitSpacing);
    const [mouseForce, setMouseForceState] = useState(DEFAULTS.mouseForce);
    const [collisionForce, setCollisionForceState] = useState(DEFAULTS.collisionForce);
    const [damping, setDampingState] = useState(DEFAULTS.damping);
    const [returnForce, setReturnForceState] = useState(DEFAULTS.returnForce);
    const [restartToken, setRestartToken] = useState(0);
    const [resetToken, setResetToken] = useState(0);
    const [orbitShape, setOrbitShapeState] = useState<'circle' | 'squircle'>(DEFAULTS.orbitShape);
    const [orbitRoundness, setOrbitRoundnessState] = useState(DEFAULTS.orbitRoundness);
    const [globalShapeOverride, setGlobalShapeOverrideState] = useState(DEFAULTS.globalShapeOverride);
    const [entryStartX, setEntryStartXState] = useState(DEFAULTS.entryStartX);
    const [entryStartY, setEntryStartYState] = useState(DEFAULTS.entryStartY);
    const [entryStartZ, setEntryStartZState] = useState<number | null>(DEFAULTS.entryStartZ);
    const [entrySpeed, setEntrySpeedState] = useState(DEFAULTS.entrySpeed);
    const [videoCycleVisible, setVideoCycleVisibleState] = useState(DEFAULTS.videoCycleVisible);
    const [videoCycleHidden, setVideoCycleHiddenState] = useState(DEFAULTS.videoCycleHidden);
    const [videoTransitionDuration, setVideoTransitionDurationState] = useState(DEFAULTS.videoTransitionDuration);
    const [refCameraX, setRefCameraXState] = useState(DEFAULTS.refCameraX);
    const [refCameraY, setRefCameraYState] = useState(DEFAULTS.refCameraY);
    const [refCameraZ, setRefCameraZState] = useState(DEFAULTS.refCameraZ);
    const [refTargetX, setRefTargetXState] = useState(DEFAULTS.refTargetX);
    const [refTargetY, setRefTargetYState] = useState(DEFAULTS.refTargetY);
    const [refTargetZ, setRefTargetZState] = useState(DEFAULTS.refTargetZ);

    // Load all values from localStorage AFTER hydration (client-side only)
    useEffect(() => {
        const loadBool = (key: string, setter: (v: boolean) => void, def: boolean) => {
            const saved = localStorage.getItem(key);
            if (saved !== null) setter(saved === 'true');
        };
        const loadNum = (key: string, setter: (v: number) => void) => {
            const saved = localStorage.getItem(key);
            if (saved !== null) setter(parseFloat(saved));
        };
        
        loadBool('planets_showOrbits', setShowOrbitsState, DEFAULTS.showOrbits);
        loadNum('planets_speed', setPlanetSpeedState);
        loadBool('planets_enableVideoCycle', setEnableVideoCycleState, DEFAULTS.enableVideoCycle);
        loadBool('planets_showDebugInfo', setShowDebugInfoState, DEFAULTS.showDebugInfo);
        loadBool('planets_freezePlanets', setFreezePlanetsState, DEFAULTS.freezePlanets);
        loadBool('planets_grayscaleVideo', setGrayscaleVideoState, DEFAULTS.grayscaleVideo);
        loadNum('planets_fishEye', setFishEyeState);
        loadNum('planets_orbitSpacing', setOrbitSpacingState);
        loadNum('planets_mouseForce', setMouseForceState);
        loadNum('planets_collisionForce', setCollisionForceState);
        loadNum('planets_damping', setDampingState);
        loadNum('planets_returnForce', setReturnForceState);
        
        const savedShape = localStorage.getItem('planets_orbitShape');
        if (savedShape === 'circle' || savedShape === 'squircle') setOrbitShapeState(savedShape);
        loadNum('planets_orbitRoundness', setOrbitRoundnessState);
        loadBool('planets_globalShapeOverride', setGlobalShapeOverrideState, DEFAULTS.globalShapeOverride);
        
        loadNum('planets_entryStartX', setEntryStartXState);
        loadNum('planets_entryStartY', setEntryStartYState);
        const savedZ = localStorage.getItem('planets_entryStartZ');
        if (savedZ !== null && savedZ !== 'null') setEntryStartZState(parseFloat(savedZ));
        loadNum('planets_entrySpeed', setEntrySpeedState);
        
        loadNum('video_cycleVisible', setVideoCycleVisibleState);
        loadNum('video_cycleHidden', setVideoCycleHiddenState);
        loadNum('video_transitionDuration', setVideoTransitionDurationState);
        
        // Camera reference position
        loadNum('camera_ref_x', setRefCameraXState);
        loadNum('camera_ref_y', setRefCameraYState);
        loadNum('camera_ref_z', setRefCameraZState);
        loadNum('camera_ref_target_x', setRefTargetXState);
        loadNum('camera_ref_target_y', setRefTargetYState);
        loadNum('camera_ref_target_z', setRefTargetZState);
    }, []);

    const triggerRestart = () => setRestartToken(prev => prev + 1);
    const triggerReset = () => setResetToken(prev => prev + 1);

    // Wrapper setters that persist to localStorage
    const setShowOrbits = (v: boolean) => { setShowOrbitsState(v); saveToStorage('planets_showOrbits', v); };
    const setPlanetSpeed = (v: number) => { setPlanetSpeedState(v); saveToStorage('planets_speed', v); };
    const setEnableVideoCycle = (v: boolean) => { setEnableVideoCycleState(v); saveToStorage('planets_enableVideoCycle', v); };
    const setShowDebugInfo = (v: boolean) => { setShowDebugInfoState(v); saveToStorage('planets_showDebugInfo', v); };
    const setFreezePlanets = (v: boolean) => { setFreezePlanetsState(v); saveToStorage('planets_freezePlanets', v); };
    const setGrayscaleVideo = (v: boolean) => { setGrayscaleVideoState(v); saveToStorage('planets_grayscaleVideo', v); };
    const setFishEye = (v: number) => { setFishEyeState(v); saveToStorage('planets_fishEye', v); };
    const setOrbitSpacing = (v: number) => { setOrbitSpacingState(v); saveToStorage('planets_orbitSpacing', v); };
    const setMouseForce = (v: number) => { setMouseForceState(v); saveToStorage('planets_mouseForce', v); };
    const setCollisionForce = (v: number) => { setCollisionForceState(v); saveToStorage('planets_collisionForce', v); };
    const setDamping = (v: number) => { setDampingState(v); saveToStorage('planets_damping', v); };
    const setReturnForce = (v: number) => { setReturnForceState(v); saveToStorage('planets_returnForce', v); };
    const setOrbitShape = (v: 'circle' | 'squircle') => { setOrbitShapeState(v); saveToStorage('planets_orbitShape', v); };
    const setOrbitRoundness = (v: number) => { setOrbitRoundnessState(v); saveToStorage('planets_orbitRoundness', v); };
    const setGlobalShapeOverride = (v: boolean) => { setGlobalShapeOverrideState(v); saveToStorage('planets_globalShapeOverride', v); };
    const setEntryStartX = (v: number) => { setEntryStartXState(v); saveToStorage('planets_entryStartX', v); };
    const setEntryStartY = (v: number) => { setEntryStartYState(v); saveToStorage('planets_entryStartY', v); };
    const setEntryStartZ = (v: number | null) => { 
        setEntryStartZState(v); 
        if (typeof window !== 'undefined') {
            localStorage.setItem('planets_entryStartZ', v === null ? 'null' : v.toString());
        }
    };
    const setEntrySpeed = (v: number) => { setEntrySpeedState(v); saveToStorage('planets_entrySpeed', v); };

    const setVideoCycleVisible = (v: number) => { setVideoCycleVisibleState(v); saveToStorage('video_cycleVisible', v); };
    const setVideoCycleHidden = (v: number) => { setVideoCycleHiddenState(v); saveToStorage('video_cycleHidden', v); };
    const setVideoTransitionDuration = (v: number) => { setVideoTransitionDurationState(v); saveToStorage('video_transitionDuration', v); };

    // Camera reference position setters
    const setRefCameraX = (v: number) => { setRefCameraXState(v); saveToStorage('camera_ref_x', v); };
    const setRefCameraY = (v: number) => { setRefCameraYState(v); saveToStorage('camera_ref_y', v); };
    const setRefCameraZ = (v: number) => { setRefCameraZState(v); saveToStorage('camera_ref_z', v); };
    const setRefTargetX = (v: number) => { setRefTargetXState(v); saveToStorage('camera_ref_target_x', v); };
    const setRefTargetY = (v: number) => { setRefTargetYState(v); saveToStorage('camera_ref_target_y', v); };
    const setRefTargetZ = (v: number) => { setRefTargetZState(v); saveToStorage('camera_ref_target_z', v); };

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
            triggerRestart,
            resetToken,
            triggerReset,
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
            setEntrySpeed,
            videoCycleVisible,
            setVideoCycleVisible,
            videoCycleHidden,
            setVideoCycleHidden,
            videoTransitionDuration,
            setVideoTransitionDuration,
            refCameraX,
            setRefCameraX,
            refCameraY,
            setRefCameraY,
            refCameraZ,
            setRefCameraZ,
            refTargetX,
            setRefTargetX,
            refTargetY,
            setRefTargetY,
            refTargetZ,
            setRefTargetZ
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
