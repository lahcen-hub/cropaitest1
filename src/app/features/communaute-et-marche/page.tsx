
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Forward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  const stats = [
    { value: "10k+", label: "Membres actifs dans la communauté" },
    { value: "500+", label: "Produits disponibles sur le marché" },
    { value: "N°1", label: "Réseau agricole de confiance" },
  ];

  const benefits = [
    "Posez des questions et partagez votre expérience avec d'autres agriculteurs.",
    "Achetez des semences, des engrais et des outils directement auprès de fournisseurs vérifiés.",
    "Vendez vos propres produits à un public plus large.",
    "Recevez des offres exclusives et des conseils d'experts de l'industrie.",
  ];

  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image 
          src="https://picsum.photos/seed/community/1200/800" 
          alt="Agriculteurs discutant dans un champ" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 z-0"
          data-ai-hint="farmers talking field"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Communauté & Marché</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
            Connectez-vous. Échangez. Prospérez. Rejoignez un réseau d'agriculteurs, de techniciens et de fournisseurs qui partagent votre passion.
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
            <h2 className="text-3xl font-bold">Plus forts, ensemble.</h2>
            <p className="text-muted-foreground text-lg">CropAI n'est pas seulement un outil, c'est un écosystème. Notre communauté et notre marché intégrés vous permettent d'apprendre des meilleurs, d'acheter en toute confiance et de vendre plus efficacement.</p>
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
                        Rejoindre la communauté <Forward className="ml-2" />
                    </Button>
                </Link>
             </div>
        </div>
         <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-primary/10">
            <Image 
                src="https://picsum.photos/seed/marketplace-app/800/600" 
                alt="Vue du marché dans l'application CropAI"
                layout="fill"
                objectFit="cover"
                data-ai-hint="marketplace app view"
            />
        </div>
      </section>
    </div>
  );
}
