"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { Html } from "@react-three/drei";

interface SunProps {
    name: string;
    onClick: () => void;
}

export default function Sun({ name, onClick }: SunProps) {
    const meshRef = useRef<Mesh>(null);

    return (
        <mesh
            ref={meshRef}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
            <sphereGeometry args={[2.5, 64, 64]} />
            <meshStandardMaterial
                emissive="#fbbf24"
                emissiveIntensity={2}
                color="#f59e0b"
                roughness={0}
            />
            {/* Glow effect */}
            <pointLight distance={20} intensity={5} color="#fbbf24" />

            <Html distanceFactor={15} center position={[0, 4, 0]}>
                <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-yellow-500/30 text-yellow-400 font-bold text-sm whitespace-nowrap shadow-xl select-none pointer-events-none">
                    {name}
                </div>
            </Html>
        </mesh>
    );
}
