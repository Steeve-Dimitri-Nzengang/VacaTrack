import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'VacaTrackDB';
const DB_VERSION = 1;

export const STORES = {
    INVENTORY: 'inventory',
    ACTIVITIES: 'activities',
    BUDGET: 'budget',
    LOGBOOK: 'logbook',
    TRIPS: 'trips',
} as const;

let dbPromise: Promise<IDBPDatabase> | null = null;

export const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                Object.values(STORES).forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' });
                    }
                });
            },
        });
    }
    return dbPromise;
};

export const addItem = async <T extends { id: string }>(storeName: string, item: T): Promise<void> => {
    const db = await getDB();
    await db.put(storeName, item);
};

export const getItems = async <T>(storeName: string): Promise<T[]> => {
    const db = await getDB();
    return await db.getAll(storeName) as T[];
};

export const deleteItem = async (storeName: string, id: string): Promise<void> => {
    const db = await getDB();
    await db.delete(storeName, id);
};

export const clearStore = async (storeName: string): Promise<void> => {
    const db = await getDB();
    await db.clear(storeName);
};