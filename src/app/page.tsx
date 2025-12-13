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
        <div className="text-center max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter pb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400">
                Mirror
              </span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600">
                Vitae
              </span>
            </h1>

            <p className="text-2xl md:text-3xl font-light text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Il tuo Gemello Digitale, <br className="md:hidden" /> elevato
              dall'AI.
            </p>

            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Racconta la tua storia, condividi la tua voce e lasciati
              rappresentare da un'intelligenza artificiale che impara da te.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="h-16 px-10 text-xl rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] group"
              >
                Inizia Ora
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-24 text-left animate-in fade-in duration-1000 delay-500">
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-purple-400" />}
              title="Voce Autentica"
              description="La tua voce clonata con precisione per un'esperienza conversazionale naturale e coinvolgente."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-blue-400" />}
              title="Intelligenza Reale"
              description="Potenziato da modelli AI avanzati per comprendere il contesto e rispondere con la tua personalità."
            />
            <FeatureCard
              icon={<User className="w-8 h-8 text-pink-400" />}
              title="Identità Unica"
              description="Un profilo costruito sulle tue esperienze, competenze e storie personali."
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
