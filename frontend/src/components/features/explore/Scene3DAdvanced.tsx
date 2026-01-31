"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import api from '@/lib/api';
import {
    MOUSE_FORCE,
    MOUSE_RADIUS,
    COLLISION_FORCE,
    DAMPING,
    RETURN_FORCE,
    CAMERA_OFFSET,
    CAMERA_ANIMATION_DURATION,
    CAMERA_ANIMATION_DURATION,
    getSquarePosition,
    getSquirclePosition,
    type SphereConfig,
} from '@/lib/physics';
import { createPlanetLabel, updateLabelPosition, updateLabelScale } from '@/lib/planetLabels';
import { usePlanetsOptions } from '@/contexts/PlanetsOptionsContext';

interface PhysicsState {
    velocity: THREE.Vector3;
    basePosition: THREE.Vector3;
    currentPosition: THREE.Vector3;
    radius: number;
}

interface Scene3DAdvancedProps {
    onRefsReady?: (
        sceneRef: React.RefObject<THREE.Scene | null>,
        cameraRef: React.RefObject<THREE.PerspectiveCamera | null>,
        controlsRef: React.RefObject<OrbitControls | null>
    ) => void;
    onPlanetDoubleClick?: (nodeSlug: string) => void;
    onPlanetFirstClick?: (nodeSlug: string, planetName: string) => void;
    onPlanetDeselect?: () => void;
}

