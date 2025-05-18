import * as FileSystem from 'expo-file-system';

export const createOpenAIAIService = (apiKey: string) => {
  const chatBaseUrl = 'https://api.openai.com/v1/chat/completions';
  const whisperBaseUrl = 'https://api.openai.com/v1/audio/transcriptions';

  const sendAudioAndGetResponse = async (audioUri: string) => {
    try {
      console.log('Sending audio to OpenAI Whisper API...');
      console.log('audioUri:', audioUri);
      const transcript = await transcribeAudio(audioUri);
console.log('transcript:', transcript);
      console.log('Sending transcript to OpenAI Chat API...');
      const response = await getChatResponse(transcript);
      return response;
    } catch (error) {
      console.error('Error in OpenAIAIService:', error);
      throw new Error('Failed to process audio and get AI response');
    }
  };

const transcribeAudio = async (audioUri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(audioUri);
  console.log('fileInfo:', fileInfo);
  if (!fileInfo.exists) {
    throw new Error('Audio file does not exist');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    type: 'audio/x-m4a', // or try audio/mp4 or audio/mpeg
    name: 'audio.m4a',
  } as any);
   formData.append('model', 'whisper-1');
console.log('formData:', formData);
  try {
    const response = await fetch(whisperBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body:formData,
    });

    const data = await response.json();
    console.log('data:', response);

    if (!response.ok) {
      console.error('Whisper API error:', data);
      throw new Error(`Whisper error: ${data.error?.message ?? response.status}`);
    }

    return data.text;
  } catch (error) {
    console.error('Error transcribing:', error);
    throw error;
  }
};

  const getChatResponse = async (transcript: string) => {
    const response = await fetch(chatBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: transcript }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.choices?.[0]?.message?.content ?? '',
      timestamp: new Date().toISOString(),
    };
  };

  return {
    sendAudioAndGetResponse,
    transcribeAudio,
    getChatResponse,
  };
};

export const createAIService = (
  type: 'claude' | 'openai',
  config: { apiKey: string }
) => {
  console.log(config)
  switch (type) {
    case 'claude':
      return 'not implemented yet'; // Placeholder for Claude AI service
    case 'openai':
      return createOpenAIAIService(config.apiKey);
    default:
      throw new Error(`Unknown AI service type: ${type}`);
  }
};