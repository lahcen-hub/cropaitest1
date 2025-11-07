
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Forward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SoilAnalysisPage() {
  const stats = [
    { value: "92%", label: "Précision dans l'interprétation des rapports" },
    { value: "40%", label: "Réduction des coûts de fertilisation inutiles" },
    { value: "20%", label: "Amélioration de la santé du sol à long terme" },
  ];

  const benefits = [
    "Recevez une interprétation claire et simple de rapports de sol complexes.",
    "Obtenez un calendrier de fertilisation sur mesure pour corriger les carences et optimiser la croissance.",
    "Recevez un plan d'irrigation adapté à la texture et à la rétention d'eau de votre sol.",
    "Prenez des décisions basées sur des données scientifiques, pas sur des suppositions.",
  ];

  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image 
          src="https://picsum.photos/seed/soil/1200/800" 
          alt="Agronome analysant un échantillon de sol" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 z-0"
          data-ai-hint="soil sample analysis"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Analyse de Sol par l'IA</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
            Téléchargez votre rapport d'analyse de sol et laissez notre IA le traduire en un plan d'action concret pour votre ferme.
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
            <h2 className="text-3xl font-bold">Votre sol parle. Nous traduisons.</h2>
            <p className="text-muted-foreground text-lg">Ne soyez plus jamais confus par un rapport de laboratoire. CropAI décompose les données de pH, N-P-K et de texture en recommandations simples et exploitables que vous pouvez appliquer immédiatement.</p>
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
                        Analyser mon rapport de sol <Forward className="ml-2" />
                    </Button>
                </Link>
             </div>
        </div>
         <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-primary/10">
            <Image 
                src="https://picsum.photos/seed/soil-report/800/600" 
                alt="Tableau de bord d'analyse de sol dans CropAI"
                layout="fill"
                objectFit="cover"
                data-ai-hint="soil report dashboard"
            />
        </div>
      </section>
    </div>
  );
}
