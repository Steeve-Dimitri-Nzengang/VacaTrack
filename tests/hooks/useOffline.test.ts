import { renderHook, act } from '@testing-library/react-hooks';
import useOffline from '../../src/hooks/useOffline';

describe('useOffline', () => {
  beforeEach(() => {
    // Reset the online status before each test
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });
  });

  it('should return online status as true when online', () => {
    const { result } = renderHook(() => useOffline());
    expect(result.current.isOffline).toBe(false);
  });

  it('should return online status as false when offline', () => {
    act(() => {
      Object.defineProperty(window.navigator, 'onLine', {
        configurable: true,
        value: false,
      });
      window.dispatchEvent(new Event('online'));
      window.dispatchEvent(new Event('offline'));
    });

    const { result } = renderHook(() => useOffline());
    expect(result.current.isOffline).toBe(true);
  });

  it('should toggle offline status correctly', () => {
    const { result } = renderHook(() => useOffline());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOffline).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.isOffline).toBe(false);
  });
});