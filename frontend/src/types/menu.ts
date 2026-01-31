/**
 * Type definitions for navigation menu items
 */

export interface MenuItem {
    id: string;
    name: string;
    slug: string;
    url: string;
    icon: string;
    order: number;
    is_active: boolean;
    children: MenuItem[];
}

export interface MenuApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: MenuItem[];
}
