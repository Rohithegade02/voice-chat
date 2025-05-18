import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
import { useState } from 'react';

export function useAudioRecordingSevice() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        console.error('Microphone permission not granted');
        return false;
      }

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      console.log('Recording started');
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setRecordingUri(audioRecorder.uri);
      console.log('Recording stopped, URI:', audioRecorder.uri);
      return audioRecorder.uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  };

  return {
    startRecording,
    stopRecording,
    recordingUri,
    isRecording: audioRecorder.isRecording,
    // duration: audioRecorder.recordingDuration,
  };
}