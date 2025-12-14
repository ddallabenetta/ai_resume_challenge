# Mirror Vitae: Il Tuo Gemello Digitale AI

Una piattaforma AI-native per creare "Gemelli Digitali" conversazionali che rivoluzionano il concetto di portfolio professionale.

## 🌟 Concept

Mirror Vitae trasforma il CV statico in un'esperienza interattiva. I professionisti creano un alter-ego AI che:

1.  **Parla con la loro voce**: Utilizza tecnologie avanzate di clonazione vocale per un'esperienza autentica.
2.  **Racconta la loro storia**: Costruito su un'intervista approfondita per catturare esperienze e competenze uniche.
3.  **Interagisce in tempo reale**: Risponde alle domande dei recruiter o visitatori come se fosse il professionista stesso.

## 🚀 Funzionalità

### 1. Onboarding Intelligente

- **Voice Cloning Flessibile**:
  - Opzione per clonare la propria voce leggendo una breve frase (minimo 10 secondi).
  - Possibilità di scegliere una voce predefinita (Maschile/Femminile) se si preferisce non clonare.
  - Opzione di skip completo per chi vuole procedere velocemente.
- **Intervista interattiva**: Una chat guidata dall'AI (Claude 4.5 Haiku) scava nel background professionale dell'utente per costruire una base di conoscenza solida.
- **Media Upload**: Caricamento semplice di foto profilo per dare un volto al gemello digitale.

### 2. Portfolio Pubblico

- **Interfaccia Vocale**: I visitatori possono parlare direttamente con il gemello digitale utilizzando la voce (Web Speech API).
- **Risposte Naturali**: Il gemello risponde con la voce (clonata o selezionata) dell'utente, powered by ElevenLabs Multilingual v2.
- **Personalità Adattiva**: Il sistema genera un prompt dinamico basato sull'intervista per riflettere accuratamente il tono e le competenze dell'utente.
- **Esperienza Localizzata**: Interfaccia e interazioni completamente localizzate in italiano.

## 🛠️ Stack Tecnologico

- **Framework**: Next.js 16 (App Router)
- **Linguaggio**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **AI Intelligence**: Anthropic Claude 4.5 Haiku per la generazione di prompt e la gestione delle conversazioni.
- **Audio Engine**: ElevenLabs API per la sintesi vocale e il voice cloning.
- **Data & Storage**: Vercel KV (Database Sessioni/Stato) + Vercel Blob (Media Assets).

## 📦 Installazione e Avvio

### Prerequisiti

- Node.js 20+
- Account (e chiavi API) per: Anthropic, ElevenLabs, Vercel.
- **Vercel Blob**: Creare uno store Blob su Vercel per il salvataggio degli avatar.
- **Vercel KV (Redis)**: Creare un database Redis su Vercel per memorizzare i dati degli utenti.
- **Agente ElevenLabs Converazionale**: È necessario configurare un agente su ElevenLabs con i permessi di "Override" abilitati per:
  - `firstMessage`
  - `voice`
  - `systemPrompt`

### Passaggi

1.  **Clona il repository**:

    ```bash
    git clone <repository-url>
    cd ai_resume_challenge
    ```

2.  **Installa le dipendenze**:

    ```bash
    npm install
    ```

3.  **Configura le Variabili d'Ambiente**:
    Crea un file `.env.local` nella root del progetto basandoti su `.env.example` e inserisci le seguenti chiavi:

    ```env
    # AI Services
    ANTHROPIC_API_KEY=sk-...
    ELEVENLABS_API_KEY=...
    NEXT_PUBLIC_ELEVENLABS_AGENT_ID=...

    # Vercel Storage
    REDIS_URL=...
    BLOB_READ_WRITE_TOKEN=...
    ```

4.  **Avvia il server di sviluppo**:
    ```bash
    npm run dev
    ```
    L'applicazione sarà disponibile su `http://localhost:3000`.

## ⚠️ Note Importanti

- **Supporto Browser**: Per la migliore esperienza con le funzionalità di riconoscimento vocale (Web Speech API), si raccomanda l'uso di **Google Chrome** o browser basati su Chromium.
- **Permessi**: Assicurati di concedere i permessi per l'uso del microfono quando richiesto dal browser.
