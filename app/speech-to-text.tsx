import AudioPlayer from '@/components/AudioPlayer';
import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

const SpeechToText = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // const status = useAudioRecorderState(audioRecorder);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const handleStartRecording = useCallback(async () => {
    await audioRecorder.prepareToRecordAsync();
    await audioRecorder.record();
    setIsRecording(true);
  }, [audioRecorder]);

  const handleStopRecording = useCallback(async () => {
    await audioRecorder.stop();
    if (audioRecorder.uri) {
      setAudioUri(audioRecorder.uri);
    }
    setIsRecording(false);
  }, [audioRecorder]);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isRecording ? (
        <Pressable
          onPress={handleStopRecording}
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: 100,
            backgroundColor: 'crimson',
          }}
        />
      ) : (
        <Pressable
          onPress={handleStartRecording}
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: 100,
            backgroundColor: 'gainsboro',
          }}
        />
      )}
      {!isRecording && <AudioPlayer uri={audioUri!} />}
    </View>
  );
};

export default SpeechToText;
