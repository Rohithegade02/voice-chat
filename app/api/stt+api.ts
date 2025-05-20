import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient();

export async function POST(request: Request) {
  const { base64Audio } = await request.json();
  try {
    const buffer = Buffer.from(base64Audio, 'base64');
    const audioBlob = new Blob([buffer], { type: 'audio/mp3' });

    const transcription = await client.speechToText.convert({
      file: audioBlob,
      model_id: 'scribe_v1', // Model to use, for now only "scribe_v1" is support.
      tag_audio_events: true, // Tag audio events like laughter, applause, etc.
      language_code: 'eng', // Language of the audio file. If set to null, the model will detect the language automatically.
      diarize: true, // Whether to annotate who is speaking
    });
    console.log(transcription);
    return Response.json({ transcription });
  } catch (error) {
    console.error('Error during transcription:', error);
    return new Response('Error during transcription', {
      status: 500,
    });
  }
}
