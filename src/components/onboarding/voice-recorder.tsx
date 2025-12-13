"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mic,
  Square,
  RotateCcw,
  Upload,
  Volume2,
  User,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onRecordingComplete: (result: Blob | string) => void;
  onSkip?: () => void;
}

const READING_SCRIPT =
  "Ciao, sono entusiasta di creare il mio gemello digitale. " +
  "Credo che l'intelligenza artificiale possa amplificare il potenziale umano, non sostituirlo. " +
  "Voglio che la mia voce racconti la mia storia, le mie esperienze e le mie ambizioni con autenticità. " +
  "Attraverso questo processo, spero di scoprire nuovi modi per connettermi con gli altri e condividere il mio percorso professionale. " +
  "Sono pronto a iniziare questa nuova avventura tecnologica.";

const DEFAULT_VOICES = [
  {
    id: "DTGwzA4YLrWB1FAT6Uas",
    name: "Lorenzo",
    gender: "Maschile",
    icon: User,
  },
  {
    id: "QITiGyM4owEZrBEf0QV8",
    name: "Ginevra",
    gender: "Femminile",
    icon: UserCircle2,
  },
];

type Mode = "selection" | "recording";

export function VoiceRecorder({
  onRecordingComplete,
  onSkip,
}: VoiceRecorderProps) {
  const [mode, setMode] = useState<Mode>("selection");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordingBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Impossibile accedere al microfono. Verifica i permessi.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setRecordingBlob(null);
    setAudioUrl(null);
    setTimer(0);
    setError(null);
  };

  const handleConfirmRecording = () => {
    if (timer < 10) {
      setError(
        "La registrazione deve durare almeno 10 secondi per una clonazione efficace."
      );
      return;
    }
    if (recordingBlob) {
      onRecordingComplete(recordingBlob);
    }
  };

  const handleSelectDefaultVoice = (voiceId: string) => {
    onRecordingComplete(voiceId);
  };

  if (mode === "selection") {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-black border-gray-800 text-white animate-in fade-in zoom-in duration-300">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-light">
            Scegli la tua Voce
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Clone Voice */}
            <div
              onClick={() => setMode("recording")}
              className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-900/30 p-6 hover:bg-gray-800/50 hover:border-purple-500/50 transition-all text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-purple-900/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Mic className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Clona la tua Voce
                </h3>
                <p className="text-sm text-gray-400">
                  Registra un breve audio per permettere all'AI di replicare il
                  tuo timbro vocale.
                </p>
              </div>
            </div>

            {/* Option 2: Default Voices */}
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-900/20 flex items-center justify-center mx-auto">
                  <Volume2 className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Voci Predefinite
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Scegli una voce professionale di alta qualità.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEFAULT_VOICES.map((voice) => (
                      <Button
                        key={voice.id}
                        variant="outline"
                        onClick={() => handleSelectDefaultVoice(voice.id)}
                        className="flex flex-col h-auto py-4 px-2 border-gray-700 bg-gray-950 hover:bg-gray-800 hover:border-blue-500/50 hover:text-white group transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mb-3 group-hover:bg-blue-900/30 transition-colors">
                          <voice.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <span className="block text-sm font-semibold text-gray-200 group-hover:text-white">
                            {voice.name}
                          </span>
                          <span className="block text-xs text-gray-500 group-hover:text-gray-400">
                            {voice.gender}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black border-gray-800 text-white animate-in slide-in-from-right duration-300">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode("selection")}
          className="absolute left-4 top-4 text-gray-400 hover:text-white"
        >
          ← Indietro
        </Button>
        <CardTitle className="text-center text-xl font-light pt-2">
          Registra Campione Audio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 flex flex-col items-center p-8">
        {/* Visualizer / Mic Icon */}
        <div className="w-32 h-32 rounded-full bg-gray-900 border-2 border-dashed border-gray-700 flex items-center justify-center relative overflow-hidden transition-all duration-300">
          {isRecording ? (
            <div className="absolute inset-0 bg-red-900/20 animate-pulse flex items-center justify-center">
              <div className="w-16 h-1 bg-red-500 animate-[bounce_1s_infinite]" />
            </div>
          ) : (
            <Mic className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* Timer */}
        <div
          className={cn(
            "text-4xl font-mono transition-colors",
            timer > 0 && timer < 10 ? "text-yellow-500" : "text-gray-300",
            timer >= 10 && "text-green-500"
          )}
        >
          {formatTime(timer)}
        </div>

        {/* Requirements Warning */}
        {timer > 0 && timer < 10 && isRecording && (
          <p className="text-yellow-500 text-xs animate-pulse">
            Continua a parlare... (minimo 10s)
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        {/* Script */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 w-full text-center relative group">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-semibold">
            Leggi questo testo
          </p>
          <p className="text-lg text-gray-200 font-serif leading-relaxed">
            {READING_SCRIPT}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {!isRecording && !audioUrl && (
            <Button
              onClick={startRecording}
              className="bg-white text-black hover:bg-gray-200 w-full h-12 text-lg"
            >
              <Mic className="mr-2 h-5 w-5" /> Inizia Registrazione
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="animate-pulse w-full h-12 text-lg"
            >
              <Square className="mr-2 h-5 w-5" /> Stop Registrazione
            </Button>
          )}

          {!isRecording && audioUrl && (
            <div className="flex flex-col gap-4 w-full">
              <audio src={audioUrl} controls className="w-full" />
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Riprova
                </Button>
                <Button
                  onClick={handleConfirmRecording}
                  disabled={timer < 10}
                  className={cn(
                    "bg-purple-600 hover:bg-purple-700 transition-all",
                    timer < 10 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {timer < 10 ? `Minimo 10s` : "Usa questa voce"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
