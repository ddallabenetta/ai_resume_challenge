"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  Send,
  Sparkles,
  CheckCircle2,
  Circle,
  Trophy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface InterviewChatProps {
  onInterviewComplete: (history: Message[]) => void;
}

const TOPICS_LIST = [
  "IDENTITÀ PROFESSIONALE",
  "ESPERIENZA CHIAVE",
  "ABILITÀ UNICHE",
  "FALLIMENTO FORMATIVO",
  "DIMENSIONE PERSONALE",
  "VALORI & STILE",
];

interface ExtractedData {
  identity: { role: string; passion: string; current_focus: string };
  key_project: { name: string; challenge: string; pride_point: string };
  unique_abilities: {
    exceptional_at: string;
    differentiator: string;
    main_anti_skill: string;
  };
  formative_failure: { what: string; lesson: string };
  personal_dimension: {
    passions: string[];
    hobbies: string[];
    significant_travels: string[];
  };
  values_and_style: {
    ideal_team: string;
    work_style: string;
    motivates: string;
  };
}

interface InterviewState {
  progress: number;
  completed_topics: string[];
  extracted_data: ExtractedData | null;
  extracted_facts_display: string[]; // Computed for display
  is_complete: boolean;
}

export function InterviewChat({ onInterviewComplete }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ciao! Sono Vitae. Ti intervisterò per costruire il tuo gemello digitale. Iniziamo dal tuo background. Di cosa ti occupi attualmente?",
    },
  ]);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    progress: 0,
    completed_topics: [],
    extracted_data: null,
    extracted_facts_display: [],
    is_complete: false,
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (interviewState.is_complete) {
      // Add a small delay for effect before finishing
      setTimeout(() => {
        onInterviewComplete(messages);
      }, 1500);
    }
  }, [interviewState.is_complete]);

  const computeDisplayFacts = (data: ExtractedData): string[] => {
    const facts: string[] = [];
    if (data?.identity?.role) facts.push(data.identity.role);
    if (data?.identity?.passion)
      facts.push("Passione: " + data.identity.passion);
    if (data?.unique_abilities?.exceptional_at)
      facts.push("Superpotere: " + data.unique_abilities.exceptional_at);
    if (data?.values_and_style?.work_style)
      facts.push("Stile: " + data.values_and_style.work_style);
    if (data?.personal_dimension?.passions?.length > 0)
      facts.push("Interessi: " + data.personal_dimension.passions[0]);
    return facts.slice(0, 6); // Limit to 6
  };

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

        // Update Interview State if present
        if (typeof data.progress === "number") {
          const newData = data.extracted_data || interviewState.extracted_data;
          setInterviewState({
            progress: data.progress,
            completed_topics: data.current_area
              ? [...interviewState.completed_topics, data.current_area]
              : interviewState.completed_topics, // Logic might be improved if API sends completed list
            extracted_data: newData,
            extracted_facts_display: newData
              ? computeDisplayFacts(newData)
              : [],
            is_complete: data.is_complete || false,
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] w-full mx-auto rounded-xl border border-gray-800 bg-black overflow-hidden shadow-2xl flex-col lg:flex-row">
      {/* LEFT COLUMN: CHAT */}
      <div className="flex-1 flex flex-col border-r-0 lg:border-r border-gray-800 h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">Interview with Vitae</span>
          </div>
          {/* Mobile Progress Indicator */}
          <div className="lg:hidden flex items-center gap-2 text-xs text-gray-400">
            <span>{interviewState.progress}%</span>
            <Progress
              value={interviewState.progress}
              className="w-16 h-1.5 bg-gray-800"
            />
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0"
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
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-purple-600 text-white rounded-br-sm"
                    : "bg-gray-800 text-gray-200 rounded-bl-sm"
                }`}
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
        <div className="p-4 bg-gray-900/30 border-t border-gray-800 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setInput(e.target.value)
              }
              placeholder="Scrivi la tua risposta..."
              className="bg-black/50 border-gray-700 text-white focus:ring-purple-500 min-h-[44px] max-h-[120px] resize-none"
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-white text-black hover:bg-gray-200 h-[44px]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: DASHBOARD (Hidden on mobile, visible on desktop) */}
      <div className="hidden lg:flex w-80 bg-gray-900/20 p-6 flex-col gap-8 overflow-y-auto text-left h-full">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-gray-300">
            <span>Completamento</span>
            <span>{interviewState.progress}%</span>
          </div>
          <Progress
            value={interviewState.progress}
            className="h-2 bg-purple-900/50"
          />
        </div>

        {/* Topics Checklist */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
            Argomenti
          </h3>
          <div className="space-y-3">
            {TOPICS_LIST.map((topic) => {
              const isDone = interviewState.completed_topics.includes(topic);
              return (
                <div
                  key={topic}
                  className={`flex items-center gap-3 ${
                    isDone ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isDone ? "text-white" : ""
                    }`}
                  >
                    {topic}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DNA Extraction */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
              Tratti Rilevati
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {interviewState.extracted_facts_display.length === 0 && (
              <p className="text-xs text-gray-600 italic">
                In attesa di dati...
              </p>
            )}
            {interviewState.extracted_facts_display.map((fact, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-purple-900/30 text-purple-200 border-purple-500/20 hover:bg-purple-900/50 animate-in zoom-in-50 duration-300"
              >
                {fact}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
