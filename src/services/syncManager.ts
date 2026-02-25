// SyncManager – wird in Phase 3 vollständig implementiert
// Aktuell ein Stub für die Offline-Sync-Queue

import { saveData, getData } from './offlineStorage';

interface PendingAction {
    id: string;
    type: string;
    payload: unknown;
    timestamp: number;
}

const PENDING_KEY = 'pendingActions';

export const addPendingAction = async (action: Omit<PendingAction, 'timestamp'>): Promise<void> => {
    const pending = await getPendingActions();
    pending.push({ ...action, timestamp: Date.now() });
    await saveData(PENDING_KEY, pending);
};

export const getPendingActions = async (): Promise<PendingAction[]> => {
    const data = await getData<PendingAction[]>(PENDING_KEY);
    return data || [];
};

export const clearPendingActions = async (): Promise<void> => {
    await saveData(PENDING_KEY, []);
};

export const syncData = async (): Promise<void> => {
    const pending = await getPendingActions();
    if (pending.length === 0) return;

    // In Phase 3: Pending Actions an API senden
    console.log(`Syncing ${pending.length} pending actions...`);
    await clearPendingActions();
};