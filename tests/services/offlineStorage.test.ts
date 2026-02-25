import { saveData, getData, deleteData } from '../../src/services/offlineStorage';

describe('Offline Storage Service', () => {
  const testKey = 'testKey';
  const testValue = { name: 'Test Item', quantity: 1 };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should save data to offline storage', () => {
    saveData(testKey, testValue);
    const storedValue = JSON.parse(localStorage.getItem(testKey) || '{}');
    expect(storedValue).toEqual(testValue);
  });

  it('should retrieve data from offline storage', () => {
    localStorage.setItem(testKey, JSON.stringify(testValue));
    const retrievedValue = getData(testKey);
    expect(retrievedValue).toEqual(testValue);
  });

  it('should delete data from offline storage', () => {
    localStorage.setItem(testKey, JSON.stringify(testValue));
    deleteData(testKey);
    const deletedValue = localStorage.getItem(testKey);
    expect(deletedValue).toBeNull();
  });
});