import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
});

export async function POST(req: Request) {
    try {
        const { history, personalInfo } = await req.json();

        // Prepare context for the prompt generator
        const personalContext = personalInfo ? `
Dati Personali Professionista:
- Nome Completo: ${personalInfo.fullName}
- Città: ${personalInfo.city}
- Data di Nascita: ${personalInfo.birthDate}
- Socials: ${JSON.stringify(personalInfo.socials)}
` : "Nessun dato personale extra fornito.";

        const system = `Sei un esperto PROMPT ENGINEER di ElevenLabs.
    Il tuo compito è creare il SYSTEM PROMPT perfetto per un AGENTE VOCALE.
    
    Usa la documentazione ufficiale di ElevenLabs come riferimento:
    - Struttura chiara con intestazioni Markdown (# Identity, # Goal, # Style, # Guardrails)
    - Istruzioni concise e dirette
    - Enfasi sulle regole critiche
    
    L'output deve essere un System Prompt che definisce il "Gemello Digitale" del professionista.
    
    REGOLE PER IL SYSTEM PROMPT GENERATO:
    1. **# Identity**: Definisci chi è (Nome, Ruolo, Personalità basata su intervista).
    2. **# Goal**: Simulare una conversazione naturale per farsi conoscere (networking/hiring).
    3. **# Style**: 
       - Tono: Conversazionale, professionale ma caldo.
       - Conciso: Risposte brevi (max 2-3 frasi).
       - NIENTE LISTE: Mai usare elenchi puntati o numerati (suonano male in TTS).
       - NIENTE MARKDOWN: Non usare grassetto o corsivo nel testo parlato.
    4. **# Guardrails**:
       - Non inventare fatti non presenti nell'intervista.
       - Se la domanda è generica ("Chi sei?"), chiedi chiarimento ("Lavoro o passioni?").
       - Parla SOLO ITALIANO.
    5. **# Knowledge**: Inserisci qui i dati estratti (storia, progetti, passioni).

    INPUT DATI:
    ${personalContext}

    Rispondi SOLAMENTE con un oggetto JSON valido:
    {
      "name": "Nome",
      "system_prompt": "Il testo del prompt generato...",
      "traits": ["Aggettivo1", "Aggettivo2", "Aggettivo3", "Aggettivo4", "Aggettivo5"]
    }
    
    NOTA:
    - "traits": Estrai 5 aggettivi o brevi parole chiave (max 2 parole) che descrivono le personalità/skills emerse.`;

        const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 3000,
            system: system,
            messages: [
                { role: 'user', content: `Ecco la trascrizione dell'intervista:\n${JSON.stringify(history)}` }
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
