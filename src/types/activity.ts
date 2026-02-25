export type ActivityType = 'sightseeing' | 'food' | 'transport' | 'sport' | 'culture' | 'shopping' | 'other';

export interface Activity {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    duration?: number; // in minutes
    completed: boolean;
    type?: ActivityType;
    time?: string; // HH:mm
    notes?: string;
}