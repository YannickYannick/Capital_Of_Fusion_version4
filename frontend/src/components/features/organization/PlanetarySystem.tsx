"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import Sun from "./Sun";
import Planet from "./Planet";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useOrganizationStore } from "@/store/useOrganizationStore";

// Type definition for API response
interface OrgNode {
    id: string;
    name: string;
    slug: string;
    type: 'ROOT' | 'BRANCH' | 'EVENT';
    parent_id: string | null;
    orbit_radius?: number;
}

export default function PlanetarySystem() {
    const setSelectedNode = useOrganizationStore((state) => state.setSelectedNode);

    const { data, isLoading } = useQuery({
        queryKey: ['organization-structure'],
        queryFn: async () => {
            const res = await api.get('/organization/nodes/structure/');
            return res.data.nodes as OrgNode[];
        }
    });

    if (isLoading) return (
        <div className="h-screen w-full bg-[#050510] flex items-center justify-center">
            <div className="text-white/30 animate-pulse uppercase tracking-widest text-xs font-bold">
                Initialisation du système...
            </div>
        </div>
    );

    // Calculate orbits for branches
    const nodes = data || [];
    const rootNode = nodes.find(n => n.type === 'ROOT');
    const branchNodes = nodes.filter(n => n.type !== 'ROOT');

    return (
        <div className="h-screen w-full bg-[#050510]">
            <Canvas shadows gl={{ antialias: true }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 25, 35]} fov={45} />

                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={2} castShadow />

                    <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        maxDistance={60}
                        minDistance={10}
                        maxPolarAngle={Math.PI / 2.1}
                    />

                    {/* Hierarchy Rendering */}
                    {rootNode && (
                        <Sun
                            name={rootNode.name}
                            onClick={() => setSelectedNode(rootNode)}
                        />
                    )}

                    {branchNodes.map((item, index) => (
                        <Planet
                            key={item.id}
                            name={item.name}
                            orbitRadius={item.orbit_radius || (10 + index * 5)} // Use DB value if matches, else fallback
                            orbitSpeed={0.2 - index * 0.05}
                            color={index % 2 === 0 ? "#3b82f6" : "#10b981"}
                            size={1.2 - index * 0.1}
                            index={index}
                            startX={-40}
                            onClick={() => setSelectedNode(item)}
                        />
                    ))}
                </Suspense>
            </Canvas>

            {/* Hint Overlay */}
            <div className="absolute bottom-8 left-8 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 pointer-events-none">
                <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-2">Navigation</p>
                <ul className="text-white/80 text-[10px] space-y-1">
                    <li>• Clic gauche : Rotation</li>
                    <li>• Clic droit : Panoramique</li>
                    <li>• Molette : Zoom</li>
                    <li>• Clic Objet : Détails</li>
                </ul>
            </div>
        </div>
    );
}
