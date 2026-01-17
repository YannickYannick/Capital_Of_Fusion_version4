"use client";

import { useEffect, useState } from "react";

interface DebugCoordinatesProps {
    sceneRef: React.RefObject<THREE.Scene | null>;
    cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
    controlsRef?: React.RefObject<any>;
}

export default function DebugCoordinates({ sceneRef, cameraRef, controlsRef }: DebugCoordinatesProps) {
    const [cameraPos, setCameraPos] = useState({ x: 0, y: 0, z: 0 });
    const [cameraTarget, setCameraTarget] = useState({ x: 0, y: 0, z: 0 });
    const [sceneCenter, setSceneCenter] = useState({ x: 0, y: 0, z: 0 });

    // Input states for manual control
    const [inputPos, setInputPos] = useState({ x: "0", y: "0", z: "0" });
    const [inputTarget, setInputTarget] = useState({ x: "0", y: "0", z: "0" });

    useEffect(() => {
        const interval = setInterval(() => {
            if (cameraRef.current) {
                const pos = cameraRef.current.position;
                setCameraPos({ x: pos.x, y: pos.y, z: pos.z });
                setInputPos({ x: pos.x.toFixed(2), y: pos.y.toFixed(2), z: pos.z.toFixed(2) });
            }

            if (controlsRef?.current) {
                const target = controlsRef.current.target;
                setCameraTarget({ x: target.x, y: target.y, z: target.z });
                setInputTarget({ x: target.x.toFixed(2), y: target.y.toFixed(2), z: target.z.toFixed(2) });
            }

            setSceneCenter({ x: 0, y: 0, z: 0 });
        }, 100);

        return () => clearInterval(interval);
    }, [cameraRef, sceneRef, controlsRef]);

    const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
        setInputPos(prev => ({ ...prev, [axis]: value }));
    };

    const handleTargetChange = (axis: 'x' | 'y' | 'z', value: string) => {
        setInputTarget(prev => ({ ...prev, [axis]: value }));
    };

    const applyPosition = () => {
        if (cameraRef.current) {
            cameraRef.current.position.set(
                parseFloat(inputPos.x) || 0,
                parseFloat(inputPos.y) || 0,
                parseFloat(inputPos.z) || 0
            );
        }
    };

    const applyTarget = () => {
        if (controlsRef?.current) {
            controlsRef.current.target.set(
                parseFloat(inputTarget.x) || 0,
                parseFloat(inputTarget.y) || 0,
                parseFloat(inputTarget.z) || 0
            );
            controlsRef.current.update();
        }
    };

    return (
        <div className="fixed top-24 left-8 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 z-20 font-mono text-xs space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Camera Position - Read Only */}
            <div>
                <p className="text-emerald-400 font-semibold mb-2">📷 Position Caméra</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 w-4">X:</span>
                        <input
                            type="number"
                            step="0.1"
                            value={inputPos.x}
                            onChange={(e) => handlePositionChange('x', e.target.value)}
                            className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white/90 text-xs focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 w-4">Y:</span>
                        <input
                            type="number"
                            step="0.1"
                            value={inputPos.y}
                            onChange={(e) => handlePositionChange('y', e.target.value)}
                            className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white/90 text-xs focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 w-4">Z:</span>
                        <input
                            type="number"
                            step="0.1"
                            value={inputPos.z}
                            onChange={(e) => handlePositionChange('z', e.target.value)}
                            className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white/90 text-xs focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                    <button
                        onClick={applyPosition}
                        className="w-full mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
                    >
                        Appliquer Position
                    </button>
                </div>
            </div>

            {/* Camera Target */}
            <div className="border-t border-white/10 pt-3">
                <p className="text-blue-400 font-semibold mb-2">🎯 Cible Caméra (Orientation)</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 w-4">X:</span>
                        <input
                            type="number"
                            step="0.1"
                            value={inputTarget.x}
                            onChange={(e) => handleTargetChange('x', e.target.value)}
                            className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white/90 text-xs focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 w-4">Y:</span>
                        <input
                            type="number"
                            step="0.1"
                            value={inputTarget.y}
                            onChange={(e) => handleTargetChange('y', e.target.value)}
                            className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white/90 text-xs focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 w-4">Z:</span>
                        <input
                            type="number"
                            step="0.1"
                            value={inputTarget.z}
                            onChange={(e) => handleTargetChange('z', e.target.value)}
                            className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white/90 text-xs focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <button
                        onClick={applyTarget}
                        className="w-full mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors"
                    >
                        Appliquer Orientation
                    </button>
                </div>
            </div>

            {/* Scene Center - Read Only */}
            <div className="border-t border-white/10 pt-3">
                <p className="text-purple-400 font-semibold mb-2">🌍 Centre Scène</p>
                <div className="space-y-1">
                    <p className="text-white/80">X: {sceneCenter.x.toFixed(2)}</p>
                    <p className="text-white/80">Y: {sceneCenter.y.toFixed(2)}</p>
                    <p className="text-white/80">Z: {sceneCenter.z.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
