import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'vacaTrackDB';
const STORE_NAME = 'offlineData';

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });
    }
    return dbPromise;
};

export const saveData = async (key: string, data: unknown): Promise<void> => {
    const db = await getDB();
    await db.put(STORE_NAME, data, key);
};

export const getData = async <T>(key: string): Promise<T | undefined> => {
    const db = await getDB();
    return await db.get(STORE_NAME, key) as T | undefined;
};

export const deleteData = async (key: string): Promise<void> => {
    const db = await getDB();
    await db.delete(STORE_NAME, key);
};

export const clearOfflineStore = async (): Promise<void> => {
    const db = await getDB();
    await db.clear(STORE_NAME);
};