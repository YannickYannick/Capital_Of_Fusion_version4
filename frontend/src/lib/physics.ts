import * as THREE from 'three';

// Physics constants
export const MOUSE_FORCE = 0.5;
export const MOUSE_RADIUS = 3;
export const COLLISION_FORCE = 0.3;
export const DAMPING = 0.92;
export const RETURN_FORCE = 0.08;
export const CAMERA_OFFSET = 8;
export const CAMERA_ANIMATION_DURATION = 1.2;

// Sphere configuration type
export interface SphereConfig {
    id: string;
    type: 'wire' | 'dotted' | 'glass' | 'chrome' | 'network' | 'star';
    orbit: {
        centerX: number;
        centerY: number;
        centerZ: number;
        radius: number;
        speed: number;
        phase: number;
    };
    scale: number;
    color?: string;
    rot?: number;
}

// Calculate position on rectangular orbit
export function getSquarePosition(
    t: number,
    centerX: number,
    centerY: number,
    centerZ: number,
    radius: number
): { x: number; y: number; z: number } {
    const width = radius * 1.5;
    const height = radius * 1;
    const perimeter = 2 * (width + height);
    const dist = ((t % perimeter) + perimeter) % perimeter;

    if (dist < width) {
        // Bottom edge (left to right)
        return { x: centerX - width + dist, y: centerY - height, z: centerZ };
    } else if (dist < width + height) {
        // Right edge (bottom to top)
        return { x: centerX + width, y: centerY - height + (dist - width), z: centerZ };
    } else if (dist < 2 * width + height) {
        // Top edge (right to left)
        return { x: centerX + width - (dist - width - height), y: centerY + height, z: centerZ };
    } else {
        // Left edge (top to bottom)
        return { x: centerX - width, y: centerY + height - (dist - 2 * width - height), z: centerZ };
    }
}

// Predefined orbits configuration
export const ORBITS: SphereConfig[] = [
    {
        id: 'sphere1',
        type: 'glass',
        orbit: { centerX: 0, centerY: 0, centerZ: 0, radius: 3, speed: 0.3, phase: 0 },
        scale: 0.8,
        color: '#7c3aed',
    },
    {
        id: 'sphere2',
        type: 'chrome',
        orbit: { centerX: 0, centerY: 0, centerZ: 0, radius: 5, speed: 0.25, phase: Math.PI },
        scale: 0.6,
    },
    {
        id: 'sphere3',
        type: 'wire',
        orbit: { centerX: 0, centerY: 0, centerZ: 0, radius: 7, speed: 0.2, phase: Math.PI / 2 },
        scale: 0.9,
        rot: 0.8,
    },
    {
        id: 'sphere4',
        type: 'dotted',
        orbit: { centerX: 0, centerY: 0, centerZ: 0, radius: 9, speed: 0.15, phase: Math.PI * 1.5 },
        scale: 0.7,
        rot: 1.2,
    },
    {
        id: 'sphere5',
        type: 'network',
        orbit: { centerX: 0, centerY: 0, centerZ: 0, radius: 11, speed: 0.12, phase: Math.PI / 4 },
        scale: 1.0,
        rot: 0.6,
    },
    {
        id: 'sphere6',
        type: 'star',
        orbit: { centerX: 0, centerY: 0, centerZ: 0, radius: 13, speed: 0.1, phase: Math.PI * 1.25 },
        scale: 0.85,
    },
];
