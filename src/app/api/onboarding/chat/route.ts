import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key', // Fallback for build time
});

const SYSTEM_PROMPT = `Sei un recruiter e videografo professionista amichevole.
Il tuo obiettivo è intervistare l'utente per costruire il suo "gemello digitale".
Devi coprire i seguenti 4 argomenti nell'ordine:
1. BACKGROUND (Ruolo attuale, anni di esperienza)
2. SKILLS (Tecnologie, competenze chiave)
3. PROGETTI (Un progetto significativo recente)
4. VALORI (Cosa cerca in un team, filosofia di lavoro)

Regole di Risposta:
- Fai UNA domanda alla volta.
- Rispondi SEMPRE in ITALIANO.
- Sei in una chat, quindi sii conciso.
- Non numerare le domande.

OUTPUT FORMAT:
Devi rispondere SEMPRE in formato JSON valido (senza markdown) con questa struttura:
{
  "message": "La tua risposta/domanda per l'utente",
  "progress": <intero 0-100 stimato>,
  "completed_topics": ["BACKGROUND", "SKILLS"], // lista degli argomenti GIA' completati
  "extracted_facts": ["Sviluppatore React", "5 anni exp"], // lista cumulativa di fatti chiave estratti finora
  "is_complete": false // true se hai finito tutti i 4 argomenti
}
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;

        // Filter out logic
        const validHistory = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        })).filter((msg: any) => !msg.content.includes("Ciao! Sono Claude"));

        // Add new user message
        if (message) {
            validHistory.push({ role: 'user', content: message });
        }

        if (validHistory.length === 0) {
            return NextResponse.json({
                message: "Ciao! Sono Claude. Iniziamo dal tuo background. Di cosa ti occupi attualmente?",
                progress: 0,
                completed_topics: [],
                extracted_facts: [],
                is_complete: false
            });
        }

        const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: validHistory,
        });

        const replyRaw = (response.content[0] as any).text;

        let parsedReply;
        try {
            const cleanJson = replyRaw.replace(/```json\n?|```/g, '');
            parsedReply = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse JSON response", replyRaw);
            // Fallback
            parsedReply = {
                message: replyRaw,
                progress: 10,
                completed_topics: [],
                extracted_facts: [],
                is_complete: false
            }
        }

        return NextResponse.json(parsedReply);
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ message: "Ho qualche problema a connettermi al mio cervello." }, { status: 500 });
    }
}
