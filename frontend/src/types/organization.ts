/**
 * Type definitions for Organization nodes and events
 */

export interface NodeEvent {
    id: string;
    title: string;
    description: string;
    start_datetime: string;
    end_datetime: string | null;
    location: string;
    image: string | null;
    is_featured: boolean;
    external_url: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizationNode {
    id: string;
    name: string;
    slug: string;
    type: 'ROOT' | 'BRANCH' | 'EVENT';
    video_url: string;
    description: string;
    parent: string | null;
    children: OrganizationNode[];
    
    // Overlay content
    cover_image: string | null;
    short_description: string;
    content: string;
    cta_text: string;
    cta_url: string;
    
    // Events
    events: NodeEvent[];
    
    // 3D Configuration
    visual_source: 'preset' | 'glb' | 'gif';
    planet_type: 'wire' | 'dotted' | 'glass' | 'chrome' | 'network' | 'star';
    model_3d: string | null;
    planet_texture: string | null;
    planet_color: string;
    orbit_radius: number;
    orbit_speed: number;
    planet_scale: number;
    rotation_speed: number;
    orbit_phase: number;
    orbit_shape: 'circle' | 'squircle';
    orbit_roundness: number;
    
    // Entry Animation
    entry_start_x: number;
    entry_start_y: number;
    entry_start_z: number | null;
    entry_speed: number;
    
    is_visible_3d: boolean;
    created_at: string;
    updated_at: string;
}

export interface OrganizationNodesApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: OrganizationNode[];
}
