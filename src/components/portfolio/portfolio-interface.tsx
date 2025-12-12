"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface PortfolioInterfaceProps {
  portfolio: any;
}

export function PortfolioInterface({ portfolio }: PortfolioInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("idle");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Audio state
  const recognition = useRef<any>(null);

  useEffect(() => {
    // Auto scroll
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Init Speech Recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const r = new SpeechRecognition();
      r.continuous = false;
      r.interimResults = false;
      r.lang = "it-IT";

      r.onstart = () => {
        setStatus("listening");
        setIsListening(true);
      };

      r.onend = () => {
        setIsListening(false);
        if (status === "listening") setStatus("processing");
      };

      r.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        await handleUserMessage(transcript);
      };

      recognition.current = r;
    }
  }, []);

  const handleUserMessage = async (text: string) => {
    setStatus("processing");

    // Add user message
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // 1. Get Text Response
      const chatRes = await fetch(`/api/portfolio/${portfolio.slug}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const chatData = await chatRes.json();
      const aiText = chatData.message;

      // Add AI message
      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
      setStatus("speaking");

      // 2. Get Audio
      const speechRes = await fetch(`/api/portfolio/${portfolio.slug}/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiText, voice_id: portfolio.voice_id }),
      });

      if (speechRes.ok) {
        const audioBlob = await speechRes.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          setStatus("idle");
        };

        await audio.play();
      } else {
        setStatus("idle");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
    } else {
      if (recognition.current) {
        recognition.current.start();
      } else {
        alert(
          "Speech recognition not supported in this browser. Please use Chrome."
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-black text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />

      <div className="z-10 text-center space-y-8 max-w-2xl w-full">
        {/* Avatar Area */}
        <div className="relative w-64 h-64 mx-auto">
          {/* Glow effect */}
          <div
            className={`absolute inset-0 rounded-full bg-purple-500/20 blur-3xl transition-opacity duration-500 ${
              isSpeaking ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`relative w-full h-full rounded-full border-4 border-white/10 overflow-hidden shadow-2xl transition-transform duration-300 ${
              isSpeaking ? "scale-105" : "scale-100"
            }`}
          >
            <img
              src={portfolio.photo_url}
              alt={portfolio.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Speaking Ring */}
          {isSpeaking && (
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/50 animate-ping" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">
            {portfolio.name}
          </h1>
          <p className="text-xl text-gray-400 font-light">AI Digital Twin</p>
        </div>

        {/* Chat History */}
        <div
          className="h-64 overflow-y-auto px-4 py-2 space-y-4 scroll-smooth"
          ref={scrollRef}
        >
          {messages.length === 0 && (
            <p className="text-gray-600 italic mt-10">
              Premi il microfono per iniziare una conversazione...
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-lg ${
                  m.role === "user"
                    ? "bg-white/10 text-white rounded-br-none"
                    : "bg-purple-900/40 text-purple-100 rounded-bl-none border border-purple-500/20"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 fixed bottom-10 left-0 right-0">
          <Button
            size="lg"
            className={`rounded-full h-20 w-20 shadow-[0_0_40px_-5px_rgba(168,85,247,0.4)] transition-all duration-300 ${
              isListening
                ? "bg-red-500 hover:bg-red-600 scale-110 animate-pulse"
                : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={toggleListening}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>

          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium h-4">
            {status === "idle" ? "Pronto ad ascoltare" : status}
          </p>
        </div>
      </div>
    </div>
  );
}
