import { useEffect } from 'react';
import { useOffline } from './useOffline';

const useSync = () => {
    const { isOffline } = useOffline();

    useEffect(() => {
        if (!isOffline) {
            const sync = async () => {
                try {
                    // Sync-Logik hier – wird in Phase 2 implementiert
                    console.log('Syncing data...');
                } catch (error) {
                    console.error('Sync failed:', error);
                }
            };

            const intervalId = setInterval(sync, 60000);
            return () => clearInterval(intervalId);
        }
    }, [isOffline]);

    return { isOffline };
};

export default useSync;