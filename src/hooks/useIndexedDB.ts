import { useEffect, useState, useCallback } from 'react';

const useIndexedDB = <T extends { id?: unknown }>(dbName: string, storeName: string) => {
    const [db, setDb] = useState<IDBDatabase | null>(null);

    useEffect(() => {
        const request = indexedDB.open(dbName);

        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains(storeName)) {
                database.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => {
            setDb(request.result);
        };

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
        };

        return () => {
            if (db) {
                db.close();
            }
        };
    }, [dbName, storeName]);

    const addItem = useCallback((item: T): Promise<IDBValidKey> => {
        return new Promise((resolve, reject) => {
            if (!db) return reject('Database not initialized');

            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(item);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }, [db, storeName]);

    const getItems = useCallback((): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            if (!db) return reject('Database not initialized');

            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as T[]);
            request.onerror = () => reject(request.error);
        });
    }, [db, storeName]);

    const deleteItem = useCallback((id: IDBValidKey): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!db) return reject('Database not initialized');

            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }, [db, storeName]);

    return { addItem, getItems, deleteItem, isReady: !!db };
};

export default useIndexedDB;