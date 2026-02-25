// API-Service – wird in Phase 2 mit echten Endpoints verbunden
// Aktuell arbeitet die App vollständig offline via IndexedDB

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

export const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
};

export const fetchInventoryItems = () => apiFetch('/inventory');
export const fetchActivities = () => apiFetch('/activities');
export const fetchBudget = () => apiFetch('/budget');
export const fetchLogbookEntries = () => apiFetch('/logbook');