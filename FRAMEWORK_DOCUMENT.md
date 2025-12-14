# Il Manifesto dell'Anti-Portfolio: Mirror Vitae

## 1. Filosofia: Oltre la Carta Elettronica

L'Anti-Portfolio nasce dalla consapevolezza che il CV tradizionale e il portfolio statico sono artefatti di un'era pre-AI. Non riescono a catturare la complessità, il potenziale latente e la personalità tridimensionale di un professionista. **Mirror Vitae** non è una vetrina di ciò che hai fatto, ma una simulazione di chi sei.

## 1.1. Come è nata l'idea?

L'idea è nata in maniera spontanea. Quotidianamente lavoro nell'ambito delle telecomunicazioni e di recente sto utilizzando agenti virtuali vocali nel mio workflow quotidiano. Quindi ho detto "perché non creare una sorta di clone digitale di me stesso?".

## 1.2. Perché Mirror Vitae?

Il nome deriva dal concetto di "mirror" (specchio) e "vitae" (vita). È un riferimento al concetto di "specchio digitale" e alla personalità unica di ogni individuo.

## 2. Assunti Base: L'Approccio "Anti-Traditional"

Un portfolio tradizionale si basa su assunti che oggi sono obsoleti:

- _Staticità vs Dinamismo_: "Ecco cosa ho fatto nel 2020" vs "Ecco come ragiono oggi su quel progetto".
- _Monologo vs Dialogo_: Il CV parla _a_ te; Mirror Vitae parla _con_ te.
- _Keyword Matching vs Semantic Understanding_: Non cerchiamo parole chiave, ma modelli di pensiero.

**L'assunto core**: La vera competenza non si misura nella lista delle tecnologie usate, ma nella capacità di spiegare il _perché_ delle scelte fatte e nell'adattare quelle esperienze a nuovi contesti in tempo reale.

## 3. Pattern e Domande: The Deep-Dive Methodology

Non raccogliamo date o elenchi puntati. Il nostro motore di intervista (Claude 4.5 Haiku) scava per estrarre:

- **Decision Making Architecture**: "Perché hai scelto quello stack in quel momento specifico?"
- **Conflict Resolution**: "Raccontami di un disaccordo tecnico e di come l'hai risolto."
- **Learning Velocity**: "Cosa faresti diversamente oggi con le conoscenze attuali?"

Raccogliamo _narrazioni_, non _dati_.

## 4. Principi di Design: Unicità come Standard

In un mondo dove l'AI può generare codice e design standardizzati, l'unico vero valore aggiunto è l'umanità imperfetta e unica del creatore.

- **Voce Reale**: Non usiamo TTS generici. La clonazione vocale è imperfetta, umana, riconoscibile. È la _tua_ firma sonica.
- **No Templates**: Non ci sono griglie rigide da riempire. Il contenuto modella la forma della conversazione.
- **Attrito Cognitivo Intenzionale**: Non vogliamo che l'interazione sia troppo "liscia" o robotica. Il gemello digitale può esitare, riflettere, avere opinioni forti. Simuliamo la _densità_ di una conversazione reale.

## 5. Elementi Distintivi (The "Signature Moves")

1.  **Zero Job Titles**: Non ci interessa se eri "Senior" o "Lead". Ci interessa il tuo impatto reale. Il sistema inferisce la seniority dalle tue risposte, non dall'etichetta.
2.  **The Failure Schema**: Una sezione (o meglio, un topic di conversazione) dedicata esplicitamente ai fallimenti. Chi non ha mai fallito non ha mai rischiato. Il gemello racconta i fallimenti con orgoglio analitico.
3.  **Metodologie Proprietarie**: Incoraggiamo l'utente a dare nomi ai propri processi mentali. Non "Agile", ma "Il mio metodo di iterazione rapida basato sul feedback utente".
4.  **Metriche Contestualizzate**: Non "Aumentato il fatturato del 20%", ma "Aumentato il fatturato del 20% in un mercato in contrazione durante una migrazione tecnologica". Il contesto è tutto.
5.  **Processo > Risultato**: Il gemello è addestrato a spiegare il _come_, non solo il _cosa_. Se gli chiedi di un progetto, ti racconterà la genesi, le sfide e l'architettura, non solo il risultato finale.

## 6. Visione AI-Native: Un Mondo Post-CV

Immaginiamo un futuro dove il recruiting non è filtrare PDF, ma far dialogare agenti AI.

- **AI-to-AI Hiring**: Il "Recruiter Bot" parla con il tuo "Mirror Vitae" per pre-qualificare la compatibilità culturale e tecnica.
- **Living Document**: Il tuo gemello impara da ogni conversazione. Se non sa rispondere a una domanda, te lo segnala, tu gli "insegni" la risposta, e lui evolve.
- **Ubiquitous Presence**: Il tuo Anti-Portfolio non è un sito web, è un'API della tua professionalità, interrogabile ovunque (Slack, IDE, VR).

## 7. Dettagli tecnici del progetto

### 7.1 Approccio di sviluppo utilizzato

Il progetto è stato costruito interamente con un approccio "vibe coding", utilizzando Google Gemini 3 e Claude.

### 7.2. Stack tecnologico

- **Frontend**: Next.js 16 con React 19 e Tailwind CSS per un design moderno e responsive.
- **Backend**: Next serverless functions sfruttando Vercel.
- **Database**: Redis per una cache veloce e un database in memoria e Vercel BLOB per il salvataggio degli avatar.
- **AI**: Claude 4.5 Haiku per una conversazione naturale e un'intelligenza artificiale avanzata.
- **Cloning e sintesi vocale**: ElevenLabs per una clonazione vocale precisa e umana.
- **Metriche**: PostHog per il tracking delle metriche in fase di onboarding e di utilizzo dei portfolio.
- **Deploy**: Vercel per un deploy veloce e scalabile.

### 7.3 Metriche raccolte

- **Onboarding**: Vengono tracciati gli step di onboarding completati da ogni utente e la generazione del system prompt per il gemello virtuale.
- **Portfolio**: Viene tracciato il numero di conversazioni avvenute all'intero dei portfolio.

### 7.4. Difficoltà incontrate

Durante lo sviluppo del progetto sono state incontrate diverse difficoltà:

- **Conversazione con il gemello virtuale**: Non è stato semplice arrivare alla generazione finale del sysyem prompt per i gemelli virtuali (tutt'ora non perfetto), come sempre è stato difficile capire come arginare il contesto dell'agente per evitare che inventi risposte o esca dal suo ruolo.
- **Salvataggio e utilizzo dei dati utente**: Per me è stato il primo utilizzo dei database KV di vercel, l'implementazione non è stata immediata

### 7.5 Funzionalità mancanti

L'idea iniziale era quella di generare un avatar 2d / 3d partendo dalla foto profilo degli utenti in fase di onboarding. Questo avatar sarebbe quindi dovuto essere espressivo (e con lip sync) durante una conversazione all'interno del portfolio.
A causa dei limiti di tempo questa idea è stata quindi ridimensionata mantenendo solo la foto statica degli utenti.
