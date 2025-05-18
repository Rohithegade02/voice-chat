import { useAudioRecordingSevice } from '@/services/audio-service';
import { useEffect, useState } from 'react';
import { requestPermissions } from '../utils/permissions';

// Custom hook to encapsulate audio recording logic
export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string|null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const audioService =  useAudioRecordingSevice();

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestPermissions();
      setHasPermission(granted);
    };
    
    checkPermissions();
  }, []);

  const startRecording = async () => {
    if (!hasPermission) {
      console.warn('Missing audio recording permissions');
      return false;
    }
    
    const success = await audioService.startRecording();
    setIsRecording(success);
    return success;
  };

  const stopRecording = async () => {
    if (!isRecording) return null;
    
    const uri = await audioService.stopRecording();
    setIsRecording(false);
    setRecordingUri(uri);
    return uri;
  };

//   const playRecording = async (uri = recordingUri) => {
//     if (!uri) return false;
//     return audioService.(uri);
//   };

  return {
    isRecording,
    recordingUri,
    hasPermission,
    startRecording,
    stopRecording,
    // playRecording
  };
};