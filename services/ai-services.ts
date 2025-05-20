import * as FileSystem from 'expo-file-system';

// Replace with your ElevenLabs API key
const ELEVENLABS_API_KEY =
  'sk_b44b324ffd37e2150906b0b21a657d9279587b0a6f9f2228';

// Voice ID (you can customize this with any from https://elevenlabs.io)
const ELEVENLABS_VOICE_ID = 'Rachel';

// Transcribe audio with ElevenLabs
const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) throw new Error('Audio file does not exist');

    const formData = new FormData();
    const fileType = audioUri.split('.').pop() || 'm4a';
    formData.append('audio', {
      uri: audioUri,
      name: `audio.${fileType}`,
      type: `audio/${fileType === 'm4a' ? 'mp4' : fileType}`,
    } as any);

    const response = await fetch(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Transcription failed');
    }

    return data.text;
  } catch (err) {
    console.error('ElevenLabs STT error:', err);
    throw new Error('Failed to transcribe audio');
  }
};

// Convert text to speech with ElevenLabs
const speakText = async (text: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      },
    );

    const blob = await response.blob();
    const uri = FileSystem.documentDirectory + 'speech.mp3';

    await FileSystem.writeAsStringAsync(uri, await blob.text(), {
      encoding: FileSystem.EncodingType.Base64,
    });

    return uri;
  } catch (err) {
    console.error('ElevenLabs TTS error:', err);
    throw new Error('Failed to generate speech');
  }
};

// Main function: send audio and get AI response via ElevenLabs
const sendAudioAndGetResponse = async (audioUri: string) => {
  try {
    const transcript = await transcribeAudio(audioUri);

    // For now, the same text is echoed back.
    // If you integrate an LLM, you can use the transcript here.
    const textResponse = `You said: ${transcript}`;

    const audioResponseUri = await speakText(textResponse);

    return {
      text: textResponse,
      audioUri: audioResponseUri,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in ElevenLabs AI Service:', error);
    throw new Error('Failed to process audio');
  }
};

export const createAIService = () => {
  return {
    sendAudioAndGetResponse,
    transcribeAudio,
    speakText,
  };
};
