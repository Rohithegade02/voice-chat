import GradientBackground from '@/components/GradientView';
import TextToSpeech from '@/components/TextSpeech';
import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TranscriptionWord {
  text: string;
  start: number;
  end: number;
}

interface TranscriptionResult {
  language_code: string;
  language_probability: number;
  text: string;
  words: TranscriptionWord[];
}

const SpeechToText = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [transcription, setTranscription] =
    useState<TranscriptionResult | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartRecording = useCallback(async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      setIsRecording(true);
      setAudioUri(null);
      setTranscription(null);
      setGeminiResponse(null);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  }, [audioRecorder]);

  const handleStopRecording = useCallback(async () => {
    try {
      await audioRecorder.stop();
      if (audioRecorder.uri) {
        setAudioUri(audioRecorder.uri);
      }
      setIsRecording(false);
    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  }, [audioRecorder]);

  useEffect(() => {
    (async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission to access microphone was denied');
        }
      } catch (error) {
        console.error('Permission error:', error);
        Alert.alert('Error', 'Failed to get recording permissions');
      }
    })();
  }, []);

  const handleConvert = useCallback(async () => {
    if (!audioUri) {
      Alert.alert('Please record audio first');
      return;
    }

    try {
      setIsProcessing(true);
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch('/api/stt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Audio }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('STT Response:', data);

      if (data.transcription) {
        setTranscription(data.transcription);
      } else {
        throw new Error('Invalid transcription data');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      Alert.alert('Error', 'Failed to convert speech to text');
    } finally {
      setIsProcessing(false);
    }
  }, [audioUri]);

  useEffect(() => {
    if (audioUri) {
      handleConvert();
    }
  }, [audioUri]);

  async function processWithGemini(inputText: string) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

    try {
      console.log('Sending to Gemini:', inputText);
      const response = await fetch(
        `${API_URL}?key=AIzaSyBIQtwDmEVzXRbA4-ehXtwM2rmDvZAaZCA`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: inputText,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gemini response data:', data);

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected response structure from Gemini');
      }
    } catch (error) {
      console.error('Error processing with Gemini:', error);
      throw error;
    }
  }

  useEffect(() => {
    if (!transcription?.text) return;

    const runAIVoiceWorkflow = async () => {
      try {
        setIsProcessing(true);
        const response = await processWithGemini(transcription.text);
        console.log('Gemini response:', response);
        setGeminiResponse(response);
      } catch (error) {
        console.error('Workflow error:', error);
        Alert.alert('Error', 'Failed to process with Gemini');
      } finally {
        setIsProcessing(false);
      }
    };

    runAIVoiceWorkflow();
  }, [transcription]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          <Image
            source={require('@/assets/images/icon_background.png')} // Make sure the path is correct
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
          <Text
            style={{
              fontFamily: 'Sora-ExtraBold',
              color: 'white',
              fontSize: 36,
            }}
          >
            QuickCall AI
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View
          style={{ paddingBottom: 50, display: 'flex', alignItems: 'center' }}
        >
          {isRecording ? (
            <TouchableOpacity
              onPress={handleStopRecording}
              style={styles.recordButton}
            >
              <Text
                style={{
                  fontFamily: 'Sora-Bold',
                  fontSize: 14,
                  color: 'white',
                }}
              >
                Stop Call
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleStartRecording}
              style={styles.recordButton}
            >
              <Text
                style={{
                  // fontFamily: 'Sora-Bold',
                  fontSize: 14,
                  color: 'white',
                  fontFamily: 'Sora-Bold',
                }}
              >
                Start Call
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!isRecording && audioUri && (
          <View style={styles.playerContainer}>
            {/* <AudioPlayer
            uri={audioUri}
            onPlaybackPositionChange={setPlaybackPosition}
          /> */}
            {/* <CustomButton
            title={isProcessing ? 'Processing...' : 'Convert to Text'}
            onPress={handleConvert}
            disabled={isProcessing}
          /> */}
          </View>
        )}

        {/* {transcription && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionText}>
            {transcription.words.map((word, index) => (
              <Text
                key={index}
                style={{
                  backgroundColor:
                    playbackPosition > word.start && playbackPosition < word.end
                      ? 'pink'
                      : 'transparent',
                }}
              >
                {word.text}{' '}
              </Text>
            ))}
          </Text>
        </View> */}
        {/* 
      {geminiResponse && (
        <View style={styles.geminiContainer}>
          <Text style={styles.geminiTitle}>Gemini Response:</Text>
        </View>
      )} */}

        <TextToSpeech text={geminiResponse!} />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  safeArea: {
    flex: 1,
    position: 'relative',
    padding: 20,
  },
  mainContainer: {
    paddingTop: 50,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#203B47',
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingHorizontal: 36,
    paddingVertical: 15,
  },
  recordButtonActive: {
    backgroundColor: '#203B47',
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingHorizontal: 36,
    paddingVertical: 15,
  },
  playerContainer: {
    marginTop: 20,
    gap: 15,
  },
  transcriptionContainer: {
    marginTop: 20,
  },
  transcriptionTitle: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    marginBottom: 10,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  geminiContainer: {
    marginTop: 20,
    backgroundColor: '#f5f5f7',
    padding: 15,
    borderRadius: 10,
  },
  geminiTitle: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    marginBottom: 10,
  },
  geminiText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default SpeechToText;
