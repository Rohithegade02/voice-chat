import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStorageService = (initialKey: string = '@appData') => {
  let storageKey = initialKey;

  const saveData = async <T>(data: T): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  };

  const loadData = async <T>(): Promise<T | null> => {
    try {
      const data = await AsyncStorage.getItem(storageKey);
      return data ? JSON.parse(data) as T : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  };

  const clearData = async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  };

  const setKey = (key: string) => {
    storageKey = key;
  };

  return {
    saveData,
    loadData,
    clearData,
    setKey,
  };
};