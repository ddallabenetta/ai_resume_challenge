"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic,
  MicOff,
  AlertCircle,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import { useConversation } from "@elevenlabs/react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useAudioVisualizer } from "@/hooks/use-audio-visualizer";

interface PortfolioInterfaceProps {
  portfolio: any;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

export function PortfolioInterface({ portfolio }: PortfolioInterfaceProps) {
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => console.log("Connected to ElevenLabs"),
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message: any) => {
      const text = message.message || message.text;
      const role = message.source === "user" ? "user" : "ai";
      if (text) {
        setMessages((prev) => [...prev, { role, text }]);
      }
    },
    onError: (e) => {
      console.error("ElevenLabs Error", e);
      setError("Errore connessione voce");
    },
  });

  // Dynamic volume simulation
  const volume = useAudioVisualizer(conversation.isSpeaking);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/portfolio/${portfolio.slug}/token`);
      const data = await res.json();

      if (!data.signedUrl) {
        throw new Error(data.error || "Failed to get token");
      }

      await conversation.startSession({
        signedUrl: data.signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: portfolio.system_prompt,
            },
            firstMessage: "Ciao, sono " + portfolio.name,
          },
          tts: portfolio.voice_id
            ? {
                voiceId: portfolio.voice_id,
              }
            : undefined,
        },
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

  // Social Links helper
  const renderSocials = () => {
    const { socials } = portfolio;
    if (!socials) return null;
    const links = [];
    if (socials.linkedin)
      links.push({ name: "LinkedIn", url: socials.linkedin, icon: Linkedin });
    if (socials.github)
      links.push({ name: "GitHub", url: socials.github, icon: Github });
    if (socials.instagram)
      links.push({
        name: "Instagram",
        url: socials.instagram,
        icon: Instagram,
      });

    if (links.length === 0) return null;

    return (
      <div className="flex gap-4 mt-4 justify-center md:justify-start">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
            title={link.name}
          >
            <link.icon className="w-6 h-6" />
          </a>
        ))}
      </div>
    );
  };

  // Generate random animation delays for traits
  const traits = portfolio.traits || [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative overflow-hidden bg-black text-white font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-950/20 pointer-events-none" />

      {/* LEFT SIDE: Profile Info (Always Visible) */}
      <div className="w-full md:w-1/3 p-8 md:p-12 z-20 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 bg-black/40 backdrop-blur-md">
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-700">
          <div>
            <h2 className="text-gray-500 text-sm uppercase tracking-widest mb-1">
              Portfolio
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {portfolio.name}
            </h1>
            <div className="h-1 w-20 bg-purple-500 rounded-full"></div>
          </div>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 uppercase text-xs tracking-wider w-20">
                Classe
              </span>
              <span className="font-medium">
                {portfolio.birthDate
                  ? new Date(portfolio.birthDate).getFullYear()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 uppercase text-xs tracking-wider w-20">
                Base
              </span>
              <span className="font-medium">{portfolio.city}</span>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-gray-500 text-sm uppercase tracking-widest mb-3">
              Network
            </h3>
            {renderSocials() || (
              <p className="text-gray-600 text-sm italic">
                Nessun link disponibile
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Avatar & Interaction */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4">
        {/* Floating Traits Animation Container (Desktop Only) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
          {/* Limit traits to available positions to strictly prevent overlap */}
          {traits.slice(0, 15).map((trait: string, i: number) => {
            // Carefully mapped 15 zones to avoid:
            // 1. Center (Avatar)
            // 2. Bottom Center (Chat UI)
            // 3. Each other (Spread out)
            const positions = [
              // --- TOP ZONE ---
              { top: 8, left: 10, size: "lg", mobileHidden: false }, // Top-Left (Prominent)
              { top: 12, left: 85, size: "lg", mobileHidden: false }, // Top-Right (Prominent)
              { top: 5, left: 50, size: "sm", mobileHidden: true }, // Top-Center (High) - Hidden on mobile
              { top: 22, left: 20, size: "md", mobileHidden: true }, // Upper-Left-Inner - Hidden on mobile
              { top: 18, left: 70, size: "md", mobileHidden: true }, // Upper-Right-Inner - Hidden on mobile

              // --- MIDDLE ZONES (Flanking Avatar) ---
              // Squeeze these outwards on mobile
              { top: 35, left: 2, size: "sm", mobileHidden: false }, // Mid-High-Left (Edge)
              { top: 38, left: 95, size: "sm", mobileHidden: false }, // Mid-High-Right (Edge)
              { top: 50, left: 5, size: "lg", mobileHidden: false }, // Mid-Left (Prominent)
              { top: 52, left: 88, size: "lg", mobileHidden: false }, // Mid-Right (Prominent)

              // --- LOWER ZONES (Avoiding Chat in Center) ---
              { top: 68, left: 8, size: "md", mobileHidden: false }, // Low-Left
              { top: 65, left: 88, size: "md", mobileHidden: false }, // Low-Right
              { top: 82, left: 15, size: "sm", mobileHidden: true }, // Bottom-Left (Low) - Hidden on mobile
              { top: 78, left: 78, size: "sm", mobileHidden: true }, // Bottom-Right (Low) - Hidden on mobile
              // Extra fillers if needed
              { top: 28, left: 55, size: "xs", mobileHidden: true }, // Near Top-Right-Center (Small)
              { top: 30, left: 35, size: "xs", mobileHidden: true }, // Near Top-Left-Center (Small)
            ];

            // Safety fallback if i goes out of bounds (though slice prevents it)
            const config = positions[i % positions.length];

            // Size variants
            const sizeClasses = {
              lg: "text-base px-6 py-3 border-white/20 bg-white/10 md:z-10 z-0", // z-0 on mobile
              md: "text-sm px-4 py-2 border-white/10 bg-white/5 z-0",
              sm: "text-xs px-3 py-1.5 border-white/5 bg-white/5 text-purple-200/60 -z-10",
              xs: "text-[10px] px-2 py-1 border-white/5 bg-white/5 text-purple-300/40 -z-20",
            };

            return (
              <div
                key={i}
                className={`absolute flex items-center justify-center transition-all duration-1000 ease-out flex`}
                style={{
                  top: `${config.top}%`,
                  left: `${config.left}%`,
                }}
              >
                <div
                  className={`whitespace-nowrap backdrop-blur-md border rounded-full text-purple-100 shadow-lg ${
                    sizeClasses[config.size as keyof typeof sizeClasses]
                  }`}
                  style={{
                    animation: `float-random-${(i % 3) + 1} ${
                      8 + (i % 5)
                    }s ease-in-out infinite`,
                    animationDelay: `${i * 1.5}s`,
                  }}
                >
                  {trait}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global CSS for Animations */}
        <style jsx global>{`
          @keyframes float-random-1 {
            0%,
            100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(10px, -15px) rotate(2deg);
            }
            66% {
              transform: translate(-5px, 10px) rotate(-1deg);
            }
          }
          @keyframes float-random-2 {
            0%,
            100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(-10px, 15px) rotate(-2deg);
            }
            66% {
              transform: translate(5px, -10px) rotate(1deg);
            }
          }
          @keyframes float-random-3 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(0, -20px);
            }
          }
          /* TALKING ANIMATION */
          @keyframes speak-pulse {
            0% {
              transform: scale(1);
              filter: brightness(1);
            }
            50% {
              transform: scale(1.03);
              filter: brightness(1.1);
            }
            100% {
              transform: scale(1);
              filter: brightness(1);
            }
          }
          .animate-speaking {
            animation: speak-pulse 0.4s ease-in-out infinite;
          }
          .speaking-glow {
            animation: glow-pulse 1.5s ease-in-out infinite alternate;
          }
          @keyframes glow-pulse {
            from {
              box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
              opacity: 0.5;
            }
            to {
              box-shadow: 0 0 60px rgba(168, 85, 247, 0.8);
              opacity: 1;
            }
          }
        `}</style>

        {/* Avatar Area */}
        <div className="relative w-48 h-48 md:w-80 md:h-80 mx-auto z-10 mb-8">
          {/* Active Speaker Glow */}
          <div
            className={`absolute inset-0 rounded-full bg-purple-500/30 blur-[60px] transition-all duration-75`}
            style={{
              opacity: conversation.isSpeaking ? 0.5 + volume * 0.8 : 0.2, // More range
              transform: `scale(${1 + volume * 0.5})`, // Much bigger glow expansion
            }}
          />

          <div
            className={`relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden shadow-2xl transition-all duration-75`}
            style={{
              transform: `scale(${1 + volume * 0.15})`, // Increased bounce (from 0.05 to 0.15)
              borderColor: conversation.isSpeaking
                ? `rgba(168,85,247, ${0.6 + volume * 0.6})`
                : "rgba(255,255,255,0.1)",
              filter: `brightness(${1 + volume * 0.3})`, // Increased brightness flare
            }}
          >
            <img
              src={portfolio.photo_url}
              alt={portfolio.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Status Rings */}
          {isConnecting && (
            <div className="absolute inset-0 -m-2 rounded-full border-2 border-yellow-500/50 animate-spin-slow" />
          )}
          {isConnected && (
            <div
              className="absolute inset-0 -m-2 rounded-full border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-opacity duration-300"
              style={{ opacity: conversation.isSpeaking ? 1 : 0.3 }}
            />
          )}
        </div>

        {/* Status Text */}
        <div className="h-8 mb-8 z-10">
          {error ? (
            <div className="flex items-center justify-center gap-2 text-red-400 bg-red-900/20 px-4 py-1 rounded-full border border-red-900/50">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          ) : (
            <p className="text-sm text-purple-200/60 uppercase tracking-widest font-medium animate-pulse">
              {isConnected
                ? conversation.isSpeaking
                  ? "Sta parlando..."
                  : "Ti ascolto..."
                : "Digital Twin Ready"}
            </p>
          )}
        </div>

        {/* Interaction Button */}
        <div className="z-10 relative mb-8">
          {!isConnected ? (
            <Button
              size="lg"
              className="rounded-full h-16 pl-8 pr-10 text-lg bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] group"
              onClick={toggleConversation}
              disabled={isConnecting}
            >
              <div className="bg-black/10 p-2 rounded-full mr-4 group-hover:bg-black/20 transition-colors">
                <Mic className="w-6 h-6" />
              </div>
              {isConnecting ? "Connessione..." : "Parla con me"}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="destructive"
              className="rounded-full h-16 w-16 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all hover:scale-110"
              onClick={toggleConversation}
            >
              <MicOff className="w-8 h-8" />
            </Button>
          )}
        </div>

        {/* Mobile Static Traits List */}
        <div className="md:hidden flex flex-wrap gap-2 justify-center px-6 mb-20 z-10 relative">
          {traits.map((trait: string, i: number) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-purple-100/80 backdrop-blur-sm"
            >
              {trait}
            </div>
          ))}
        </div>

        {/* Real-time Transcription Overlay */}
        {(isConnected || messages.length > 0) && (
          <div className="absolute bottom-6 left-4 right-4 md:left-12 md:right-12 z-20 pointer-events-none flex justify-center">
            <div className="w-full max-w-xl bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-4 pointer-events-auto shadow-2xl overflow-hidden masking-gradient">
              <ScrollArea className="h-32 w-full pr-2">
                <div className="space-y-3">
                  {messages.length === 0 && (
                    <p className="text-gray-500 text-center italic text-sm py-4">
                      La conversazione apparirà qui...
                    </p>
                  )}
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-purple-600 text-white rounded-br-none"
                            : "bg-gray-800 text-gray-200 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
