# Roadmap Sviluppo & Action Items

## 1. Generazione Avatar 2D (Lipsync)

Attualmente l'avatar è un'immagine statica con una semplice animazione CSS quando parla.

- [ ] **Ricerca tool lipsync**: Valutare soluzioni come SadTalker, HeyGen API o D-ID API per animare il volto basandosi sull'audio.
- [ ] **Integrazione Frontend**: Implementare un player video/canvas che sincronizzi l'audio di ElevenLabs con i movimenti labiali.
- [ ] **Fallback**: Migliorare l'animazione CSS attuale (basata su volume/ampiezza) se l'integrazione video è troppo lenta per il real-time.

## 2. Generazione Profilo & Intervista Strutturata

L'intervista attuale è aperta e potenzialmente infinita.

- [ ] **Barra di Progresso Intervista**: Visualizzare indicatori chiari dei "moduli" completati (es. "Background", "Skill", "Progetti", "Valori").
- [ ] **Criteri di Stop**: Il backend deve decidere esplicitamente quando ha abbastanza informazioni e forzare la conclusione.
- [ ] **Visualizzazione Dati Raccolti**: Una sidebar che si popola in tempo reale man mano che Claude estrae informazioni (es. "✅ Ruolo attule rilevato", "✅ 3 Soft skill identificate").
- [ ] **Review**: Permettere all'utente di modificare i dati estratti prima di generare il prompt finale.

## 3. Fix Generazione "Gemello Virtuale"

Il flusso di creazione finale sembra bloccarsi o non funzionare correttamente.

- [ ] **Debug `create-portfolio`**: Verificare che i dati vengano salvati correttamente su Vercel KV.
- [ ] **Debug Voice Cloning**: Verificare se la voce viene effettivamente clonata su ElevenLabs o se stiamo usando una voce di fallback.
- [ ] **Gestione Errori**: Aggiungere feedback visivo se la creazione fallisce.
- [ ] **Prerequisiti mancanti**:
  - Account Vercel Storage collegato.
  - Account ElevenLabs con slot voce disponibili per il cloning istantaneo.

## 4. Miglioramenti UX

- [ ] **Preview Vocale**: Ascoltare la propria voce clonata prima di confermare.
- [ ] **Editing Prompt**: Possibilità (opzionale) di ritoccare il "cervello" del gemello manualmente.
