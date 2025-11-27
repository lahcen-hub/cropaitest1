
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Forward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SoilAnalysisPage() {
  const stats = [
    { value: "92%", label: "Précision dans l'interprétation des rapports" },
    { value: "40%", label: "Réduction des coûts de fertilisation inutiles" },
    { value: "25%", label: "Optimisation de l'utilisation de l'eau" },
  ];

  const benefits = [
    "Recevez une interprétation claire et simple de rapports de sol et d'eau complexes.",
    "Obtenez un calendrier de fertilisation sur mesure qui tient compte de la composition de votre sol et de la qualité de votre eau.",
    "Recevez un plan d'irrigation adapté à la texture du sol et à la salinité de l'eau.",
    "Prenez des décisions basées sur une analyse croisée des données, pas sur des suppositions.",
  ];

  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image 
          src="https://picsum.photos/seed/soil/1200/800" 
          alt="Agronome analysant un échantillon de sol et d'eau" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 z-0"
          data-ai-hint="soil water sample analysis"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Analyse de Sol et d'Eau par l'IA</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
            Téléchargez vos rapports d'analyse de sol et d'eau, et laissez notre IA les traduire en un plan d'action intégré pour votre ferme.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-muted/40 p-8 rounded-lg">
              <p className="text-5xl font-extrabold text-primary">{stat.value}</p>
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="container py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Votre sol et votre eau parlent. Nous traduisons.</h2>
            <p className="text-muted-foreground text-lg">Ne soyez plus jamais confus par un rapport de laboratoire. CropAI combine les données de vos analyses de sol et d'eau pour créer des recommandations simples et exploitables que vous pouvez appliquer immédiatement.</p>
            <ul className="space-y-4">
                {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                        <div className="p-1 bg-primary/10 rounded-full mt-1">
                            <Check className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-muted-foreground flex-1">{benefit}</span>
                    </li>
                ))}
            </ul>
             <div className="pt-4">
                 <Link href="/signup">
                    <Button size="lg">
                        Analyser mes rapports <Forward className="ml-2" />
                    </Button>
                </Link>
             </div>
        </div>
         <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-primary/10">
            <Image 
                src="https://picsum.photos/seed/soil-report/800/600" 
                alt="Tableau de bord d'analyse de sol et d'eau dans CropAI"
                layout="fill"
                objectFit="cover"
                data-ai-hint="soil water dashboard"
            />
        </div>
      </section>
    </div>
  );
}
