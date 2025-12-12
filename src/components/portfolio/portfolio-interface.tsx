"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useConversation } from "@elevenlabs/react";

interface PortfolioInterfaceProps {
  portfolio: any;
}

export function PortfolioInterface({ portfolio }: PortfolioInterfaceProps) {
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => console.log("Connected to ElevenLabs"),
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message) => console.log("Message:", message),
    onError: (e) => {
      console.error("ElevenLabs Error", e);
      setError("Errore connessione voce");
    },
  });

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      // 1. Get Signed URL from our backend
      const res = await fetch(`/api/portfolio/${portfolio.slug}/token`);
      const data = await res.json();

      if (!data.signedUrl) {
        throw new Error(data.error || "Failed to get token");
      }

      // 2. Start Conversation with signed URL
      await conversation.startSession({
        signedUrl: data.signedUrl,
      });
    } catch (e) {
      console.error(e);
      setError("Impossibile connettersi");
    }
  }, [conversation, portfolio.slug]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const toggleConversation = () => {
    if (conversation.status === "connected") {
      stopConversation();
    } else {
      startConversation();
    }
  };

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-black text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />

      <div className="z-10 text-center space-y-8 max-w-2xl w-full">
        {/* Avatar Area */}
        <div className="relative w-64 h-64 mx-auto">
          {/* Glow effect based on volume */}
          <div
            className={`absolute inset-0 rounded-full bg-purple-500/20 blur-3xl transition-opacity duration-100`}
            style={{
              opacity: conversation.isSpeaking ? 1 : 0,
            }}
          />

          <div
            className={`relative w-full h-full rounded-full border-4 border-white/10 overflow-hidden shadow-2xl transition-transform duration-300 ${
              conversation.isSpeaking ? "scale-105" : "scale-100"
            }`}
          >
            <img
              src={portfolio.photo_url}
              alt={portfolio.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Connection Ring */}
          {isConnecting && (
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500/50 animate-pulse" />
          )}
          {isConnected && (
            <div className="absolute inset-0 rounded-full border-4 border-green-500/30" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">
            {portfolio.name}
          </h1>
          <p className="text-xl text-gray-400 font-light">AI Digital Twin</p>
        </div>

        {/* Status / Error */}
        <div className="h-8">
          {error ? (
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 animate-pulse">
              {isConnected
                ? conversation.isSpeaking
                  ? "Parlando..."
                  : "In ascolto..."
                : "Premi per connetterti"}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 fixed bottom-10 left-0 right-0">
          <Button
            size="lg"
            disabled={isConnecting}
            className={`rounded-full h-20 w-20 shadow-[0_0_40px_-5px_rgba(168,85,247,0.4)] transition-all duration-300 ${
              isConnected
                ? "bg-red-500 hover:bg-red-600 scale-110"
                : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={toggleConversation}
          >
            {isConnected ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>

          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
            {isConnecting
              ? "Connessione..."
              : isConnected
              ? "Connesso"
              : "Disconnesso"}
          </p>
        </div>
      </div>
    </div>
  );
}
