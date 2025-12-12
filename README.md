# Gemello Digitale AI - Hackathon Project

Una piattaforma AI-native per creare "Gemelli Digitali" conversazionali che sostituiscono i portfolio statici.

## 🌟 Concept

Invece di inviare un CV o un sito web statico, i professionisti creano un alter-ego AI che:

1.  Parla con la loro voce (clonata).
2.  Conosce la loro storia professionale (tramite intervista).
3.  Risponde alle domande dei recruiter in tempo reale.

## 🚀 Funzionalità Attuali (MVP)

### 1. Onboarding

- **Voice Cloning**: Registrazione di un campione audio (in italiano).
- **Intervista Intelligente**: Chat con Claude 4.5 Haiku che intervista l'utente per estrarre competenze ed esperienze.
- **Upload Foto**: Caricamento avatar.

### 2. Portfolio Pubblico

- **Voice Chat**: Interfaccia vocale (Web Speech API) per parlare con il gemello.
- **Risposte Audio**: Il gemello risponde con la voce clonata dell'utente (ElevenLabs Mulitilingual v2).
- **Personalità**: System prompt generato dinamicamente basandosi sull'intervista.

## 🛠️ Stack Tecnologico

- **Framework**: Next.js 16 (App Router)
- **Lingua**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **AI**: Anthropic Claude 4.5 Haiku
- **Audio**: ElevenLabs API
- **Storage**: Vercel KV (Database) + Vercel Blob (Media)

## 📦 Installazione

1. Clona il repository.
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Configura `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-...
   ELEVENLABS_API_KEY=...
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   BLOB_READ_WRITE_TOKEN=...
   ```
4. Avvia il server:
   ```bash
   npm run dev
   ```

## ⚠️ Note Hackathon

- **Browser Support**: Usa Chrome per la migliore compatibilità con la Web Speech API.
- **Microfono**: Assicurati di dare i permessi al browser.
