
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Forward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SalesAnalysisPage() {
  const stats = [
    { value: "95%", label: "Précision de l'extraction de données (OCR)" },
    { value: "5h/sem", label: "Temps économisé sur la saisie manuelle" },
    { value: "20%", label: "Amélioration de la visibilité sur la rentabilité" },
  ];

  const benefits = [
    "Transformez des reçus manuscrits ou imprimés en données numériques en quelques secondes.",
    "Suivez automatiquement le poids net, le type de culture et la date de transaction.",
    "Visualisez vos performances de vente avec des graphiques clairs.",
    "Calculez automatiquement le poids net après tare pour une meilleure précision des revenus.",
  ];

  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image 
          src="https://picsum.photos/seed/sales/1200/800" 
          alt="Personne analysant des graphiques de ventes" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 z-0"
          data-ai-hint="sales charts analysis"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Analyse des Ventes Intelligente</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
            Arrêtez la saisie manuelle. Prenez une photo de vos documents de vente et laissez notre IA extraire les informations clés pour vous.
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
            <h2 className="text-3xl font-bold">De la photo aux profits, en un clic.</h2>
            <p className="text-muted-foreground text-lg">L'outil d'analyse des ventes de CropAI utilise une technologie OCR avancée pour lire n'importe quel document de vente, vous donnant une vision claire de vos revenus et de vos performances.</p>
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
                        Analyser mon premier reçu <Forward className="ml-2" />
                    </Button>
                </Link>
             </div>
        </div>
         <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-primary/10">
            <Image 
                src="https://picsum.photos/seed/sales-dashboard/800/600" 
                alt="Tableau de bord d'analyse des ventes dans CropAI"
                layout="fill"
                objectFit="cover"
                data-ai-hint="sales dashboard application"
            />
        </div>
      </section>
    </div>
  );
}
