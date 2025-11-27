
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, HeartPulse, Map, TestTube2, TrendingUp, Users, Check, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      title: "Docteur des Plantes IA",
      description: "Prenez une photo d'une plante malade et obtenez un diagnostic instantané et un plan de traitement de notre IA.",
      icon: HeartPulse,
      href: "/plant-doctor-guest",
      cta: "Essayez Gratuitement",
      variant: "default"
    },
    {
      title: "Calendriers Personnalisés",
      description: "Recevez des calendriers d'irrigation et de fertilisation basés sur vos cultures, votre emplacement et même vos rapports d'analyse de sol.",
      icon: CalendarDays,
      href: "/features/calendriers-personnalises",
      cta: "En savoir plus",
       variant: "outline"
    },
    {
      title: "Analyse des Ventes",
      description: "Transformez des photos de reçus manuscrits en données exploitables. Suivez les ventes, analysez les tendances et voyez vos bénéfices nets.",
      icon: TrendingUp,
      href: "/features/analyse-de-ventes",
      cta: "En savoir plus",
       variant: "outline"
    },
    {
      title: "Analyse de Sol et Eau",
      description: "Téléchargez vos rapports de sol et d'eau. Notre IA combine ces informations pour créer un plan de fertilisation et d'irrigation ultra-personnalisé.",
      icon: TestTube2,
      href: "/features/analyse-de-sol",
      cta: "En savoir plus",
      variant: "outline"
    },
    {
      title: "Recherche de Ressources",
      description: "Localisez les fournisseurs agricoles, les coopératives et les bureaux de soutien à proximité avec une carte interactive.",
      icon: Map,
      href: "/features/recherche-de-ressources",
      cta: "En savoir plus",
       variant: "outline"
    },
     {
      title: "Communauté & Marché",
      description: "Connectez-vous avec d'autres agriculteurs, techniciens et fournisseurs. Achetez et vendez des produits dans un environnement de confiance.",
      icon: Users,
      href: "/features/communaute-et-marche",
      cta: "En savoir plus",
       variant: "outline"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
             <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">Fonctionnalités</Link>
             <Link href="/plant-doctor-guest" className="text-muted-foreground transition-colors hover:text-foreground">Démo</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/signup">
              <Button variant="ghost">Se Connecter</Button>
            </Link>
            <Link href="/signup">
              <Button>Commencer</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container grid lg:grid-cols-5 gap-10 items-center py-20 md:py-28">
          <div className="lg:col-span-3 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground/80">
              L'Avenir de l'Agriculture est entre Vos Mains
            </h1>
            <p className="max-w-prose text-lg md:text-xl text-muted-foreground">
              CropAI est la plateforme tout-en-un qui apporte la technologie IA de pointe à votre ferme. Augmentez les rendements, diagnostiquez les problèmes instantanément et gérez votre entreprise plus intelligemment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/30">Commencez Votre Essai Gratuit</Button>
              </Link>
               <Link href="/#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Découvrir les Fonctionnalités</Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 relative h-80 lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border-4 border-primary/10">
             <Image 
                src="https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBhaXxlbnwwfHx8fDE3NjI2NDA2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Un agriculteur utilisant une tablette dans un champ moderne et sain" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="futuristic farming"
                className="transform hover:scale-105 transition-transform duration-500 ease-in-out"
              />
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-muted/40">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-balance">Votre Boîte à Outils Complète pour une Agriculture Intelligente</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                De la plantation au profit, CropAI fournit les outils dont vous avez besoin pour réussir dans l'agriculture moderne.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16">
              {features.map((feature) => (
                <div key={feature.title} className="bg-card flex flex-col p-6 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mb-4">
                      <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow mb-4">{feature.description}</p>
                   <Link href={feature.href}>
                      <Button className="w-full justify-between" variant={feature.variant as any}>
                          {feature.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-muted/40">
            <div className="container text-center">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-balance">Prêt à Transformer Votre Ferme ?</h2>
                 <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Rejoignez des milliers d'agriculteurs qui révolutionnent leurs opérations avec CropAI. Créez votre profil en quelques minutes et débloquez l'avenir de l'agriculture.
                 </p>
                 <div className="mt-8">
                     <Link href="/signup">
                        <Button size="lg" className="shadow-lg shadow-primary/20">
                            Démarrez Votre Ferme Intelligente Aujourd'hui
                            <ArrowRight className="ml-2"/>
                        </Button>
                     </Link>
                 </div>
            </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container py-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <Logo />
                  <p className="text-sm text-muted-foreground mt-2">© {new Date().getFullYear()} CropAI</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Produit</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Fonctionnalités</Link></li>
                    <li><Link href="/signup" className="text-muted-foreground hover:text-foreground">S'inscrire</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Entreprise</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">À Propos</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Carrières</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Légal</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Politique de Confidentialité</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Conditions d'Utilisation</Link></li>
                  </ul>
                </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
    

    
