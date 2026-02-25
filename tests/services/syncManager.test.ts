import { syncData, fetchData } from '../../src/services/syncManager';
import { jest } from '@jest/globals';

describe('syncManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should sync data successfully', async () => {
        const mockData = { items: ['item1', 'item2'] };
        const syncResponse = await syncData(mockData);
        
        expect(syncResponse).toEqual({ success: true });
        expect(fetchData).toHaveBeenCalledWith(mockData);
    });

    test('should handle sync errors', async () => {
        const mockData = { items: ['item1', 'item2'] };
        jest.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.reject(new Error('Sync failed')));
        
        await expect(syncData(mockData)).rejects.toThrow('Sync failed');
    });
});