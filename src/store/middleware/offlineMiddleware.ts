import { Middleware } from '@reduxjs/toolkit';
import { addPendingAction } from '../../services/syncManager';

// Middleware: Wenn offline, queue die Action für späteren Sync
const offlineMiddleware: Middleware = (_store) => (next) => (action) => {
    // Nur API-bezogene Actions abfangen (erkennbar an /pending Suffix)
    if (typeof action === 'object' && action !== null && 'type' in action) {
        const typedAction = action as { type: string; payload?: unknown };
        if (typedAction.type.endsWith('/pending') && !navigator.onLine) {
            addPendingAction({
                id: Date.now().toString(),
                type: typedAction.type,
                payload: typedAction.payload,
            });
            return;
        }
    }
    return next(action);
};

export default offlineMiddleware;