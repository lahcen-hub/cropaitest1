import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarDays, HeartPulse, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      title: "Plant Doctor",
      description: "Snap a photo of a sick plant and get an instant diagnosis and treatment plan from our AI.",
      icon: HeartPulse,
      href: "/plant-doctor-guest",
      cta: "Try Now for Free",
    },
    {
      title: "Smart Farm Calendar",
      description: "Receive a personalized irrigation and fertilization schedule based on your crops, location, and weather.",
      icon: CalendarDays,
      href: "/signup",
      cta: "Sign Up to Use",
    },
    {
      title: "Resource Finder",
      description: "Locate nearby agricultural suppliers, cooperatives, and support offices with ease.",
      icon: Map,
      href: "/signup",
      cta: "Sign Up to Use",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-4">
            <Link href="/signup">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter">
              The Future of Farming, Today.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              CropAI is your personal smart farm assistant. Get AI-powered insights to increase your yield, reduce waste, and manage your farm with confidence.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button size="lg">Get Started for Free</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-80 lg:h-full w-full rounded-xl overflow-hidden shadow-2xl">
             <Image 
                src="https://placehold.co/800x600.png" 
                alt="Modern farming technology" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="modern farming"
              />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-muted/50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Smart Farming Made Simple</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to optimize your farm's productivity, all in one platform.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-background flex flex-col">
                  <CardHeader>
                    <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mb-2">
                        <feature.icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                   <CardFooter>
                     <Link href={feature.href} className="w-full">
                        <Button className="w-full" variant={feature.href === "/plant-doctor-guest" ? "default" : "outline"}>
                            {feature.cta}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
            <div className="container text-center">
                 <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to grow smarter?</h2>
                 <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of farmers revolutionizing their operations with CropAI. Create your profile in minutes.
                 </p>
                 <div className="mt-8">
                     <Link href="/signup">
                        <Button size="lg">
                            Start Your Smart Farm
                            <ArrowRight className="ml-2"/>
                        </Button>
                     </Link>
                 </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Logo />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} CropAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
