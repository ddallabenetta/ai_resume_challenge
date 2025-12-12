import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('file') as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('name', `User Clone ${Date.now()}`);
    elevenLabsFormData.append('files', audioFile, 'voice_sample.webm');
    elevenLabsFormData.append('description', 'User voice clone from AI Resume generator');

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      },
      body: elevenLabsFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("ElevenLabs Error:", error);
      // Fallback to a default voice if cloning fails (common with free tier limits)
      return NextResponse.json({
        voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel default
        warning: 'Cloning failed (likely tier limit), using default voice.'
      });
    }

    const data = await response.json();
    return NextResponse.json({ voice_id: data.voice_id });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
