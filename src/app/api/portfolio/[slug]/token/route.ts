
import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { ElevenLabsClient } from 'elevenlabs';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const portfolio = await storage.getPortfolio(slug);

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!agentId || !apiKey) {
            console.error("Missing ElevenLabs credentials");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const client = new ElevenLabsClient({ apiKey });

        const { signed_url } = await client.conversationalAi.getSignedUrl({
            agent_id: agentId,
        });

        return NextResponse.json({ signedUrl: signed_url });

    } catch (error) {
        console.error("Token Generation Failed:", error);
        return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
}
