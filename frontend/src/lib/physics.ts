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
        shape?: 'circle' | 'squircle';
        roundness?: number;
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
    // Legacy implementation - preserved if needed, but we prefer circular now
    // For now, we'll redirect this to circular to force consistency if called
    return getCircularPosition(t, centerX, centerY, centerZ, radius);
}

// Calculate position on circular orbit
export function getCircularPosition(
    t: number,
    centerX: number,
    centerY: number,
    centerZ: number,
    radius: number
): { x: number; y: number; z: number } {
    return {
        x: centerX + Math.cos(t) * radius,
        y: centerY,
        z: centerZ + Math.sin(t) * radius
    };
}

// Calculate position on a Squircle (Rounded Square) orbit
// roundness: 0 = square, 1 = circle
export function getSquirclePosition(
    t: number,
    centerX: number,
    centerY: number,
    centerZ: number,
    radius: number,
    roundness: number = 0.6
): { x: number; y: number; z: number } {
    // Clamp roundness
    const k = Math.max(0, Math.min(1, roundness));

    // Corner radius
    const r_c = radius * k;
    // Inner square extent (distance from center to corner arc center)
    const d = radius * (1 - k);

    // Working in 2D (x, z) relative to center, assuming y is up/down and constant
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);

    // Map to 1st quadrant for calculation
    const absCos = Math.abs(cosT);
    const absSin = Math.abs(sinT);

    let x_local = 0;
    let z_local = 0;

    // Determine intersection logic
    // We cast a ray from (0,0) with direction (absCos, absSin)
    // Does it hit the vertical edge x=radius?
    // Ray: P = alpha * (absCos, absSin)
    // Edge x = radius. alpha = radius / absCos.
    // Check y coord: y = alpha * absSin = radius * tan(t)
    // If y <= d, we hit the flat edge.

    // Avoid division by zero
    const isVertical = absCos < 1e-9;

    if (!isVertical && (radius * absSin / absCos) <= d) {
        // Hit right edge (flat part)
        x_local = radius;
        z_local = radius * absSin / absCos;
    }
    else if (absSin > 1e-9 && (radius * absCos / absSin) <= d) {
        // Hit top edge (flat part) - analogous to above but checking y=radius
        z_local = radius;
        x_local = radius * absCos / absSin;
    }
    else {
        // Hit the corner arc
        // Ray intersect circle centered at (d, d) with radius r_c
        // Ray: P = alpha * D (where D is normalized direction vector)
        // Here D is (absCos, absSin) since sine/cosine are normalized.
        // Equation: |alpha*D - C|^2 = r_c^2
        // (alpha*dx - d)^2 + (alpha*dy - d)^2 = r_c^2
        // alpha^2(dx^2 + dy^2) - 2*alpha(d*dx + d*dy) + 2*d^2 - r_c^2 = 0
        // Since dx^2+dy^2 = 1:
        // alpha^2 - 2*d*(dx+dy)*alpha + (2*d^2 - r_c^2) = 0

        const B = -2 * d * (absCos + absSin);
        const C = 2 * d * d - r_c * r_c;

        // Quadratic formula for alpha: (-B +/- sqrt(B^2 - 4AC)) / 2A
        // A = 1.
        const delta = B * B - 4 * C;
        if (delta >= 0) {
            // We want the smallest positive root? 
            // The corner is convex, we hit it from inside.
            // B is negative. -B is positive. 
            // alpha = (-B + sqrt)/2
            const alpha = (-B + Math.sqrt(delta)) / 2;
            x_local = alpha * absCos;
            z_local = alpha * absSin;
        } else {
            // Fallback (should not happen geometrically)
            x_local = radius * absCos;
            z_local = radius * absSin;
        }
    }

    // Restore signs
    return {
        x: centerX + Math.sign(cosT) * x_local,
        y: centerY,
        z: centerZ + Math.sign(sinT) * z_local
    };
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
