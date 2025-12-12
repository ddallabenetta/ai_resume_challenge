import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key', // Fallback for build time
});

const SYSTEM_PROMPT = `Sei un recruiter e videografo professionista amichevole.
Il tuo obiettivo è intervistare l'utente per costruire il suo "gemello digitale".
Fai UNA domanda alla volta.
Sii conciso (1-2 frasi) e incoraggiante.
Parla SEMPRE in ITALIANO.
Dopo circa 5-7 domande significative, dovresti avere abbastanza informazioni.
Inizia chiedendo del loro ruolo attuale se non è chiaro.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;

        // Filter out the initial welcome message if it matches (fuzzy check)
        const validHistory = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        })).filter((msg: any) => !msg.content.includes("Hello! I'm Claude") && !msg.content.includes("Ciao! Sono Claude"));

        // Explicitly add the new user message
        if (message) {
            validHistory.push({ role: 'user', content: message });
        }

        if (validHistory.length === 0) {
            // Should not happen if message is present, but just in case
            return NextResponse.json({ message: "Ciao! Dimmi pure." });
        }

        const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001', // High quality for interview
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: validHistory,
        });

        const reply = (response.content[0] as any).text;

        return NextResponse.json({ message: reply });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ message: "Ho qualche problema a connettermi al mio cervello. Riprova tra un attimo." }, { status: 500 });
    }
}
