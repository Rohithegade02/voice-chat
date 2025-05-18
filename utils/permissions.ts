import * as Audio from 'expo-audio';
import * as FileSystem from 'expo-file-system';

export const requestPermissions = async () => {
  try {
    const { status } = await Audio.requestRecordingPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

export const ensureDirectoryExists = async (directory:string) => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(directory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
  } catch (error) {
    console.error('Error ensuring directory exists:', error);
  }
};