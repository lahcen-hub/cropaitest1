
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Forward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CalendarsPage() {
  const stats = [
    { value: "30%", label: "Réduction du gaspillage d'eau" },
    { value: "25%", label: "Optimisation de l'utilisation d'engrais" },
    { value: "15%", label: "Augmentation du rendement des cultures" },
  ];

  const benefits = [
    "Cycles de culture optimisés pour des récoltes plus rapides.",
    "Instructions hebdomadaires claires, de la plantation à la récolte.",
    "Recommandations basées sur le type de culture, la surface et la localisation.",
    "S'adapte intelligemment à vos données d'analyse de sol.",
  ];

  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image 
          src="https://picsum.photos/seed/calendar/1200/800" 
          alt="Champ de blé au coucher du soleil" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 z-0"
          data-ai-hint="wheat field sunset"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Calendriers de Culture Personnalisés</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
            Ne laissez plus rien au hasard. Obtenez un plan d'irrigation et de fertilisation sur mesure, généré par l'IA pour maximiser votre rendement.
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
            <h2 className="text-3xl font-bold">Votre feuille de route vers une récolte parfaite.</h2>
            <p className="text-muted-foreground text-lg">CropAI analyse les besoins uniques de votre ferme pour créer des calendriers dynamiques qui vous guident à chaque étape. Fini les approximations, place à l'agriculture de précision.</p>
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
                        Générer mon premier calendrier <Forward className="ml-2" />
                    </Button>
                </Link>
             </div>
        </div>
         <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-primary/10">
            <Image 
                src="https://picsum.photos/seed/calendar-view/800/600" 
                alt="Vue du calendrier dans l'application CropAI"
                layout="fill"
                objectFit="cover"
                data-ai-hint="calendar application view"
            />
        </div>
      </section>
    </div>
  );
}
