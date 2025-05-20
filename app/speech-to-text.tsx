import AudioPlayer from '@/components/AudioPlayer';
import CustomButton from '@/components/CustomButton';
import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

const SpeechToText = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [playbackPosition, setPlayBackWidth] = useState(0);

  const handleStartRecording = useCallback(async () => {
    await audioRecorder.prepareToRecordAsync();
    await audioRecorder.record();
    setIsRecording(true);
    setAudioUri('');
    setTranscription('');
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
  console.log('Audio URI:', audioUri);
  const handleConvert = useCallback(async () => {
    if (!audioUri) {
      Alert.alert('Please record audio first');
      return;
    }

    const base64Audio = await FileSystem.readAsStringAsync(audioUri!, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const response = await fetch('/api/stt', {
      method: 'POST',
      body: JSON.stringify({ base64Audio }),
    });
    const data = await response.json();
    console.log('data', data);
    setTranscription(data.transcription);
  }, [audioUri]);

  return (
    <View style={styles.container}>
      {isRecording ? (
        <Pressable
          onPress={handleStopRecording}
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: 100,
            backgroundColor: 'crimson',
            position: 'absolute',
            bottom: 10,
            right: 10,
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
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}
        />
      )}
      {!isRecording && (
        <View>
          <AudioPlayer
            uri={audioUri!}
            onPlaybackPositionChange={setPlayBackWidth}
          />
          <CustomButton title='Convert to Text' onPress={handleConvert} />
        </View>
      )}
      {transcription && (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 24 }}>
            {transcription.words.map((word, index: number) => (
              <Text
                key={index}
                style={{
                  backgroundColor:
                    playbackPosition > word.start && playbackPosition < word.end
                      ? 'pink'
                      : 'transparent',
                }}
              >
                {word.text}
              </Text>
            ))}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    gap: 10,
  },
});
export default SpeechToText;
