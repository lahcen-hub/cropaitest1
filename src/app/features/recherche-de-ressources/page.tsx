
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Forward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResourcesPage() {
  const stats = [
    { value: "1000+", label: "Fournisseurs et coopératives répertoriés" },
    { value: "50%", label: "Réduction du temps de recherche de contacts" },
    { value: "N°1", label: "Annuaire agricole local" },
  ];

  const benefits = [
    "Trouvez instantanément les fournisseurs de semences, d'engrais et d'outils les plus proches.",
    "Localisez les coopératives agricoles et les bureaux de conseil dans votre région.",
    "Accédez aux informations de contact et aux heures d'ouverture en un clic.",
    "Prenez des décisions d'achat plus éclairées en comparant les options locales.",
  ];

  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image 
          src="https://picsum.photos/seed/map/1200/800" 
          alt="Carte montrant des points d'intérêt agricoles" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 z-0"
          data-ai-hint="map points interest"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Recherche de Ressources à Proximité</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
            Tout ce dont vous avez besoin, à portée de main. Trouvez des fournisseurs, des coopératives et des experts agricoles près de chez vous.
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
            <h2 className="text-3xl font-bold">Votre réseau agricole local, cartographié.</h2>
            <p className="text-muted-foreground text-lg">Fini les recherches interminables. Notre carte interactive vous connecte à l'écosystème agricole local, vous faisant gagner du temps et de l'argent.</p>
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
                        Trouver des ressources <Forward className="ml-2" />
                    </Button>
                </Link>
             </div>
        </div>
         <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-primary/10">
            <Image 
                src="https://picsum.photos/seed/map-view/800/600" 
                alt="Vue de la carte dans l'application CropAI"
                layout="fill"
                objectFit="cover"
                data-ai-hint="map application view"
            />
        </div>
      </section>
    </div>
  );
}
