"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Send, User, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface InterviewChatProps {
  onInterviewComplete: (history: Message[]) => void;
}

export function InterviewChat({ onInterviewComplete }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ciao! Sono Claude. Ti intervisterò per costruire il tuo gemello digitale. Iniziamo dal tuo background. Di cosa ti occupi attualmente e cosa ti appassiona di più nel tuo lavoro?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });

      const data = await response.json();

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: data.message,
          },
        ]);

        // In a real app, the backend would signal "interview_complete"
        // For MVP demo, lets complete after 5 messages or a specific keyword
        if (messages.length > 6) {
          // onInterviewComplete(messages); // Uncomment to auto-complete
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    onInterviewComplete(messages);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto rounded-xl border border-gray-800 bg-black overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-medium text-white">Interview with Claude</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white"
          onClick={handleFinish}
        >
          Finish & Generate &rarr;
        </Button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        ref={scrollRef}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
              max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
              ${
                m.role === "user"
                  ? "bg-purple-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-200 rounded-bl-sm"
              }
            `}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-900/30 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="bg-black/50 border-gray-700 text-white focus:ring-purple-500"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-white text-black hover:bg-gray-200"
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-gray-700 text-gray-400"
          >
            <Mic className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
