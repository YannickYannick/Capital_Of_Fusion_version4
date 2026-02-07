import * as THREE from 'three';

// Base scale for labels (used for distance-based scaling)
const BASE_LABEL_SCALE = { width: 2, height: 0.5 };
// Reference distance at which the label has its base size
const REFERENCE_DISTANCE = 15;

/**
 * Create a 3D label sprite that always faces the camera
 * @param name - Text to display on the label
 * @param scene - Three.js scene to add the sprite to
 * @returns THREE.Sprite object
 */
export function createPlanetLabel(name: string, scene: THREE.Scene): THREE.Sprite {
    // Create canvas for text rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    // Set canvas size
    canvas.width = 512;
    canvas.height = 128;

    // Draw background with rounded corners
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.beginPath();
    context.roundRect(0, 0, canvas.width, canvas.height, 20);
    context.fill();

    // Draw border
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(0, 0, canvas.width, canvas.height, 20);
    context.stroke();

    // Draw text
    context.font = 'Bold 48px Inter, Arial, sans-serif';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create sprite material
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
    });

    // Create sprite
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(BASE_LABEL_SCALE.width, BASE_LABEL_SCALE.height, 1);

    scene.add(sprite);
    return sprite;
}

/**
 * Update label position to stay above the planet
 * @param label - Sprite to update
 * @param planetPosition - Current position of the planet
 * @param offset - Vertical offset above the planet (default: 2)
 */
export function updateLabelPosition(
    label: THREE.Sprite,
    planetPosition: THREE.Vector3,
    offset: number = 2
): void {
    label.position.copy(planetPosition);
    label.position.y += offset;
}

/**
 * Update label scale to maintain constant screen size regardless of distance
 * @param label - Sprite to update
 * @param camera - Three.js camera
 */
export function updateLabelScale(
    label: THREE.Sprite,
    camera: THREE.Camera
): void {
    // Calculate distance from camera to label
    const distance = camera.position.distanceTo(label.position);
    
    // Scale factor to maintain constant screen size
    // The further away, the larger the scale needs to be
    const scaleFactor = distance / REFERENCE_DISTANCE;
    
    // Apply scale while maintaining aspect ratio
    label.scale.set(
        BASE_LABEL_SCALE.width * scaleFactor,
        BASE_LABEL_SCALE.height * scaleFactor,
        1
    );
}

/**
 * Remove a label from the scene and dispose of its resources
 * @param label - Sprite to remove
 * @param scene - Three.js scene
 */
export function removeLabel(label: THREE.Sprite, scene: THREE.Scene): void {
    if (label.material.map) {
        label.material.map.dispose();
    }
    label.material.dispose();
    scene.remove(label);
}