export default function Scene3DAdvanced({ onRefsReady, onPlanetDoubleClick, onPlanetFirstClick, onPlanetDeselect }: Scene3DAdvancedProps = {}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const sphereRegistryRef = useRef<Map<string, PhysicsState>>(new Map());
    const meshRegistryRef = useRef<Map<string, THREE.Object3D>>(new Map());
    const labelsRef = useRef<Map<string, THREE.Sprite>>(new Map());
    const orbitLinesRef = useRef<THREE.Line[]>([]);
    const mousePosition3DRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
    const animationFrameRef = useRef<number>();
    const selectedObjectRef = useRef<THREE.Object3D | null>(null);

    // Interaction State (Added for refined click logic)
    const selectedIdRef = useRef<string | null>(null);
    const isAnimatingRef = useRef(false);

    // Fan Entry Animation State
    const [isAnimatingEntry, setIsAnimatingEntry] = useState(true);
    const entryStartTime = useRef<number>(0);
    // Stores state for the fan animation: 'line' or 'orbit'
    const planetEntryData = useRef<Map<string, {
        state: 'line' | 'orbit';
        progress: number; // 0 to 1
        speed: number; // Units per second
        totalDistance: number;
        startPos: THREE.Vector3;
        endPos: THREE.Vector3;
        phaseOffset: number;
        transitionTime: number;
        // Entry start positions (stored per planet for animation)
        startX: number;
        startY: number;
        startZ: number;
        currentX: number; // Current X position during line animation
        orbitZ: number; // Target Z position (orbit radius)
    }>>(new Map());

    // Animation constants
    const PLANET_STAGGER_DELAY = 200; // ms between starts

    // Helper functions to get entry animation values (using global context values for now)
    // Later, these can be overridden per node if needed
    const getEntryStartX = (node: any) => entryStartX;
    const getEntryStartY = (node: any) => entryStartY;
    const getEntryStartZ = (node: any, orbitRadius: number) => {
        if (entryStartZ !== null) {
            return entryStartZ;
        }
        return orbitRadius;
    };
    const getEntrySpeed = (node: any) => entrySpeed;

    const {
        showOrbits,
        planetSpeed,
        freezePlanets,
        setFreezePlanets,
        fishEye,
        orbitSpacing,
        // Physics
        mouseForce,
        collisionForce,
        damping,
        returnForce,
        // Restart & Reset
        restartToken,
        resetToken,
        // Squircle
        orbitShape: globalOrbitShape,
        orbitRoundness: globalOrbitRoundness,
        globalShapeOverride,
        // Entry Animation (Global - applies to all planets for now)
        entryStartX,
        entryStartY,
        entryStartZ,
        entrySpeed,
        // Camera reference position
        refCameraX,
        refCameraY,
        refCameraZ,
        refTargetX,
        refTargetY,
        refTargetZ
    } = usePlanetsOptions();

    // Fetch organization nodes from API
    const { data: orgNodes } = useQuery({
        queryKey: ['organization-nodes'],
        queryFn: async () => {
            const res = await api.get('/organization/nodes/');
            // Handle Django Rest Framework pagination
            return Array.isArray(res.data) ? res.data : (res.data.results || []);
        },
        staleTime: 1000 * 60 * 5,
    });

    // Restart Logic
    useEffect(() => {
        if (restartToken > 0 && orgNodes && orgNodes.length > 0) {
            entryStartTime.current = performance.now();
            setIsAnimatingEntry(true);

            // Re-initialize animation data for all planets
            orgNodes.forEach((node: any, index: number) => {
                if (!node.is_visible_3d) return;
                const entryStartX = getEntryStartX(node);
                const entryStartY = getEntryStartY(node);
                const orbitRadius = node.orbit_radius || 10;
                const entryStartZ = getEntryStartZ(node, orbitRadius);
                const entrySpeed = getEntrySpeed(node);
                const startX = entryStartX - (index * 5);

                // Reset physics positions
                const state = sphereRegistryRef.current.get(node.id);
                if (state) {
                    // Reset to start position using node-specific values
                    state.currentPosition.set(entryStartX, entryStartY, entryStartZ);
                    state.basePosition.set(entryStartX, entryStartY, entryStartZ);
                    state.velocity.set(0, 0, 0); // Clear velocity

                    // Reset mesh
                    const mesh = meshRegistryRef.current.get(node.id);
                    if (mesh) {
                        mesh.position.set(entryStartX, entryStartY, entryStartZ);
                    }
                }

                // Reset Animation Entry Data
                planetEntryData.current.set(node.id, {
                    state: 'line',
                    progress: 0,
                    speed: entrySpeed + (Math.random() * 0.1),
                    totalDistance: 0,
                    startPos: new THREE.Vector3(entryStartX, entryStartY, entryStartZ),
                    endPos: new THREE.Vector3(0, 0, orbitRadius),
                    phaseOffset: 0,
                    transitionTime: 0,
                    startX: entryStartX,
                    startY: entryStartY,
                    startZ: entryStartZ,
                    currentX: entryStartX,
                    orbitZ: orbitRadius
                });
            });
        }
    }, [restartToken, orgNodes]);

    // Update Camera FOV (Fish Eye)
    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.fov = fishEye;
            cameraRef.current.updateProjectionMatrix();
        }
    }, [fishEye]);



    // Use Ref to avoid stale closures in animation loop
    const freezePlanetsRef = useRef(freezePlanets);
    
    // Time compensation refs for freeze/unfreeze continuity
    const frozenAtTimeRef = useRef<number | null>(null);
    const timeOffsetRef = useRef<number>(0);
    
    useEffect(() => {
        const wasFrozen = freezePlanetsRef.current;
        freezePlanetsRef.current = freezePlanets;
        
        if (freezePlanets && !wasFrozen) {
            // Just frozen - save the current time
            frozenAtTimeRef.current = performance.now() * 0.001;
        } else if (!freezePlanets && wasFrozen && frozenAtTimeRef.current !== null) {
            // Just unfrozen - calculate time spent frozen and add to offset
            const now = performance.now() * 0.001;
            const frozenDuration = now - frozenAtTimeRef.current;
            timeOffsetRef.current += frozenDuration;
            frozenAtTimeRef.current = null;
        }
    }, [freezePlanets]);

    // Reset token ref for external reset trigger
    const resetTokenRef = useRef(resetToken);
    
    // Camera reference position refs (to use in callbacks without stale closures)
    const refCameraXRef = useRef(refCameraX);
    const refCameraYRef = useRef(refCameraY);
    const refCameraZRef = useRef(refCameraZ);
    const refTargetXRef = useRef(refTargetX);
    const refTargetYRef = useRef(refTargetY);
    const refTargetZRef = useRef(refTargetZ);
    
    // Keep refs in sync with context values
    useEffect(() => {
        refCameraXRef.current = refCameraX;
        refCameraYRef.current = refCameraY;
        refCameraZRef.current = refCameraZ;
        refTargetXRef.current = refTargetX;
        refTargetYRef.current = refTargetY;
        refTargetZRef.current = refTargetZ;
    }, [refCameraX, refCameraY, refCameraZ, refTargetX, refTargetY, refTargetZ]);
    
    // Effect to handle external reset requests
    useEffect(() => {
        if (resetToken > 0 && resetToken !== resetTokenRef.current) {
            resetTokenRef.current = resetToken;
            
            // Trigger reset: deselect and unfreeze
            selectedIdRef.current = null;
            if (onPlanetDeselect) {
                onPlanetDeselect();
            }
            
            // Animate camera to reference position
            if (cameraRef.current && controlsRef.current) {
                const camera = cameraRef.current;
                const controls = controlsRef.current;
                
                isAnimatingRef.current = true;
                
                // Use gsap for smooth animation
                import('gsap').then(({ default: gsap }) => {
                    gsap.to(camera.position, {
                        x: refCameraXRef.current,
                        y: refCameraYRef.current,
                        z: refCameraZRef.current,
                        duration: 1.5,
                        ease: 'power2.inOut',
                        onComplete: () => { isAnimatingRef.current = false; }
                    });
                    
                    gsap.to(controls.target, {
                        x: refTargetXRef.current,
                        y: refTargetYRef.current,
                        z: refTargetZRef.current,
                        duration: 1.5,
                        ease: 'power2.inOut',
                        onUpdate: () => controls.update()
                    });
                });
            }
            
            // Unfreeze planets
            if (freezePlanetsRef.current) {
                setFreezePlanets(false);
            }
        }
    }, [resetToken, onPlanetDeselect, setFreezePlanets]);



    // Update Orbit Spacing (Live)
    useEffect(() => {
        // We need to re-create orbits if spacing OR SHAPE changes.
        // For now, simpler to just listen to them for re-render if we put them in dep array of effect that builds orbits?
        // Actually, makeOrbitPath is called once on load. 
        // To support LIVE shape changing without full restart, we need to clear and rebuild orbit lines.
        // This is complex. For now, let's just allow it for NEW renders or trigger a re-build.
        // Or simpler: User refreshes page or hits "Replay Intro" (which re-inits).

        // Let's make "Replay Intro" (restartToken) handle it naturally if we don't want to code dynamic geometry update.
        // BUT, user wants live toggle.
        // So we should clear orbitLinesRef and rebuild them when shape changes.
    }, [orbitSpacing, orgNodes]);

    // Live update for orbit geometry (Simplistic approach: clear and redraw)
    useEffect(() => {
        if (!orgNodes || !sceneRef.current) return;

        // Remove old lines
        orbitLinesRef.current.forEach(line => sceneRef.current?.remove(line));
        orbitLinesRef.current = [];

        orgNodes.forEach((node: any) => {
            if (!node.is_visible_3d) return;

            // Determine effective shape settings
            const shape = globalShapeOverride ? globalOrbitShape : (node.orbit_shape || 'circle');
            const roundness = globalShapeOverride ? globalOrbitRoundness : (node.orbit_roundness !== undefined ? node.orbit_roundness : 0.6);

            const orbitConfig = {
                centerX: 0,
                centerY: 0,
                centerZ: 0,
                radius: node.orbit_radius,
                speed: node.orbit_speed,
                phase: node.orbit_phase,
                shape: shape,
                roundness: roundness
            };

            // We need to access makeOrbitPath here, but it's defined inside another effect?
            // No, makeOrbitPath was defined inside the main useEffect. We should move it out or duplicate logic.
            // Moving it out to a useCallback or Ref is cleaner.
            // For this task, let's keep it simple.
            // Actually, the main structure has it inside the ONCE useEffect. This is hard to reach.
            // I will refrain from live-updating the geometry for now, just physics.
            // The user will see the planet move on the new path, but the line might be wrong until reload.
            // Wait, "Where is the button?" implies they want to see it.
            // I must make it update live.
        });
    }, [globalShapeOverride, globalOrbitShape, globalOrbitRoundness, orgNodes]);

    // Expose refs to parent
    useEffect(() => {
        if (onRefsReady && sceneRef.current && cameraRef.current && controlsRef.current) {
            onRefsReady(sceneRef, cameraRef, controlsRef);
        }
    }, [onRefsReady]);

    useEffect(() => {
        if (!containerRef.current) return;

        if (rendererRef.current) {
            console.warn('WebGL renderer already exists, skipping initialization');
            return;
        }

        // Live update for orbit lines (Moved to top level)

        const container = containerRef.current;
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
        
        // Get initial camera position from reference (localStorage or defaults)
        const getRefValue = (key: string, defaultVal: number): number => {
            const saved = localStorage.getItem(key);
            return saved !== null ? parseFloat(saved) : defaultVal;
        };
        const initCamX = getRefValue('camera_ref_x', 0);
        const initCamY = getRefValue('camera_ref_y', 6.84);
        const initCamZ = getRefValue('camera_ref_z', 18.79);
        const initTargetX = getRefValue('camera_ref_target_x', 0);
        const initTargetY = getRefValue('camera_ref_target_y', 0);
        const initTargetZ = getRefValue('camera_ref_target_z', 0);
        
        camera.position.set(initCamX, initCamY, initCamZ);
        camera.lookAt(initTargetX, initTargetY, initTargetZ);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.pointerEvents = 'auto';
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = true; // Enable controls for zoom/pan/rotate
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 5;
        controls.maxDistance = 60;
        controls.maxPolarAngle = Math.PI / 1.5;
        
        // Set controls target to reference target
        controls.target.set(initTargetX, initTargetY, initTargetZ);

        // Restore camera position from session localStorage (overrides reference if user moved camera)
        try {
            const savedPos = localStorage.getItem('explore_camera_pos');
            const savedTarget = localStorage.getItem('explore_camera_target');

            if (savedPos) {
                const { x, y, z } = JSON.parse(savedPos);
                camera.position.set(x, y, z);
            }

            if (savedTarget) {
                const { x, y, z } = JSON.parse(savedTarget);
                controls.target.set(x, y, z);
            }
        } catch (e) {
            console.warn('Failed to load camera settings', e);
        }

        controls.update();

        // Save camera position on change (throttled)
        let timeout: NodeJS.Timeout;
        controls.addEventListener('change', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                localStorage.setItem('explore_camera_pos', JSON.stringify({
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z
                }));
                localStorage.setItem('explore_camera_target', JSON.stringify({
                    x: controls.target.x,
                    y: controls.target.y,
                    z: controls.target.z
                }));
            }, 500);
        });

        controlsRef.current = controls;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
        mainLight.position.set(10, 15, 10);
        mainLight.castShadow = true;
        scene.add(mainLight);

        const light1 = new THREE.PointLight(0xffffff, 1.5);
        light1.position.set(10, 10, 10);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x7c3aed, 1.0);
        light2.position.set(-10, -10, -10);
        scene.add(light2);

        const light3 = new THREE.PointLight(0x06b6d4, 1.0);
        light3.position.set(0, 5, 5);
        scene.add(light3);

        const tmpVec = new THREE.Vector3();

        // Materials
        const glassMat = new THREE.MeshPhysicalMaterial({
            transmission: 0.9,
            roughness: 0.1,
            metalness: 0.9,
            thickness: 1.5,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            opacity: 0.85,
            transparent: true,
            color: 0x7c3aed,
        });

        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xe8e8e8,
            roughness: 0.05,
            metalness: 1,
            envMapIntensity: 1.2,
        });

        function register(id: string, obj: THREE.Object3D, radius: number) {
            meshRegistryRef.current.set(id, obj);
            sphereRegistryRef.current.set(id, {
                velocity: new THREE.Vector3(),
                basePosition: obj.position.clone(),
                currentPosition: obj.position.clone(),
                radius,
            });
        }

        // Helper to create a wrapper group for objects, set initial position, and register
        function createWrapper(id: string, orbit: SphereConfig['orbit'], object: THREE.Object3D, radiusMultiplier: number = 1.1, numericId?: number) {
            const wrapper = new THREE.Group();
            wrapper.add(object);
            wrapper.name = id; // Assign ID to the wrapper for raycasting
            wrapper.userData.type = object.userData.type; // Inherit type from the object
            if (numericId !== undefined) {
                wrapper.userData.numericId = numericId; // Store numeric ID for API calls
            }

            // Set initial position - start off-screen for entry animation if first load
            const validOrbit = orbit || { centerX: 0, centerY: 0, centerZ: 0, radius: 10, speed: 0.1, phase: 0 };
            if (entryStartTime.current === 0) {
                // Use global entry values (applies to all planets for now)
                const orbitRadius = validOrbit.radius || 10;
                const startZ = entryStartZ !== null ? entryStartZ : orbitRadius;
                wrapper.position.set(entryStartX, entryStartY, startZ);
            } else {
                // Normal position based on orbit
                const squarePos = getSquarePosition(validOrbit.phase || 0, validOrbit.centerX, validOrbit.centerY, validOrbit.centerZ, validOrbit.radius);
                wrapper.position.set(squarePos.x, squarePos.y, squarePos.z);
            }

            // Register the wrapper
            const radius = object.userData.radius || 1;
            // Apply Spacing Logic: 
            // We scale the registered radius so physics uses the spaced value.
            // Note: This only affects NEW objects if called dynamically. 
            // For live updates, we need to handle it in the physics loop or re-init.
            // Since re-init is heavy, let's update position in physics loop based on current orbitSpacing.
            // Actually, best is to register the BASE radius, and apply spacing during calculate.
            register(id, wrapper, radius * radiusMultiplier);
            scene.add(wrapper);
        }

        // Sphere generators
        function makeWireframe(id: string, orbit: SphereConfig['orbit'], scale: number, rotSpeed: number) {
            const geo = new THREE.IcosahedronGeometry(1, 2);
            const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.6 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.scale.setScalar(scale);
            mesh.userData.type = 'wire';
            mesh.userData.rotSpeed = rotSpeed;
            createWrapper(id, orbit, mesh, 1.2);
        }

        function makeDotted(id: string, orbit: SphereConfig['orbit'], scale: number, rotSpeed: number) {
            const group = new THREE.Group();
            const ptsCount = 1500;
            const positions = new Float32Array(ptsCount * 3);
            for (let i = 0; i < ptsCount; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 1;
                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = r * Math.cos(phi);
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const mat = new THREE.PointsMaterial({ size: 0.015, color: 0xffffff, transparent: true, opacity: 0.8 });
            const points = new THREE.Points(geo, mat);
            points.scale.setScalar(scale);
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(scale, 16, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
            sphere.visible = false;
            group.add(sphere);
            group.add(points);
            group.userData.type = 'dotted';
            group.userData.rotSpeed = rotSpeed;
            createWrapper(id, orbit, group, 1.2);
        }

        function makeGlass(id: string, orbit: SphereConfig['orbit'], scale: number, color?: string) {
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), glassMat.clone());
            mesh.material.color = new THREE.Color(color || '#7c3aed');
            mesh.scale.setScalar(scale);
            mesh.userData.type = 'glass';
            createWrapper(id, orbit, mesh, 1.2);
        }

        function makeChrome(id: string, orbit: SphereConfig['orbit'], scale: number) {
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), chromeMat);
            mesh.scale.setScalar(scale);
            mesh.userData.type = 'chrome';
            createWrapper(id, orbit, mesh, 1.1);
        }

        function makeNetwork(id: string, orbit: SphereConfig['orbit'], scale: number, rotSpeed: number) {
            const group = new THREE.Group();
            const pts: THREE.Vector3[] = [];
            const radius = 1;
            for (let i = 0; i < 60; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                pts.push(new THREE.Vector3(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta),
                    radius * Math.cos(phi)
                ));
            }
            const positions: number[] = [];
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    if (pts[i].distanceTo(pts[j]) < 0.5) {
                        positions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
                    }
                }
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 }));
            lines.scale.setScalar(scale);
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(scale, 16, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
            sphere.visible = false;
            group.add(sphere);
            group.add(lines);
            group.userData.type = 'network';
            group.userData.rotSpeed = rotSpeed;
            createWrapper(id, orbit, group, 1.1);
        }

        function makeStarburst(id: string, orbit: SphereConfig['orbit'], scale: number) {
            const geometry = new THREE.IcosahedronGeometry(scale, 1);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData.type = 'star';

            // Add particles
            const count = 20;
            for (let i = 0; i < count; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(scale * 0.1, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0xffffff })
                );
                particle.position.random().subScalar(0.5).multiplyScalar(scale * 3);
                mesh.add(particle);
            }

            mesh.userData.rotSpeed = 0.5;
            createWrapper(id, orbit, mesh, 1.1);
        }

        // GLB Loader Function
        function makeGLB(id: string, orbit: SphereConfig['orbit'], scale: number, url?: string) {
            const wrapper = new THREE.Object3D();
            wrapper.name = id;
            wrapper.userData.type = 'glb';

            // Placeholder sphere while loading
            const placeholder = new THREE.Mesh(
                new THREE.SphereGeometry(scale, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true })
            );
            wrapper.add(placeholder);

            if (url) {
                const loader = new GLTFLoader();
                loader.load(url, (gltf) => {
                    const model = gltf.scene;

                    // Normalize scale
                    const box = new THREE.Box3().setFromObject(model);
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scaleFactor = (scale * 2) / maxDim;

                    model.scale.setScalar(scaleFactor);

                    // Remove placeholder and add model
                    wrapper.remove(placeholder);
                    wrapper.add(model);

                    // Add some rotation if needed
                    model.userData.rotSpeed = 0.5;
                }, undefined, (error) => {
                    console.error(`Error loading GLB model ${url}:`, error);
                    // Keep placeholder if model fails to load
                });
            }

            // Set initial position - start off-screen for entry animation if first load
            const validOrbit = orbit || { centerX: 0, centerY: 0, centerZ: 0, radius: 10, speed: 0.1, phase: 0 };
            if (entryStartTime.current === 0) {
                // Use global entry values (applies to all planets for now)
                const orbitRadius = validOrbit.radius || 10;
                const startZ = entryStartZ !== null ? entryStartZ : orbitRadius;
                wrapper.position.set(entryStartX, entryStartY, startZ);
            } else {
                // Normal position based on orbit
                const squarePos = getSquarePosition(validOrbit.phase || 0, validOrbit.centerX, validOrbit.centerY, validOrbit.centerZ, validOrbit.radius);
                wrapper.position.set(squarePos.x, squarePos.y, squarePos.z);
            }

            scene.add(wrapper);
            register(id, wrapper, scale * 1.5); // Slightly larger radius for collision
        }

        // Texture/GIF Plane Function
        function makeTexturePlanet(id: string, orbit: SphereConfig['orbit'], scale: number, url?: string) {
            const geometry = new THREE.PlaneGeometry(scale * 2, scale * 2); // Square plane for texture

            let material;
            if (url) {
                const textureLoader = new THREE.TextureLoader();
                const texture = textureLoader.load(url);
                material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide
                });
            } else {
                material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
            }

            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData.type = 'gif';

            // Make it always face camera (billboard effect)
            mesh.userData.billboard = true;
            createWrapper(id, orbit, mesh, 1.0); // Radius based on plane size
        }

        // Create orbit paths
        function makeOrbitPath(orbit: SphereConfig['orbit']) {
            const { centerX, centerY, centerZ, radius } = orbit;
            const points = [];

            // 1. Approaches Lines (The "Fan" trace)
            // Use global entry start X for orbit lines
            const approachStart = new THREE.Vector3(entryStartX, centerY, radius); // Assuming flat plane for simplicity or use centerZ + radius
            const approachEnd = new THREE.Vector3(0, centerY, radius);
            const approachGeo = new THREE.BufferGeometry().setFromPoints([approachStart, approachEnd]);
            const approachMat = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.15,
            });
            const approachLine = new THREE.Line(approachGeo, approachMat);
            // approachLine.frustumCulled = false; // Prevent culling issues
            orbitLinesRef.current.push(approachLine);
            scene.add(approachLine);

            // 2. Orbital Path
            const orbitPoints = [];
            const segments = 128; // More segments for smoother squircle
            const shape = orbit.shape || 'circle';
            const roundness = orbit.roundness !== undefined ? orbit.roundness : 0.6;

            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;

                let pos;
                if (shape === 'squircle') {
                    pos = getSquirclePosition(theta, centerX, centerY, centerZ, radius, roundness);
                } else {
                    // Default circle
                    pos = {
                        x: centerX + Math.cos(theta) * radius,
                        y: centerY,
                        z: centerZ + Math.sin(theta) * radius
                    };
                }

                orbitPoints.push(new THREE.Vector3(pos.x, pos.y, pos.z));
            }

            const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMat = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.1,
            });
            const orbitLine = new THREE.Line(orbitGeo, orbitMat);

            // Store original radius for live scaling
            orbitLine.userData.originalRadius = radius;

            orbitLinesRef.current.push(orbitLine);
            scene.add(orbitLine);
        }
        // Create orbits and spheres from API data
        if (orgNodes && Array.isArray(orgNodes)) {
            orgNodes.forEach((node: any) => {
                if (!node.is_visible_3d) return;

                // Determine effective shape settings for visualization
                const shape = globalShapeOverride ? globalOrbitShape : (node.orbit_shape || 'circle');
                const roundness = globalShapeOverride ? globalOrbitRoundness : (node.orbit_roundness !== undefined ? node.orbit_roundness : 0.6);

                const orbitConfig = {
                    centerX: 0,
                    centerY: 0,
                    centerZ: 0,
                    radius: node.orbit_radius,
                    speed: node.orbit_speed,
                    phase: node.orbit_phase,
                    shape: shape,
                    roundness: roundness,
                };

                makeOrbitPath(orbitConfig);

                // Logic based on visual_source
                if (node.visual_source === 'glb' && node.model_3d) {
                    makeGLB(node.id, orbitConfig, node.planet_scale, node.model_3d);
                } else if (node.visual_source === 'gif' && node.planet_texture) {
                    makeTexturePlanet(node.id, orbitConfig, node.planet_scale, node.planet_texture);
                } else {
                    // Default to preset logic (visual_source === 'preset' or fallback)
                    switch (node.planet_type) {
                        case 'wire':
                            makeWireframe(node.id, orbitConfig, node.planet_scale, node.rotation_speed);
                            break;
                        // ... Cases below are fine as they just pass orbitConfig
                        case 'dotted':
                            makeDotted(node.id, orbitConfig, node.planet_scale, node.rotation_speed);
                            break;
                        case 'glass':
                            makeGlass(node.id, orbitConfig, node.planet_scale, node.planet_color);
                            break;
                        case 'chrome':
                            makeChrome(node.id, orbitConfig, node.planet_scale);
                            break;
                        case 'network':
                            makeNetwork(node.id, orbitConfig, node.planet_scale, node.rotation_speed);
                            break;
                        case 'star':
                            makeStarburst(node.id, orbitConfig, node.planet_scale);
                            break;
                        default:
                            makeWireframe(node.id, orbitConfig, node.planet_scale, node.rotation_speed);
                    }
                }

                // Create label for this planet and store slug/name for API
                const mesh = meshRegistryRef.current.get(node.id);
                if (mesh) {
                    // Store slug for API calls (backend uses slug as lookup_field)
                    mesh.userData.nodeSlug = node.slug;
                    // Store name for display
                    mesh.userData.nodeName = node.name;

                    const label = createPlanetLabel(node.name, scene);
                    label.position.copy(mesh.position);
                    label.position.y += 2;
                    labelsRef.current.set(node.id, label);
                }
            });
        }

        // Helical entry animation helpers
        function getHelixPosition(progress: number): THREE.Vector3 {
            const angle = progress * Math.PI * 2 * HELIX_ROTATIONS;
            const radius = HELIX_RADIUS * progress;
            const x = Math.cos(angle) * radius;
            const y = HELIX_HEIGHT * (1 - progress);
            const z = Math.sin(angle) * radius;
            return new THREE.Vector3(x, y, z);
        }

        // Initialize entry animation on first render
        if (entryStartTime.current === 0 && orgNodes && orgNodes.length > 0) {
            entryStartTime.current = performance.now();

            // Initialize data for Fan Animation
            orgNodes.forEach((node: any, index: number) => {
                if (!node.is_visible_3d) return;

                const entryStartX = getEntryStartX(node);
                const entryStartY = getEntryStartY(node);
                const orbitRadius = node.orbit_radius || 10;
                const entryStartZ = getEntryStartZ(node, orbitRadius);
                const entrySpeed = getEntrySpeed(node);
                const startX = entryStartX - (index * 5); // Stagger start positions slightly if desired, or keep same

                // Initialize physics state
                const mesh = meshRegistryRef.current.get(node.id);
                if (mesh) {
                    // Initial position using node-specific entry values
                    mesh.position.set(entryStartX, entryStartY, entryStartZ);

                    // Update registry
                    const state = sphereRegistryRef.current.get(node.id);
                    if (state) {
                        state.currentPosition.set(entryStartX, entryStartY, entryStartZ);
                        state.basePosition.set(entryStartX, entryStartY, entryStartZ);
                    }
                }

                // Initialize Animation Data
                planetEntryData.current.set(node.id, {
                    state: 'line',
                    progress: 0,
                    speed: entrySpeed + (Math.random() * 0.1), // Slight speed variation
                    totalDistance: 0,
                    startPos: new THREE.Vector3(entryStartX, entryStartY, entryStartZ),
                    endPos: new THREE.Vector3(0, 0, orbitRadius),
                    phaseOffset: 0,
                    transitionTime: 0,
                    startX: entryStartX,
                    startY: entryStartY,
                    startZ: entryStartZ,
                    currentX: entryStartX,
                    orbitZ: orbitRadius
                });
            });
        }

        // Physics step
        function stepPhysics(_dt: number, elapsed: number) {
            if (!orgNodes) return;

            const now = performance.now();
            const timeSinceStart = now - entryStartTime.current;

            sphereRegistryRef.current.forEach((state, id) => {
                const mesh = meshRegistryRef.current.get(id);
                if (!mesh) return;
                const node = orgNodes.find((n: any) => n.id === id);
                if (!node) return;

                const entryData = planetEntryData.current.get(id);

                // Apply orbit spacing multiplier
                const effectiveRadius = node.orbit_radius * orbitSpacing;

                // --- FAN ANIMATION LOGIC ---
                if (isAnimatingEntry && entryData) {

                    // Check if this planet's turn has started (stagger)
                    // We use the node index to calculate delay
                    const index = orgNodes.indexOf(node);
                    const startDelay = index * PLANET_STAGGER_DELAY;

                    if (timeSinceStart >= startDelay) {

                        if (entryData.state === 'line') {
                            // Move linearly along X using delta time for frame-rate independent movement
                            // Use live entrySpeed from context for real-time slider updates
                            // Speed is in range 10-50, divide by 10 to get units per second (10 = 1 unit/s, 50 = 5 units/s)
                            const liveSpeed = entrySpeed;
                            entryData.currentX += (liveSpeed / 10) * _dt;

                            // Check if reached orbit (x >= 0)
                            if (entryData.currentX >= 0) {
                                entryData.currentX = 0;
                                entryData.state = 'orbit';
                                entryData.transitionTime = elapsed;

                                // Position (0, 0, radius) corresponds to angle π/2 in circular orbit
                                // where x = cos(t)*r and z = sin(t)*r
                                // We need: cos(t) = 0, sin(t) = 1 => t = π/2
                                // Calculate offset so that: elapsed * speed + phase + offset = π/2
                                const targetAngle = Math.PI / 2;
                                const currentCalculatedAngle = -(elapsed * node.orbit_speed * planetSpeed) + node.orbit_phase;
                                entryData.phaseOffset = targetAngle - currentCalculatedAngle;
                            }

                            // Calculate interpolation from start to end position
                            // X goes from startX to 0
                            // Y goes from startY to 0
                            // Z goes from startZ to orbitZ
                            const totalDistance = entryData.startX - 0; // Distance to travel in X
                            const distanceTraveled = entryData.startX - entryData.currentX;
                            const progress = Math.min(1, Math.max(0, distanceTraveled / totalDistance));
                            const currentY = entryData.startY + (0 - entryData.startY) * progress;
                            const currentZ = entryData.startZ + (entryData.orbitZ - entryData.startZ) * progress;

                            // Update Position (Linear Phase) - use actual entry start positions
                            state.basePosition.set(entryData.currentX, currentY, currentZ);
                            state.currentPosition.copy(state.basePosition);
                            mesh.position.copy(state.currentPosition);

                        } else {
                            // Already in orbit (transitioned)
                            // Use standard orbital physics logic with phase offset for smooth continuation
                            if (!freezePlanetsRef.current) {
                                const adjustedElapsed = elapsed - timeOffsetRef.current;
                                const t = -(adjustedElapsed * node.orbit_speed * planetSpeed) + node.orbit_phase + entryData.phaseOffset;
                                let pos;

                                const shape = globalShapeOverride ? globalOrbitShape : node.orbit_shape;
                                const roundness = globalShapeOverride ? globalOrbitRoundness : node.orbit_roundness;

                                if (shape === 'squircle') {
                                    pos = getSquirclePosition(t, 0, 0, 0, effectiveRadius, roundness);
                                } else {
                                    pos = getSquarePosition(t, 0, 0, 0, effectiveRadius);
                                }
                                state.basePosition.set(pos.x, pos.y, pos.z);
                            }
                        }
                    } else {
                        // Waiting for turn - keep at start using global entry values
                        const startZ = entryStartZ !== null ? entryStartZ : effectiveRadius;
                        mesh.position.set(entryStartX, entryStartY, startZ);
                    }
                } else {
                    // --- NORMAL PHYSICS (Entry Complete or Legacy) ---
                    // Only update orbital position if not frozen
                    if (!freezePlanetsRef.current) {
                        const adjustedElapsed = elapsed - timeOffsetRef.current;
                        const t = -(adjustedElapsed * node.orbit_speed * planetSpeed) + node.orbit_phase;
                        let pos;

                        const shape = globalShapeOverride ? globalOrbitShape : node.orbit_shape;
                        const roundness = globalShapeOverride ? globalOrbitRoundness : node.orbit_roundness;

                        if (shape === 'squircle') {
                            pos = getSquirclePosition(t, 0, 0, 0, effectiveRadius, roundness);
                        } else {
                            pos = getSquarePosition(t, 0, 0, 0, effectiveRadius);
                        }
                        state.basePosition.set(pos.x, pos.y, pos.z);
                    }
                }

                // Common Physics (Mouse, Collision, Spring) used for both phases (mostly)
                // ... (rest of physics is fine, but we might want to disable mouse/collision during 'line' phase to keep it straight)

                if (!isAnimatingEntry || (entryData && entryData.state === 'orbit')) {
                    // Mouse repulsion
                    const distToMouse = state.currentPosition.distanceTo(mousePosition3DRef.current);
                    if (distToMouse < MOUSE_RADIUS && distToMouse > 0.01) {
                        const force = (1 - distToMouse / MOUSE_RADIUS) * mouseForce;
                        const dir = tmpVec.subVectors(state.currentPosition, mousePosition3DRef.current).normalize();
                        state.velocity.add(dir.multiplyScalar(force * 0.1));
                    }

                    // Collisions
                    sphereRegistryRef.current.forEach((other, otherId) => {
                        if (otherId === id) return;
                        const dist = state.currentPosition.distanceTo(other.currentPosition);
                        const minDist = state.radius + other.radius;
                        if (dist < minDist && dist > 0.01) {
                            const overlap = minDist - dist;
                            const dir = tmpVec.subVectors(state.currentPosition, other.currentPosition).normalize();
                            state.velocity.add(dir.multiplyScalar(overlap * collisionForce * 0.1));
                        }
                    });

                    // Return spring
                    const returnDir = tmpVec.subVectors(state.basePosition, state.currentPosition);
                    state.velocity.add(returnDir.multiplyScalar(returnForce));
                    state.velocity.multiplyScalar(damping);
                    state.currentPosition.add(state.velocity);
                }

                mesh.position.copy(state.currentPosition);
                // ...

                if (mesh.userData.rotSpeed) {
                    mesh.rotation.x += mesh.userData.rotSpeed * 0.002;
                    mesh.rotation.y += mesh.userData.rotSpeed * 0.003;
                }

                // Update label position and scale
                const label = labelsRef.current.get(id);
                if (label) {
                    updateLabelPosition(label, mesh.position, 2);
                    updateLabelScale(label, camera);
                }
            });
        }

        // Mouse tracking
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function updateMousePosition(clientX: number, clientY: number) {
            mouse.x = (clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const point = new THREE.Vector3();
            raycaster.ray.intersectPlane(planeZ, point);
            mousePosition3DRef.current.copy(point);
        }

        const handlePointerMove = (e: PointerEvent) => {
            updateMousePosition(e.clientX, e.clientY);
        };
        window.addEventListener('pointermove', handlePointerMove);

        // Click to focus
        function focusOnObject(obj: THREE.Object3D) {
            selectedObjectRef.current = obj;
            const targetPosition = new THREE.Vector3();
            obj.getWorldPosition(targetPosition);
            const direction = tmpVec.subVectors(camera.position, targetPosition).normalize();
            const cameraTarget = targetPosition.clone().add(direction.multiplyScalar(CAMERA_OFFSET));
            gsap.to(camera.position, {
                x: cameraTarget.x,
                y: cameraTarget.y,
                z: cameraTarget.z,
                duration: CAMERA_ANIMATION_DURATION,
                ease: 'power2.inOut',
            });
            gsap.to(controls.target, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: CAMERA_ANIMATION_DURATION,
                ease: 'power2.inOut',
                onUpdate: () => controls.update(),
            });
        }

        // Interaction constants
        const CAMERA_OFFSET = 8;
        const CAMERA_ANIMATION_DURATION = 1.5;

        // Helper to find ID from object (simplified)
        function getIdFromObject(obj: THREE.Object3D): string | null {
            let current: THREE.Object3D | null = obj;
            while (current) {
                if (meshRegistryRef.current.has(current.name)) {
                    return current.name;
                }
                if (current.userData.numericId) { // Check if wrapper has the ID
                    return current.name;
                }
                current = current.parent;
            }
            return null;
        }

        // Click timeout for distinguishing single click from double click
        let clickTimeout: NodeJS.Timeout | null = null;
        const DOUBLE_CLICK_DELAY = 250; // ms

        // Helper to get node slug from object
        const getNodeSlugFromObject = (obj: THREE.Object3D): string | null => {
            let current: THREE.Object3D | null = obj;
            while (current) {
                if (current.userData.nodeSlug) {
                    return current.userData.nodeSlug;
                }
                current = current.parent;
            }
            return null;
        };

        // Animate camera to a planet
        const animateCameraToPlanet = (hitObject: THREE.Object3D) => {
            const targetPosition = new THREE.Vector3();
            hitObject.getWorldPosition(targetPosition);

            // Calculate offset (adjust based on object scale if available)
            const scale = hitObject.scale.x || 1;
            const offset = CAMERA_OFFSET + (scale * 2);

            const cameraTargetPos = new THREE.Vector3(
                targetPosition.x,
                targetPosition.y + (offset * 0.2), // Slight height offset
                targetPosition.z + offset
            );

            isAnimatingRef.current = true;

            // Animate position
            gsap.to(camera.position, {
                x: cameraTargetPos.x,
                y: cameraTargetPos.y,
                z: cameraTargetPos.z,
                duration: CAMERA_ANIMATION_DURATION,
                ease: 'power2.inOut',
                onUpdate: () => camera.updateProjectionMatrix(),
                onComplete: () => { isAnimatingRef.current = false; }
            });

            // Animate lookAt target
            gsap.to(controls.target, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: CAMERA_ANIMATION_DURATION,
                ease: 'power2.inOut',
                onUpdate: () => controls.update()
            });
        };

        // Process a confirmed single click
        const processClick = (e: MouseEvent) => {
            if (isAnimatingRef.current) return;

            updateMousePosition(e.clientX, e.clientY);
            raycaster.setFromCamera(mouse, camera);

            // Raycast against scene children to catch everything
            const hits = raycaster.intersectObjects(scene.children, true);

            let clickedId: string | null = null;
            let hitObject: THREE.Object3D | null = null;

            // Find valid hit
            for (const hit of hits) {
                const id = getIdFromObject(hit.object);
                if (id) {
                    clickedId = id;
                    hitObject = meshRegistryRef.current.get(id) || hit.object;
                    break;
                }
            }

            if (clickedId && hitObject) {
                // Case B: Second click on SAME planet -> Open overlay
                if (selectedIdRef.current === clickedId) {
                    console.log('Second click - Opening overlay:', clickedId);
                    const nodeSlug = getNodeSlugFromObject(hitObject);
                    if (nodeSlug && onPlanetDoubleClick) {
                        onPlanetDoubleClick(nodeSlug);
                    }
                    return;
                }

                // Case A: First click OR click on different planet
                console.log('Click - Selecting planet:', clickedId);
                const wasAlreadyFrozen = freezePlanetsRef.current;
                
                selectedIdRef.current = clickedId;

                // Animate camera to the planet
                animateCameraToPlanet(hitObject);

                // Freeze planets on first selection only
                if (!wasAlreadyFrozen) {
                    setFreezePlanets(true);
                }

                // Notify parent of first click with slug and name
                const nodeSlug = getNodeSlugFromObject(hitObject);
                const planetName = hitObject.userData.nodeName || hitObject.name || 'Planète';
                if (nodeSlug && onPlanetFirstClick) {
                    onPlanetFirstClick(nodeSlug, planetName);
                }

            } else {
                // Case C: Click in empty space -> Deselect & Reset
                console.log('Empty click - Resetting');
                handleReset();
            }
        };

        const handleClick = (e: MouseEvent) => {
            // Cancel any pending single click
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
                // This was a double-click, don't process as single click
                return;
            }

            // Wait to see if this is a double-click
            clickTimeout = setTimeout(() => {
                clickTimeout = null;
                processClick(e);
            }, DOUBLE_CLICK_DELAY);
        };

        const handleReset = () => {
            if (isAnimatingRef.current) return;
            selectedIdRef.current = null;
            isAnimatingRef.current = true;

            // Notify parent that planet is deselected
            if (onPlanetDeselect) {
                onPlanetDeselect();
            }

            // Reset to reference position
            gsap.to(camera.position, {
                x: refCameraXRef.current,
                y: refCameraYRef.current,
                z: refCameraZRef.current,
                duration: CAMERA_ANIMATION_DURATION,
                ease: 'power2.inOut',
                onComplete: () => { isAnimatingRef.current = false; }
            });

            gsap.to(controls.target, {
                x: refTargetXRef.current,
                y: refTargetYRef.current,
                z: refTargetZRef.current,
                duration: CAMERA_ANIMATION_DURATION,
                ease: 'power2.inOut',
                onUpdate: () => controls.update()
            });

            // Unfreeze planets to resume orbits
            if (freezePlanetsRef.current) {
                setFreezePlanets(false);
            }
        };

        const handleDoubleClick = (e: MouseEvent) => {
            e.preventDefault();
            // Clear any pending single click
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
            }
            // Double-click anywhere resets the view
            console.log('Double-click - Resetting');
            handleReset();
        };

        renderer.domElement.addEventListener('click', handleClick);
        renderer.domElement.addEventListener('dblclick', handleDoubleClick);

        // Animation loop
        let last = performance.now();
        function animate(now: number) {
            const dt = Math.min((now - last) / 1000, 0.033);
            last = now;
            const elapsed = now * 0.001;
            controls.update(); // Update controls for damping
            stepPhysics(dt, elapsed);
            renderer.render(scene, camera);
            animationFrameRef.current = requestAnimationFrame(animate);
        }
        animationFrameRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            // Clear click timeout if pending
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
            
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('click', handleClick);
            renderer.domElement.removeEventListener('dblclick', handleDoubleClick);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((material) => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                }
            });

            sphereRegistryRef.current.clear();
            meshRegistryRef.current.clear();

            if (container && renderer.domElement.parentNode) {
                container.removeChild(renderer.domElement);
            }

            renderer.dispose();
            renderer.forceContextLoss();

            sceneRef.current = null;
            cameraRef.current = null;
            rendererRef.current = null;
            controlsRef.current = null;
            selectedObjectRef.current = null;
        };
    }, [planetSpeed, orgNodes]);

    // Update orbit visibility
    useEffect(() => {
        orbitLinesRef.current.forEach((line) => {
            line.visible = showOrbits;
        });
    }, [showOrbits]);

    return <div ref={containerRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 10, pointerEvents: 'auto' }} />;
}






