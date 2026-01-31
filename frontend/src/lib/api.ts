import axios from 'axios';
import { MenuItem, MenuApiResponse } from '@/types/menu';

const api = axios.create({
    baseURL: 'http://localhost:8001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetch all menu items from the API
 * Returns root menu items with their children nested
 */
export async function fetchMenuItems(): Promise<MenuItem[]> {
    try {
        const response = await api.get<MenuApiResponse>('/menu/items/');
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch menu items:', error);
        return [];
    }
}

export default api;
