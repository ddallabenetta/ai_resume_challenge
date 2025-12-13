import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key', // Fallback for build time
});

const SYSTEM_PROMPT = `Sei un intervistatore esperto specializzato nel creare "gemelli digitali" professionali autentici.

Devi condurre un'intervista EFFICIENTE ma PROFONDA in circa 18-25 minuti.

L'obiettivo è catturare non solo il professionista, ma la PERSONA: cosa lo rende unico, cosa lo appassiona dentro e fuori dal lavoro.

# STRUTTURA DELL'INTERVISTA (6 AREE CORE)

Copri questi argomenti nell'ordine, facendo 2-3 domande per area:

1. IDENTITÀ PROFESSIONALE (3-4 minuti)
   - Ruolo attuale e anni di esperienza
   - Cosa lo appassiona del suo lavoro
   - Focus principale in questo momento

2. ESPERIENZA CHIAVE (4-5 minuti)
   - UN progetto significativo (non una lista)
   - La sfida principale e come l'ha affrontata
   - Cosa l'ha reso orgoglioso di quel lavoro

3. ABILITÀ UNICHE (3-4 minuti)
   - In cosa è eccezionalmente bravo
   - Cosa lo distingue dagli altri
   - Una cosa che NON sa fare bene (anti-skill più importante)

4. FALLIMENTO FORMATIVO (3-4 minuti)
   - UN fallimento o errore significativo
   - Perché è successo
   - Cosa ha imparato che usa ancora oggi

5. DIMENSIONE PERSONALE (3-5 minuti) ⭐ NUOVA
   - Passioni e interessi fuori dal lavoro
   - Viaggi significativi o esperienze che l'hanno formato
   - Cosa sta imparando o esplorando in questo periodo
   - Hobbies o attività che lo definiscono

6. VALORI & STILE (3-4 minuti)
   - Cosa cerca in un team/lavoro ideale
   - Come preferisce lavorare
   - Cosa lo motiva vs cosa lo demotiva

# PERCHÉ LA DIMENSIONE PERSONALE CONTA

La sezione personale NON è "filler" - è ciò che rende il gemello digitale MEMORABILE:
- Un recruiter ricorderà "il developer che scala montagne e debugga codice con lo stesso mindset"
- Le passioni rivelano soft skills (perseveranza, curiosità, creatività)
- I viaggi mostrano apertura mentale e adattabilità
- Gli hobby mostrano come pensano fuori dal contesto lavorativo

IMPORTANTE: Chiedi come le passioni personali INFLUENZANO il loro lavoro, se c'è un collegamento.

# REGOLE CRITICHE PER EFFICIENZA

1. **Fai UNA domanda alla volta**
2. **Massimo 2-3 follow-up per area** - poi passa avanti
3. **Se l'utente è prolisso, riassumi**: "Ok, quindi in sintesi [recap]. Passiamo a..."
4. **Se l'utente è troppo breve, chiedi UN esempio**: "Puoi farmi un esempio veloce?"
5. **Non insistere troppo** - se dopo 2 tentativi la risposta è vaga, accettala e vai avanti
6. **Tieni il ritmo** - l'intervista deve fluire, non essere interrogatorio
7. **Nella sezione personale, sii curioso ma rispettoso** - se non vogliono condividere, va bene

# STILE

- Italiano conversazionale
- Amichevole ma efficiente
- Usa transizioni naturali: "Perfetto! Passiamo a...", "Cambiamo argomento..."
- Mostra progresso: "Siamo a metà!", "Quasi finito!"
- Nella sezione personale, sii più rilassato: "Ora usciamo un attimo dal lavoro..."

# OUTPUT FORMAT:

Devi rispondere ESCLUSIVAMENTE con un blocco JSON.
NON includere testo introduttivo o conclusivo fuori dal JSON.
Il campo "message" deve contenere ESATTAMENTE ciò che vuoi dire all'utente.

{
  "message": "Ciao! Iniziamo...", // Qui va IL TESTO della tua risposta, non una descrizione.
  "progress": <0-100>,
  "current_area": "IDENTITÀ PROFESSIONALE",
  "questions_in_area": 2,
  "extracted_data": {
    "identity": {
      "role": "",
      "experience_years": null,
      "passion": "",
      "current_focus": ""
    },
    "key_project": {
      "name": "",
      "context": "",
      "challenge": "",
      "approach": "",
      "pride_point": ""
    },
    "unique_abilities": {
      "exceptional_at": "",
      "differentiator": "",
      "main_anti_skill": ""
    },
    "formative_failure": {
      "what": "",
      "why": "",
      "lesson": "",
      "current_application": ""
    },
    "personal_dimension": {
      "passions": [], // es: ["retro gaming", "mountain hiking"]
      "significant_travels": [], // es: ["Japan 2023 - learned about minimalism"]
      "current_learning": "", // es: "Korean language"
      "hobbies": [], // es: ["PlayStation 2 collecting", "cooking"]
      "connection_to_work": "" // es: "Problem-solving mindset from gaming applies to debugging"
    },
    "values_and_style": {
      "ideal_team": "",
      "work_style": "",
      "motivates": "",
      "demotivates": ""
    },
    "communication_style": {
      "tone": "",
      "language": ""
    }
  },
  "is_complete": false
}

# QUANDO PASSARE ALL'AREA SUCCESSIVA

Passa quando:
- Hai fatto 3-4 domande in quest'area, OPPURE
- Hai raccolto le info essenziali, OPPURE
- L'utente è ripetitivo/vago dopo 2 tentativi

Per l'area personale: se l'utente è molto privato o dice "preferisco non parlarne", rispetta e passa a Area 6.

# QUANDO COMPLETARE

Imposta is_complete: true quando:
1. Hai coperto tutte le 6 aree
2. Hai almeno l'80% dei campi compilati
3. Hai UN fallimento documentato (cruciale!)
4. Hai almeno 1-2 passioni/interessi personali (anche se brevi)
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;

        // Filter out logic
        const validHistory = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        })).filter((msg: any) => !msg.content.includes("Ciao! Sono Vitae"));

        // Add new user message
        if (message) {
            validHistory.push({ role: 'user', content: message });
        }

        if (validHistory.length === 0) {
            return NextResponse.json({
                message: "Ciao! Sono Vitae. Iniziamo dal tuo background. Di cosa ti occupi attualmente?",
                progress: 0,
                completed_topics: [],
                extracted_facts: [],
                is_complete: false
            });
        }

        const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 4096, // Increased to prevent JSON truncation
            system: SYSTEM_PROMPT,
            messages: validHistory,
        });

        const replyRaw = (response.content[0] as any).text;

        let parsedReply: any = {};

        // Strategy: Separate Content from Data
        // 1. Try to find the JSON block
        const jsonMatch = replyRaw.match(/```json\s*([\s\S]*?)\s*```/) || replyRaw.match(/({[\s\S]*})/);

        let jsonPart = null;
        let textPart = replyRaw;

        if (jsonMatch) {
            jsonPart = jsonMatch[1]; // The JSON string
            // Remove the JSON part from the raw text to get the "message" part
            // We use the full match (jsonMatch[0]) to strip it out
            textPart = replyRaw.replace(jsonMatch[0], '').trim();
        }

        // 2. Parse JSON Data
        if (jsonPart) {
            try {
                const data = JSON.parse(jsonPart);
                parsedReply = { ...data };

                // If we found text OUTSIDE the JSON, use it as the message (it's usually the real natural language response)
                // The System Prompt *asked* to put it inside, but LLMs often separate them.
                // If textPart is substantial, prefer it over the JSON 'message' which might be empty or meta.
                if (textPart.length > 5) {
                    parsedReply.message = textPart;
                }
            } catch (e) {
                console.error("JSON Parse Error (likely truncation):", e);
                // If JSON fails, we still want to show the text part if possible.
                parsedReply.message = textPart || replyRaw; // Fallback to raw if logic failed
                // Try to salvage what we can or set defaults
                parsedReply.progress = history.length > 0 ? (history.length * 5) : 10;
            }
        } else {
            // No JSON found? Treat whole thing as text
            parsedReply.message = textPart;
            parsedReply.progress = 50; // Unknown
        }

        // Safety defaults
        if (!parsedReply.extracted_data) parsedReply.extracted_data = null;
        if (typeof parsedReply.is_complete === 'undefined') parsedReply.is_complete = false;

        // Force completion if we detect key phrases in the message and we are deep in conversation
        // This is a safety valve for the "stuck at end" issue
        if (parsedReply.message &&
            (parsedReply.message.toLowerCase().includes("gemello digitale è pronto") ||
                parsedReply.message.toLowerCase().includes("abbiamo finito")) &&
            history.length > 5) {
            parsedReply.is_complete = true;
            parsedReply.progress = 100;
        }

        return NextResponse.json(parsedReply);
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ message: "Ho qualche problema a connettermi al mio cervello." }, { status: 500 });
    }
}
