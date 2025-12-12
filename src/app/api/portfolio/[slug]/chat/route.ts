import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { storage } from '@/lib/storage';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
});

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const { message, history } = await req.json();
        const portfolio = await storage.getPortfolio(slug);

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        const messages = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        }));

        // Add user message
        messages.push({ role: 'user', content: message });

        const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 300, // Short responses for voice
            system: portfolio.system_prompt + "\n\nIMPORTANTE: Rispondi SEMPRE in ITALIANO. Sii breve (1-3 frasi) e colloquiale, le tue risposte verranno lette da una voce sintetica.",
            messages: messages,
        });

        const reply = (response.content[0] as any).text;

        return NextResponse.json({ message: reply });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
    }
}
