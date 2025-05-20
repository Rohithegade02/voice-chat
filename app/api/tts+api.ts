import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient();

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return Response.json({ error: 'No text provided' }, { status: 400 });
  }

  try {
    const audio = await client.textToSpeech.convertAsStream(
      'JBFqnCBsd6RMkjVDRZzb',
      {
        text,
        model_id: 'eleven_multilingual_v2',
        output_format: 'mp3_44100_128',
      },
    );

    const chucks = [];
    for await (const chunk of audio) {
      chucks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chucks);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error converting text to speech:', error);
    return Response.json(
      { error: 'Failed to convert text to audio' },
      { status: 500 },
    );
  }
}
