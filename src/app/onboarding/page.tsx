"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VoiceRecorder } from "@/components/onboarding/voice-recorder";
import { PhotoUploader } from "@/components/onboarding/photo-uploader";
import { InterviewChat, Message } from "@/components/onboarding/interview-chat";
import {
  PersonalInfoForm,
  PersonalInfoData,
} from "@/components/onboarding/personal-info-form";
import { Progress } from "@/components/ui/progress";

type Step =
  | "personal-info"
  | "voice"
  | "photo"
  | "interview"
  | "review"
  | "success";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("personal-info");
  const [progress, setProgress] = useState(10);
  const router = useRouter();

  // Data Store
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData | null>(
    null
  );
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePersonalInfoComplete = (data: PersonalInfoData) => {
    setPersonalInfo(data);
    setStep("voice");
    setProgress(30);
  };

  const handleVoiceComplete = async (blob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", blob);

    try {
      const res = await fetch("/api/onboarding/voice", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.voice_id) {
        setVoiceId(data.voice_id);
        setStep("photo");
        setProgress(50);
      } else {
        console.error("Voice upload failed", data);
        alert("Errore caricamento voce: " + (data.error || "Sconosciuto"));
      }
    } catch (e) {
      console.error(e);
      alert("Errore di connessione");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceSkip = () => {
    setVoiceId(null);
    setStep("photo");
    setProgress(50);
  };

  const handlePhotoSelected = async (file: File) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/onboarding/photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setPhotoUrl(data.url);
        setStep("interview");
        setProgress(70);
      } else {
        alert("Errore caricamento foto");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhotoSkip = () => {
    setPhotoUrl(null);
    setStep("interview");
    setProgress(70);
  };

  const handleInterviewComplete = async (history: Message[]) => {
    setStep("success");
    setProgress(90);
    setIsProcessing(true);

    try {
      // 1. Generate Prompt & Extract Name (keeping this for now, but we have the name)
      // We might still want to extract professional traits or refine the system prompt based on interview
      const promptRes = await fetch("/api/onboarding/generate-prompt", {
        method: "POST",
        body: JSON.stringify({
          history,
          personalInfo: personalInfo || {},
        }),
      });
      const promptData = await promptRes.json();

      // 2. Create Portfolio
      const createRes = await fetch("/api/onboarding/create-portfolio", {
        method: "POST",
        body: JSON.stringify({
          name: personalInfo?.fullName || promptData.name || "Utente", // Prefer form data
          birthDate: personalInfo?.birthDate,
          city: personalInfo?.city,
          socials: personalInfo?.socials,
          system_prompt: promptData.system_prompt,
          traits: promptData.traits,
          history,
          voice_id: voiceId,
          photo_url: photoUrl,
        }),
      });

      const createData = await createRes.json();

      if (createData.slug) {
        setProgress(100);
        setTimeout(() => {
          router.push(`/portfolio/${createData.slug}`);
        }, 2000);
      } else {
        alert("Errore creazione portfolio");
        setStep("interview"); // Go back
      }
    } catch (e) {
      console.error(e);
      alert("Errore generazione");
      setStep("interview");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400 uppercase tracking-wider">
            <span>Setup Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-gray-900" />
        </div>

        {isProcessing && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <span className="ml-4 text-purple-400 font-mono">
              Elaborazione in corso...
            </span>
          </div>
        )}

        <div className="pt-8">
          {step === "personal-info" && (
            <PersonalInfoForm onComplete={handlePersonalInfoComplete} />
          )}

          {step === "voice" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-light">
                  Inizializza Modello Vocale
                </h1>
                <p className="text-gray-400">
                  Registra un campione audio per dare la tua voce al gemello.
                </p>
              </div>
              <VoiceRecorder
                onRecordingComplete={handleVoiceComplete}
                onSkip={handleVoiceSkip}
              />
            </div>
          )}

          {step === "photo" && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-light">Carica Avatar</h1>
              <PhotoUploader
                onPhotoSelected={handlePhotoSelected}
                onSkip={handlePhotoSkip}
              />
            </div>
          )}

          {step === "interview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-light">Fase Intervista</h1>
                <p className="text-gray-400">
                  Parla con Vitae per estrarre il tuo DNA professionale.
                </p>
              </div>
              <InterviewChat onInterviewComplete={handleInterviewComplete} />
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 py-10">
              <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="text-4xl font-bold">Tutto Pronto!</h1>
              <p className="text-gray-400">
                Il tuo gemello AI è in fase di generazione... Verrai
                reindirizzato a breve.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
