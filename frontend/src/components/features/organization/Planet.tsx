"use client";

import { useRef, useMemo } from "react";
import { Mesh, Group } from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Ring } from "@react-three/drei";
import * as THREE from "three";

interface PlanetProps {
    name: string;
    orbitRadius: number;
    orbitSpeed: number;
    size: number;
    color: string;
    index: number;
    startX: number;
    onClick: () => void;
}

export default function Planet({ name, orbitRadius, orbitSpeed, size, color, index, startX, onClick }: PlanetProps) {
    const groupRef = useRef<Group>(null);
    const planetRef = useRef<Mesh>(null);

    // Initial setup data for the "Fan Mode"
    const fanData = useMemo(() => {
        const stagger = index * 8; // Distance between each ball at start
        return {
            state: 'line', // 'line' | 'orbit'
            currentX: startX - stagger,
            originX: startX,
            originY: 0.5,
            originZ: 5, // A common starting Z point
            lineSpeed: 0.25,
            angle: 0 // Will be set upon entering orbit
        };
    }, [index, startX]);

    // Geometry for the approach line visual
    const lineGeo = useMemo(() => {
        const points = [
            new THREE.Vector3(startX, 0.5, 5), // Origin
            new THREE.Vector3(0, 0, orbitRadius) // Destination (Orbit Entry)
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        geo.computeBoundingSphere(); // Critical for frustum culling
        return geo;
    }, [startX, orbitRadius]);

    // Use a ref for mutable state to avoid re-renders during animation
    const stateRef = useRef(fanData);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;

        const data = stateRef.current;

        if (data.state === 'line') {
            // --- LINE PHASE ---
            data.currentX += data.lineSpeed;

            // Calculate progress (0 to 1) based on currentX relative to origin and target (0)
            // Assuming startX is negative and we move towards 0
            let progress = 0;
            if (data.originX !== 0) {
                progress = (data.currentX - data.originX) / (0 - data.originX);
            }
            progress = Math.max(0, Math.min(1, progress));

            // Interpolate Position
            // Y: From originY (0.5) to Orbit Y (0) - let's keep it flat for now or match prototype
            const currentY = THREE.MathUtils.lerp(data.originY, 0, progress);

            // Z: From originZ (5) to Target Orbit Radius
            const currentZ = THREE.MathUtils.lerp(data.originZ, orbitRadius, progress);

            groupRef.current.position.set(data.currentX, currentY, currentZ);

            // Rotate the group slightly for effect during approach? 
            // Prototype did: sphere.rotation.z -= data.lineSpeed; 
            if (planetRef.current) {
                planetRef.current.rotation.z -= 0.1;
            }

            // --- TRANSITION TRIGGER ---
            if (data.currentX >= 0) {
                data.state = 'orbit';
                // Lock exact position
                groupRef.current.position.set(0, 0, orbitRadius);
                // Set initial angle to 0 (or Math.PI/2 depending on coordinate system, but 0 is 'right' usually, here we arrive at x=0, z=Radius which corresponds to angle = PI/2 in some systems, or 0 in others)
                // In standard mapping: x = cos(a) * r, z = sin(a) * r.
                // At x=0, z=r -> cos(a)=0, sin(a)=1 -> a = PI/2.
                data.angle = Math.PI / 2;
            }

        } else {
            // --- ORBIT PHASE ---
            data.angle -= orbitSpeed;

            groupRef.current.position.x = Math.cos(data.angle) * orbitRadius;
            groupRef.current.position.z = Math.sin(data.angle) * orbitRadius;

            // Self rotation
            if (planetRef.current) {
                planetRef.current.rotation.y += 0.01;
                // Reset Z rotation from line phase if needed
                planetRef.current.rotation.z = 0;
            }
        }
    });

    return (
        <group>
            {/* Approach Trajectory Line - Native Three.js Line */}
            <line geometry={lineGeo} frustumCulled={false}>
                <lineBasicMaterial color="#ffffff" opacity={0.15} transparent />
            </line>

            {/* Orbit Trace - Always visible or fade in? Keeping it visible for structure */}
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
