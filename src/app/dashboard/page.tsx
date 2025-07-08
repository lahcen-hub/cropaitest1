
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { ArrowRight, CalendarDays, HeartPulse, Map, TrendingUp, Store, BookCopy, Inbox } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
    const { profile } = useFarmProfile();

    const farmerFeatureCards = [
        { title: "Plant Doctor", description: "Upload a photo to diagnose plant diseases and get treatment advice.", href: "/dashboard/plant-doctor", icon: HeartPulse, cta: "Diagnose Plant" },
        { title: "Farm Calendar", description: "Get a personalized irrigation and fertilization schedule for your crops.", href: "/dashboard/farm-calendar", icon: CalendarDays, cta: "Generate Calendar" },
        { title: "Sales Intelligence", description: "Track sales, analyze revenue, and gain insights from your sales documents.", href: "/dashboard/sales-intelligence", icon: TrendingUp, cta: "Analyze Sales" },
        { title: "Marketplace", description: "Browse and order products from agricultural suppliers.", href: "/dashboard/marketplace", icon: Store, cta: "Browse Products" }
    ];

    const technicianFeatureCards = [
        { title: "Plant Doctor", description: "Upload a photo to diagnose plant diseases and get treatment advice.", href: "/dashboard/plant-doctor", icon: HeartPulse, cta: "Diagnose Plant" },
        { title: "Farm Calendar", description: "Get a personalized irrigation and fertilization schedule for your crops.", href: "/dashboard/farm-calendar", icon: CalendarDays, cta: "Generate Calendar" },
        { title: "Marketplace", description: "Browse products from agricultural suppliers.", href: "/dashboard/marketplace", icon: Store, cta: "Browse Products" },
        { title: "Nearby Resources", description: "Find suppliers, cooperatives, and agricultural offices near you.", href: "/dashboard/nearby", icon: Map, cta: "Find Resources" }
    ];
    
    const supplierFeatureCards = [
        { title: "Product Catalog", description: "Manage your product listings, including AI-powered catalog uploads.", href: "/dashboard/catalog", icon: BookCopy, cta: "Manage Catalog" },
        { title: "Messages & Orders", description: "View and respond to inquiries and orders from farmers and technicians.", href: "/dashboard/messages", icon: Inbox, cta: "View Inbox" },
        { title: "Nearby Resources", description: "See other agricultural businesses and resources in your area.", href: "/dashboard/nearby", icon: Map, cta: "Find Resources" },
    ];

    let featureCards = [];
    let welcomeMessage = "Welcome back!";
    let profileDetails = null;

    if (profile?.role === 'farmer') {
        featureCards = farmerFeatureCards;
        welcomeMessage = `Welcome back, Farmer!`;
        profileDetails = (
            <>
                <li><span className="font-medium text-foreground">Crops:</span> {profile?.crops.join(", ")}</li>
                <li><span className="font-medium text-foreground">Area:</span> {profile?.surfaceArea} Hectares</li>
                <li><span className="font-medium text-foreground">Location:</span> {profile?.locationName || "Not set"}</li>
            </>
        );
    } else if (profile?.role === 'technician') {
        featureCards = technicianFeatureCards;
        welcomeMessage = `Welcome back, Technician!`;
        profileDetails = (
             <li><span className="font-medium text-foreground">Location:</span> {profile?.locationName || "Not set"}</li>
        );
    } else if (profile?.role === 'supplier') {
        featureCards = supplierFeatureCards;
        welcomeMessage = `Welcome back, ${profile?.companyName || 'Supplier'}!`;
         profileDetails = (
            <li><span className="font-medium text-foreground">Location:</span> {profile?.locationName || "Not set"}</li>
        );
    }


    return (
        <div className="flex flex-col gap-8">
            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                        <h1 className="text-3xl font-bold font-headline text-foreground">{welcomeMessage}</h1>
                        <p className="mt-2 text-muted-foreground">Your smart farm assistant is ready to help you optimize your yield and manage your farm efficiently.</p>
                        {profileDetails && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-foreground">Your Profile:</h3>
                                <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                                    {profileDetails}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="relative h-64 md:h-full min-h-[250px]">
                        <Image src="https://placehold.co/600x400.png" alt="Farm illustration" layout="fill" objectFit="cover" data-ai-hint={profile?.role === 'supplier' ? 'warehouse distribution' : 'farm tractor'}/>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {featureCards.map((feature) => (
                    <Card key={feature.title} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="font-headline">{feature.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <CardDescription>{feature.description}</CardDescription>
                        </CardContent>
                        <CardContent>
                             <Link href={feature.href}>
                                <Button className="w-full" variant="outline">
                                    {feature.cta}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
