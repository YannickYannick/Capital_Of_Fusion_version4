"use client";

import { useRef, useMemo } from "react";
import { Mesh, Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Ring } from "@react-three/drei";

interface PlanetProps {
    name: string;
    orbitRadius: number;
    orbitSpeed: number;
    size: number;
    color: string;
    onClick: () => void;
}

export default function Planet({ name, orbitRadius, orbitSpeed, size, color, onClick }: PlanetProps) {
    const groupRef = useRef<Group>(null);
    const planetRef = useRef<Mesh>(null);

    // Random start position
    const startAngle = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.getElapsedTime() * orbitSpeed + startAngle;
        groupRef.current.position.x = Math.cos(t) * orbitRadius;
        groupRef.current.position.z = Math.sin(t) * orbitRadius;

        // Self rotation
        if (planetRef.current) {
            planetRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group>
            {/* Orbit Trace */}
            <Ring
                args={[orbitRadius - 0.05, orbitRadius + 0.05, 128]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </Ring>

            <group ref={groupRef}>
                <mesh
                    ref={planetRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    onPointerOver={() => (document.body.style.cursor = 'pointer')}
                    onPointerOut={() => (document.body.style.cursor = 'auto')}
                >
                    <sphereGeometry args={[size, 32, 32]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />

                    <Html distanceFactor={10} center position={[0, size + 1, 0]}>
                        <div className="px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded border border-white/10 text-white/90 text-[10px] font-medium whitespace-nowrap select-none pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent">
                            {name}
                        </div>
                    </Html>
                </mesh>
            </group>
        </group>
    );
}
