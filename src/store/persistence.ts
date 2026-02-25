/**
 * VacaTrack IndexedDB Persistence Layer
 *
 * Speichert Redux-State in IndexedDB und lädt ihn beim App-Start.
 * Nutzt einen debounced Subscriber, damit nicht bei jeder Action geschrieben wird.
 */
import { openDB, IDBPDatabase } from 'idb';
import type { RootState } from './index';

const DB_NAME = 'VacaTrackState';
const DB_VERSION = 1;
const STORE_NAME = 'appState';

/* ─── Datenbank öffnen ─── */
let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = (): Promise<IDBPDatabase> => {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });
    }
    return dbPromise;
};

/* ─── State-Slices die persistiert werden ─── */
type PersistedState = Pick<RootState, 'inventory' | 'activities' | 'budget' | 'logbook' | 'trip'>;

const STATE_KEYS: (keyof PersistedState)[] = [
    'inventory',
    'activities',
    'budget',
    'logbook',
    'trip',
];

/* ─── State speichern ─── */
export const saveState = async (state: RootState): Promise<void> => {
    try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        for (const key of STATE_KEYS) {
            await store.put(state[key], key);
        }

        await tx.done;
    } catch (err) {
        console.warn('[VacaTrack] State konnte nicht gespeichert werden:', err);
    }
};

/* ─── State laden ─── */
export const loadState = async (): Promise<Partial<PersistedState> | undefined> => {
    try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);

        const result: Partial<PersistedState> = {};
        let hasData = false;

        for (const key of STATE_KEYS) {
            const data = await store.get(key);
            if (data !== undefined) {
                (result as Record<string, unknown>)[key] = data;
                hasData = true;
            }
        }

        await tx.done;
        return hasData ? result : undefined;
    } catch (err) {
        console.warn('[VacaTrack] State konnte nicht geladen werden:', err);
        return undefined;
    }
};

/* ─── Debounced Save Subscriber ─── */
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export const createPersistenceSubscriber = (getState: () => RootState) => {
    return () => {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            saveState(getState());
        }, 500); // 500ms debounce
    };
};
