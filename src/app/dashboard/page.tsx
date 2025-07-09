
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { ArrowRight, CalendarDays, HeartPulse, Map, TrendingUp, Store, BookCopy, Inbox, FlaskConical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
    const { profile } = useFarmProfile();

    const farmerFeatureCards = [
        { title: "Plant Doctor", description: "Diagnose plant diseases by uploading a photo.", href: "/dashboard/plant-doctor", icon: HeartPulse, cta: "Diagnose Plant" },
        { title: "Farm Calendar", description: "Get a personalized schedule for your crops.", href: "/dashboard/farm-calendar", icon: CalendarDays, cta: "Generate Calendar" },
        { title: "Soil Analysis", description: "Upload a soil report for a custom plan.", href: "/dashboard/soil-analysis", icon: FlaskConical, cta: "Analyze Soil" },
        { title: "Sales Intelligence", description: "Track sales and analyze revenue from documents.", href: "/dashboard/sales-intelligence", icon: TrendingUp, cta: "Analyze Sales" },
    ];

    const technicianFeatureCards = [
        { title: "Plant Doctor", description: "Diagnose plant diseases by uploading a photo.", href: "/dashboard/plant-doctor", icon: HeartPulse, cta: "Diagnose Plant" },
        { title: "Farm Calendar", description: "Get a personalized schedule for crops.", href: "/dashboard/farm-calendar", icon: CalendarDays, cta: "Generate Calendar" },
        { title: "Marketplace", description: "Browse products from agricultural suppliers.", href: "/dashboard/marketplace", icon: Store, cta: "Browse Products" },
        { title: "Nearby Resources", description: "Find resources like suppliers and offices.", href: "/dashboard/nearby", icon: Map, cta: "Find Resources" }
    ];
    
    const supplierFeatureCards = [
        { title: "Product Catalog", description: "Manage your product listings and inventory.", href: "/dashboard/catalog", icon: BookCopy, cta: "Manage Catalog" },
        { title: "Messages & Orders", description: "View inquiries and orders from customers.", href: "/dashboard/messages", icon: Inbox, cta: "View Inbox" },
        { title: "Nearby Resources", description: "See other agricultural businesses near you.", href: "/dashboard/nearby", icon: Map, cta: "Find Resources" },
    ];

    let featureCards = [];
    let welcomeMessage = "Welcome back!";
    let profileDetails = null;

    if (profile?.role === 'farmer') {
        featureCards = farmerFeatureCards;
        welcomeMessage = `Welcome back, Farmer!`;
        profileDetails = (
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
                <span><strong className="font-medium text-foreground">Crops:</strong> {profile?.crops.join(", ")}</span>
                <span><strong className="font-medium text-foreground">Area:</strong> {profile?.surfaceArea} Hectares</span>
                <span><strong className="font-medium text-foreground">Location:</strong> {profile?.locationName || "Not set"}</span>
            </div>
        );
    } else if (profile?.role === 'technician') {
        featureCards = technicianFeatureCards;
        welcomeMessage = `Welcome back, Technician!`;
        profileDetails = (
             <p className="mt-4 text-sm text-muted-foreground"><strong className="font-medium text-foreground">Location:</strong> {profile?.locationName || "Not set"}</p>
        );
    } else if (profile?.role === 'supplier') {
        featureCards = supplierFeatureCards;
        welcomeMessage = `Welcome back, ${profile?.companyName || 'Supplier'}!`;
         profileDetails = (
            <p className="mt-4 text-sm text-muted-foreground"><strong className="font-medium text-foreground">Location:</strong> {profile?.locationName || "Not set"}</p>
        );
    }


    return (
        <div className="flex flex-col gap-8">
            <Card className="overflow-hidden relative border-0 shadow-lg bg-gradient-to-br from-primary/20 via-primary/5 to-background">
                <div className="p-8 md:p-10 flex flex-col justify-center z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{welcomeMessage}</h1>
                    <p className="mt-2 text-muted-foreground max-w-2xl">Your smart farm assistant is ready to help you optimize your yield and manage your farm efficiently.</p>
                    {profileDetails && (
                        <div className="mt-6">
                            {profileDetails}
                        </div>
                    )}
                </div>
                 <div className="absolute -right-20 -bottom-20 opacity-10 hidden md:block">
                    <Image src="https://placehold.co/400x400.png" alt="Farm illustration" width={400} height={400} data-ai-hint={profile?.role === 'supplier' ? 'warehouse distribution' : 'farm tractor'} className="grayscale" />
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featureCards.map((feature) => (
                    <Card key={feature.title} className="flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardHeader>
                            <div className="p-3 rounded-full bg-primary/10 text-primary w-fit">
                                <feature.icon className="w-6 h-6" />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                            <CardDescription className="mt-2">{feature.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                             <Link href={feature.href} className="w-full">
                                <Button className="w-full" variant="secondary">
                                    {feature.cta}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
