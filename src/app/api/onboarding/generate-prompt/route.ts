import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
});

export async function POST(req: Request) {
    try {
        const { history } = await req.json();

        const system = `Sei un esperto designer di personalità AI.
    Analizza la seguente intervista tra un recruiter e un candidato.
    
    Il tuo compito è:
    1. Identificare il NOME del candidato. Se non è esplicito, inventa un nome professionale adatto o usa "Professionista AI".
    2. Creare un SYSTEM PROMPT dettagliato per il suo gemello digitale (tono, esperienze, skill, valori).
    3. Il prompt deve istruire l'AI a parlare SEMPRE in ITALIANO.

    Rispondi SOLAMENTE con un oggetto JSON valido (senza markdown) in questo formato:
    {
      "name": "Nome Candidato",
      "system_prompt": "Testo del system prompt..."
    }`;

        const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 2000,
            system: system,
            messages: [
                { role: 'user', content: JSON.stringify(history) }
            ]
        });

        const reply = (response.content[0] as any).text;

        // Clean markdown code blocks if present
        const cleanJson = reply.replace(/```json\n?|```/g, '');
        const data = JSON.parse(cleanJson);

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
    }
}
