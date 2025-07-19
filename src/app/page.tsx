import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, HeartPulse, Map, TestTube2, TrendingUp, Users, Check, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      title: "AI Plant Doctor",
      description: "Snap a photo of a sick plant and get an instant diagnosis and treatment plan from our AI.",
      icon: HeartPulse,
      href: "/plant-doctor-guest",
      cta: "Try Now for Free",
      variant: "default"
    },
    {
      title: "Personalized Calendars",
      description: "Receive irrigation and fertilization schedules based on your specific crops, location, and even soil analysis reports.",
      icon: CalendarDays,
      href: "/signup",
      cta: "Sign Up to Use",
       variant: "outline"
    },
    {
      title: "Sales Intelligence",
      description: "Turn photos of handwritten receipts into actionable data. Track sales, analyze trends, and see your net profits.",
      icon: TrendingUp,
      href: "/signup",
      cta: "Sign Up to Use",
       variant: "outline"
    },
    {
      title: "Soil Analysis",
      description: "Upload a soil report to get a detailed breakdown and a customized fertilization plan for your farm.",
      icon: TestTube2,
      href: "/signup",
      cta: "Sign Up to Use",
      variant: "outline"
    },
    {
      title: "Resource Finder",
      description: "Locate nearby agricultural suppliers, cooperatives, and support offices with an interactive map.",
      icon: Map,
      href: "/signup",
      cta: "Sign Up to Use",
       variant: "outline"
    },
     {
      title: "Community & Marketplace",
      description: "Connect with other farmers, technicians, and suppliers. Buy and sell products in a trusted environment.",
      icon: Users,
      href: "/signup",
      cta: "Sign Up to Use",
       variant: "outline"
    },
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "For individual farmers wanting to try the core features.",
      features: [
        "5 AI Plant Doctor diagnoses/month",
        "2 AI Farm Calendar generations/month",
        "10 Sales Intelligence uploads/month",
        "Marketplace Access"
      ],
      cta: "Get Started for Free",
      variant: "outline",
      popular: false
    },
    {
      name: "Farmer Pro",
      price: "$19",
      period: "/month",
      description: "For professional farmers who rely on the app daily.",
      features: [
        "Everything in Starter, plus:",
        "Unlimited AI Diagnoses",
        "Unlimited AI Calendars & Soil Analysis",
        "Unlimited Sales Intelligence",
        "Advanced Analytics",
        "Priority Support"
      ],
      cta: "Start Pro Trial",
      variant: "default",
      popular: true
    },
    {
      name: "Agri-Business",
      price: "Custom",
      period: "",
      description: "For suppliers, technicians, and large operations.",
      features: [
        "Everything in Farmer Pro, plus:",
        "Multi-User Accounts",
        "Product Catalog & Order Management",
        "Custom Branding",
        "Dedicated Onboarding & Support"
      ],
      cta: "Contact Sales",
      variant: "outline",
      popular: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
             <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
             <Link href="/plant-doctor-guest" className="text-muted-foreground transition-colors hover:text-foreground">Demo</Link>
             <Link href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/signup">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-2 gap-10 items-center py-20 md:py-28">
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground/80">
              The Future of Farming is in Your Hands
            </h1>
            <p className="max-w-prose text-lg md:text-xl text-muted-foreground">
              CropAI is the all-in-one platform that brings cutting-edge AI technology to your farm. Boost yields, diagnose problems instantly, and manage your business smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/30">Start Your Free Trial</Button>
              </Link>
               <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore Features</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-80 lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border-4 border-primary/10">
             <Image 
                src="https://placehold.co/800x600.png" 
                alt="A farmer using a tablet in a modern, healthy field" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="futuristic farming"
                className="transform hover:scale-105 transition-transform duration-500 ease-in-out"
              />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-muted/40">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-balance">Your Complete Smart Farming Toolkit</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From planting to profit, CropAI provides the tools you need to succeed in modern agriculture.
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

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-28">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-balance">Find the Perfect Plan for Your Farm</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start for free and scale as you grow. All plans include access to our community and support.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
                {pricingTiers.map((tier) => (
                    <div key={tier.name} className={`relative flex flex-col rounded-2xl border p-8 shadow-lg ${tier.popular ? 'border-primary' : 'border-border'}`}>
                        {tier.popular && (
                            <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                            </div>
                        )}
                        <h3 className="text-2xl font-bold">{tier.name}</h3>
                        <p className="mt-2 text-muted-foreground">{tier.description}</p>
                        <div className="mt-6">
                            <span className="text-5xl font-extrabold">{tier.price}</span>
                            <span className="text-lg font-medium text-muted-foreground">{tier.period}</span>
                        </div>
                        <ul className="mt-8 space-y-4 flex-grow">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                         <Link href="/signup" className="mt-8">
                            <Button size="lg" className="w-full" variant={tier.variant as any}>
                                {tier.cta}
                            </Button>
                         </Link>
                    </div>
                ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-muted/40">
            <div className="container text-center">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-balance">Ready to Transform Your Farm?</h2>
                 <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of farmers revolutionizing their operations with CropAI. Create your profile in minutes and unlock the future of agriculture.
                 </p>
                 <div className="mt-8">
                     <Link href="/signup">
                        <Button size="lg" className="shadow-lg shadow-primary/20">
                            Start Your Smart Farm Today
                            <ArrowRight className="ml-2"/>
                        </Button>
                     </Link>
                 </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <Logo />
                  <p className="text-sm text-muted-foreground mt-2">© {new Date().getFullYear()} CropAI</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Product</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                    <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                    <li><Link href="/signup" className="text-muted-foreground hover:text-foreground">Sign Up</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Company</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                  </ul>
                </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

    
