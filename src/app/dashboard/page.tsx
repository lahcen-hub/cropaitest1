
"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { ArrowRight, CalendarDays, HeartPulse, Map, TrendingUp, Store, BookCopy, Inbox, FlaskConical, Sprout, Weight, Box, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CROP_EMOJI_MAP, CROP_BOX_WEIGHTS } from "@/lib/types";

function FarmerKPIs() {
    const { sales } = useFarmProfile();

    const kpis = useMemo(() => {
        if (!sales || sales.length === 0) {
            return {
                totalNetBoxes: 0,
                totalNetQuantity: 0,
                topCrop: 'N/A',
            };
        }

        let totalNetQuantity = 0;
        let totalNetBoxes = 0;
        const cropQuantities: { [key: string]: number } = {};

        sales.forEach(sale => {
            sale.items.forEach(item => {
                let itemNetQuantity = item.quantity; // Default to gross if not kg or no box weight
                if(item.unit.toLowerCase() === 'kg') {
                    const boxWeight = CROP_BOX_WEIGHTS[item.cropName.toLowerCase()];
                    if (boxWeight) {
                        // Assuming tare weight is 3kg, net item weight is calculated
                        const numBoxes = item.quantity / boxWeight;
                        const totalTareWeight = numBoxes * 3;
                        itemNetQuantity = item.quantity - totalTareWeight;
                        
                        totalNetBoxes += itemNetQuantity / boxWeight;
                    }
                }
                totalNetQuantity += itemNetQuantity;
                cropQuantities[item.cropName] = (cropQuantities[item.cropName] || 0) + item.quantity; // Top crop is still based on gross
            });
        });

        const topCrop = Object.entries(cropQuantities).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

        return {
            totalNetBoxes: totalNetBoxes,
            totalNetQuantity: totalNetQuantity,
            topCrop: topCrop,
        };
    }, [sales]);

    const kpiCards = [
        { title: "Total Net Boxes Sold", value: kpis.totalNetBoxes.toFixed(2), icon: Box, description: "Total boxes sold after tare weight." },
        { title: "Total Net Quantity Sold", value: `${kpis.totalNetQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg`, icon: Weight, description: "Sum of all net sales in kilograms." },
        { title: "Top Selling Crop", value: kpis.topCrop, icon: Sprout, description: "Best performing crop by gross quantity." },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Your Farm At a Glance</h2>
            <div className="grid gap-6 md:grid-cols-3">
                {kpiCards.map(kpi => (
                     <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold capitalize">
                                {kpi.value === kpis.topCrop && CROP_EMOJI_MAP[kpis.topCrop.toLowerCase()] ? `${CROP_EMOJI_MAP[kpis.topCrop.toLowerCase()]} ` : ''}
                                {kpi.value}
                            </div>
                            <p className="text-xs text-muted-foreground">{kpi.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}


export default function DashboardPage() {
    const { profile } = useFarmProfile();

    const farmerFeatureCards = [
        { title: "Sales Intelligence", description: "Track sales and analyze revenue from documents.", href: "/dashboard/sales-intelligence", icon: TrendingUp, cta: "Analyze Sales" },
        { title: "Plant Doctor", description: "Diagnose plant diseases by uploading a photo.", href: "/dashboard/plant-doctor", icon: HeartPulse, cta: "Diagnose Plant" },
        { title: "Soil Analysis", description: "Upload a soil report for a custom plan.", href: "/dashboard/soil-analysis", icon: FlaskConical, cta: "Analyze Soil" },
        { title: "Farm Calendar", description: "Get a personalized schedule for your crops.", href: "/dashboard/farm-calendar", icon: CalendarDays, cta: "Generate Calendar" },
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
    let welcomeDescription = "Your smart farm assistant is ready to help you optimize your yield and manage your farm efficiently.";

    if (profile?.role === 'farmer') {
        featureCards = farmerFeatureCards;
        welcomeMessage = `Welcome back, Farmer!`;
        profileDetails = (
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span><strong className="font-medium text-foreground">Crops:</strong> <span className="capitalize">{profile.crops.map(crop => `${CROP_EMOJI_MAP[crop.toLowerCase()] || ''} ${crop}`).join(', ')}</span></span>
                    <span><strong className="font-medium text-foreground">Area:</strong> {profile?.surfaceArea} Hectares</span>
                    <span><strong className="font-medium text-foreground">Location:</strong> {profile?.locationName || "Not set"}</span>
                </div>
                 <Link href="/dashboard/sales-intelligence">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Today's Sales
                    </Button>
                </Link>
            </div>
        );
    } else if (profile?.role === 'technician') {
        featureCards = technicianFeatureCards;
        welcomeMessage = `Welcome back, Technician!`;
        welcomeDescription = "Ready to assist farmers? Use your tools to diagnose problems and create plans."
        profileDetails = (
             <p className="mt-4 text-sm text-muted-foreground"><strong className="font-medium text-foreground">Location:</strong> {profile?.locationName || "Not set"}</p>
        );
    } else if (profile?.role === 'supplier') {
        featureCards = supplierFeatureCards;
        welcomeMessage = `Welcome back, ${profile?.companyName || 'Supplier'}!`;
        welcomeDescription = "Manage your product catalog and connect with customers."
         profileDetails = (
            <p className="mt-4 text-sm text-muted-foreground"><strong className="font-medium text-foreground">Location:</strong> {profile?.locationName || "Not set"}</p>
        );
    }


    return (
        <div className="flex flex-col gap-8">
            <Card className="overflow-hidden relative border-0 shadow-lg bg-gradient-to-br from-primary/20 via-primary/5 to-background">
                <div className="p-8 md:p-10 flex flex-col justify-center z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{welcomeMessage}</h1>
                    <p className="mt-2 text-muted-foreground max-w-2xl">{welcomeDescription}</p>
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

            {profile?.role === 'farmer' && <FarmerKPIs />}
            
            <div>
                <h2 className="text-2_xl font-bold tracking-tight mb-4">Your Tools</h2>
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
        </div>
    );
}
