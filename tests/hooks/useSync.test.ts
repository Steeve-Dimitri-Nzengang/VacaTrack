import { renderHook, act } from '@testing-library/react-hooks';
import useSync from '../../src/hooks/useSync';
import { syncData } from '../../src/services/syncManager';

jest.mock('../../src/services/syncManager');

describe('useSync', () => {
  const mockData = { items: ['item1', 'item2'] };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSync());

    expect(result.current.isSyncing).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should call syncData when sync is triggered', async () => {
    syncData.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useSync());

    await act(async () => {
      await result.current.triggerSync();
    });

    expect(syncData).toHaveBeenCalled();
    expect(result.current.isSyncing).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle errors during sync', async () => {
    const errorMessage = 'Sync failed';
    syncData.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useSync());

    await act(async () => {
      await result.current.triggerSync();
    });

    expect(syncData).toHaveBeenCalled();
    expect(result.current.isSyncing).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
});