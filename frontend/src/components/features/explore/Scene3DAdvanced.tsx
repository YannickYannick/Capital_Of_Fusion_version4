"use client";

import { useEffect, useRef } from 'react';
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
    getSquarePosition,
    type SphereConfig,
} from '@/lib/physics';
import { createPlanetLabel, updateLabelPosition } from '@/lib/planetLabels';
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
}

export default function Scene3DAdvanced({ onRefsReady }: Scene3DAdvancedProps = {}) {
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

    const { showOrbits, planetSpeed, freezePlanets, setFreezePlanets, releaseFocus } = usePlanetsOptions();

    // Use Ref to avoid stale closures in animation loop
    const freezePlanetsRef = useRef(freezePlanets);
    useEffect(() => {
        freezePlanetsRef.current = freezePlanets;
    }, [freezePlanets]);

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

        const container = containerRef.current;
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
        const distance = 20;
        const angle = (20 * Math.PI) / 180;
        camera.position.set(0, Math.sin(angle) * distance, Math.cos(angle) * distance);
        camera.lookAt(0, 0, 0);
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

        // Restore camera position from localStorage
        try {
            const savedPos = localStorage.getItem('explore_camera_pos');
            const savedTarget = localStorage.getItem('explore_camera_target');

            if (savedPos) {
                const { x, y, z } = JSON.parse(savedPos);
                camera.position.set(x, y, z);
            } else {
                controls.target.set(0, 0, 0);
            }

            if (savedTarget) {
                const { x, y, z } = JSON.parse(savedTarget);
                controls.target.set(x, y, z);
            }
        } catch (e) {
            console.warn('Failed to load camera settings', e);
            controls.target.set(0, 0, 0);
        }

        controls.update();

        // Save camera position on change (throttled)
        let timeout: NodeJS.Timeout;
        controls.addEventListener('change', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                localStorage.setItem('explore_camera_pos', JSON.stringify(camera.position));
                localStorage.setItem('explore_camera_target', JSON.stringify(controls.target));
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
        function createWrapper(id: string, orbit: SphereConfig['orbit'], object: THREE.Object3D, radiusMultiplier: number = 1.1) {
            const wrapper = new THREE.Group();
            wrapper.add(object);
            wrapper.name = id; // Assign ID to the wrapper for raycasting
            wrapper.userData.type = object.userData.type; // Inherit type from the object

            // Set initial position based on orbit
            const validOrbit = orbit || { centerX: 0, centerY: 0, centerZ: 0, radius: 10, speed: 0.1, phase: 0 };
            const squarePos = getSquarePosition(validOrbit.phase || 0, validOrbit.centerX, validOrbit.centerY, validOrbit.centerZ, validOrbit.radius);
            wrapper.position.set(squarePos.x, squarePos.y, squarePos.z);

            scene.add(wrapper);
            register(id, wrapper, object.scale.x * radiusMultiplier); // Use wrapper for physics, object scale for radius
            return wrapper;
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

            // Set initial position based on orbit
            const validOrbit = orbit || { centerX: 0, centerY: 0, centerZ: 0, radius: 10, speed: 0.1, phase: 0 };
            const squarePos = getSquarePosition(validOrbit.phase || 0, validOrbit.centerX, validOrbit.centerY, validOrbit.centerZ, validOrbit.radius);
            wrapper.position.set(squarePos.x, squarePos.y, squarePos.z);

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
            const width = radius * 1.5;
            const height = radius * 1;

            const points = [
                new THREE.Vector3(centerX - width, centerY - height, centerZ),
                new THREE.Vector3(centerX - width, centerY + height, centerZ),
                new THREE.Vector3(centerX + width, centerY + height, centerZ),
                new THREE.Vector3(centerX + width, centerY - height, centerZ),
                new THREE.Vector3(centerX - width, centerY - height, centerZ),
            ];

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3,
            });
            const line = new THREE.Line(geometry, material);
            orbitLinesRef.current.push(line);
            scene.add(line);
        }

        // Create orbits and spheres from API data
        if (orgNodes && Array.isArray(orgNodes)) {
            orgNodes.forEach((node: any) => {
                if (!node.is_visible_3d) return;

                const orbitConfig = {
                    centerX: 0,
                    centerY: 0,
                    centerZ: 0,
                    radius: node.orbit_radius,
                    speed: node.orbit_speed,
                    phase: node.orbit_phase,
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
                            // Fallback if type is unknown or missing
                            makeWireframe(node.id, orbitConfig, node.planet_scale, node.rotation_speed);
                    }
                }

                // Create label for this planet
                const mesh = meshRegistryRef.current.get(node.id);
                if (mesh) {
                    const label = createPlanetLabel(node.name, scene);
                    label.position.copy(mesh.position);
                    label.position.y += 2;
                    labelsRef.current.set(node.id, label);
                }
            });
        }

        // Physics step
        function stepPhysics(_dt: number, elapsed: number) {
            if (!orgNodes) return;

            sphereRegistryRef.current.forEach((state, id) => {
                const mesh = meshRegistryRef.current.get(id);
                if (!mesh) return;
                const node = orgNodes.find((n: any) => n.id === id);
                if (!node) return;

                // Only update orbital position if not frozen
                if (!freezePlanetsRef.current) {
                    const t = elapsed * node.orbit_speed * planetSpeed + node.orbit_phase;
                    const squarePos = getSquarePosition(t, 0, 0, 0, node.orbit_radius);
                    state.basePosition.set(squarePos.x, squarePos.y, squarePos.z);
                }

                // Mouse repulsion
                const distToMouse = state.currentPosition.distanceTo(mousePosition3DRef.current);
                if (distToMouse < MOUSE_RADIUS && distToMouse > 0.01) {
                    const force = (1 - distToMouse / MOUSE_RADIUS) * MOUSE_FORCE;
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
                        state.velocity.add(dir.multiplyScalar(overlap * COLLISION_FORCE * 0.1));
                    }
                });

                // Return spring
                const returnDir = tmpVec.subVectors(state.basePosition, state.currentPosition);
                state.velocity.add(returnDir.multiplyScalar(RETURN_FORCE));
                state.velocity.multiplyScalar(DAMPING);
                state.currentPosition.add(state.velocity);

                mesh.position.copy(state.currentPosition);
                if (mesh.userData.rotSpeed) {
                    mesh.rotation.x += mesh.userData.rotSpeed * 0.002;
                    mesh.rotation.y += mesh.userData.rotSpeed * 0.003;
                }

                // Update label position
                const label = labelsRef.current.get(id);
                if (label) {
                    updateLabelPosition(label, mesh.position, 2);
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

        const handleClick = (e: MouseEvent) => {
            // Freeze planets on first click
            if (!freezePlanetsRef.current) {
                setFreezePlanets(true);
            }

            updateMousePosition(e.clientX, e.clientY);
            raycaster.setFromCamera(mouse, camera);
            const objects = Array.from(meshRegistryRef.current.values());
            const hits = raycaster.intersectObjects(objects, true);
            if (hits.length) {
                let obj = hits[0].object;
                while (obj && !meshRegistryRef.current.has(obj.name) && obj.parent) obj = obj.parent;
                if (obj) focusOnObject(obj);
            }
        };

        const handleDoubleClick = (e: MouseEvent) => {
            e.preventDefault();
            selectedObjectRef.current = null;
            const distance = 20;
            const angle = (20 * Math.PI) / 180;
            gsap.to(camera.position, {
                x: 0,
                y: Math.sin(angle) * distance,
                z: Math.cos(angle) * distance,
                duration: CAMERA_ANIMATION_DURATION,
                ease: 'power2.inOut',
                onUpdate: () => camera.lookAt(0, 0, 0)
            });
            gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: CAMERA_ANIMATION_DURATION, ease: 'power2.inOut', onUpdate: () => controls.update() });
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
