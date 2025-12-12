import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mic, Sparkles, User } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium backdrop-blur-sm">
              Hackathon Ready MVP
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50 pb-2">
            Crea il tuo <br />
            <span className="text-purple-400">Gemello AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
            Basta inviare portfolio statici. Crea un agente conversazionale che
            parla con la tua voce, racconta le tue storie e ti rappresenta 24/7.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-all font-semibold group"
              >
                Crea il mio Gemello
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 text-left">
            <FeatureCard
              icon={<Mic className="w-6 h-6 text-purple-400" />}
              title="Voce Nativa"
              description="Clona la tua voce così i visitatori possono parlare davvero con il tuo portfolio."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-blue-400" />}
              title="Intelligente"
              description="Potenziato da Claude 4.5 per rispondere a domande sulla tua esperienza."
            />
            <FeatureCard
              icon={<User className="w-6 h-6 text-pink-400" />}
              title="Personalizzato"
              description="Genera un system prompt basato su un'intervista approfondita."
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <CardContent className="p-6 space-y-4">
        <div className="p-3 rounded-lg bg-white/5 w-fit">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
