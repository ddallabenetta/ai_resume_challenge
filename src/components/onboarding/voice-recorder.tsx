"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, RotateCcw, Upload } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

const SCRIPTS = [
  "Ciao, mi chiamo [Tuo Nome] e sono uno sviluppatore software. Amo creare soluzioni innovative.",
  "Il successo non è la chiave della felicità. La felicità è la chiave del successo. Se ami ciò che fai, avrai successo.",
  "Nel mezzo delle difficoltà nascono le opportunità. Sono sempre alla ricerca di nuove sfide professionali.",
  "La logica ti porterà da A a B. L'immaginazione ti porterà ovunque. Questo è il mio approccio al design.",
  "Non ho fallito. Ho scoperto 10.000 modi che non funzionano. La perseveranza è la mia forza più grande.",
];

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [script] = useState(
    () => SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)]
  );

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
        const blob = new Blob(chunksRef.current, { type: "audio/webm" }); // webm is standard for Chrome/Firefox
        setRecordingBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(
        "Could not access microphone. Please ensure permission is granted."
      );
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
  };

  const handleConfirm = () => {
    if (recordingBlob) {
      onRecordingComplete(recordingBlob);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-center text-xl font-light">
          Registra Campione Audio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gray-900 border-2 border-dashed border-gray-700 flex items-center justify-center relative overflow-hidden">
          {isRecording ? (
            <div className="absolute inset-0 bg-red-900/20 animate-pulse flex items-center justify-center">
              <div className="w-16 h-1 bg-red-500 animate-[bounce_1s_infinite]" />
            </div>
          ) : (
            <Mic className="w-12 h-12 text-gray-400" />
          )}
        </div>

        <div className="text-3xl font-mono text-gray-300">
          {formatTime(timer)}
        </div>

        <div className="flex gap-4">
          {!isRecording && !audioUrl && (
            <Button
              onClick={startRecording}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Mic className="mr-2 h-4 w-4" /> Inizia Registrazione
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="animate-pulse"
            >
              <Square className="mr-2 h-4 w-4" /> Stop Registrazione
            </Button>
          )}

          {!isRecording && audioUrl && (
            <div className="flex flex-col gap-4 w-full">
              <audio src={audioUrl} controls className="w-full" />
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Riprova
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Upload className="mr-2 h-4 w-4" /> Usa questa voce
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 w-full text-center">
          <p className="text-sm text-gray-500 mb-2 uppercase tracking-widest">
            Leggi questa frase
          </p>
          <p className="text-lg text-white font-serif italic">
            &quot;{script}&quot;
          </p>
        </div>

        <p className="text-xs text-center text-gray-500 max-w-xs">
          Premi registra e leggi la frase qui sopra. Questo ci aiuterà a clonare
          la tua voce.
        </p>
      </CardContent>
    </Card>
  );
}
