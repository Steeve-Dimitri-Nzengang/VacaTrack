export interface Trip {
    id: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: number;
    currency: string;
    notes?: string;
}

export interface Settings {
    currency: string;
    language: string;
    theme: 'light' | 'dark';
}

export interface TripState {
    trips: Trip[];
    selectedTripId: string | null;
    settings: Settings;
}