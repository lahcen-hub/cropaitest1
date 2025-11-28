
"use client";

import { useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { ArrowRight, CalendarDays, HeartPulse, Map, TrendingUp, Store, BookCopy, Inbox, FlaskConical, Sprout, Weight, Box, PlusCircle, Truck, Receipt, Users, TrendingDown, DollarSign, LineChart } from "lucide-react";
import Link from "next/link";
import { CROP_EMOJI_MAP } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


function OperationalKPIs() {
    const { sales } = useFarmProfile();

    const kpis = useMemo(() => {
        if (!sales || sales.length === 0) {
            return {
                totalBoxes: 0,
                totalQuantity: 0,
                topCrop: 'N/A',
            };
        }

        let totalQuantity = 0;
        let totalBoxes = 0;
        const cropQuantities: { [key: string]: number } = {};

        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (item.quantity) {
                    totalQuantity += item.quantity;
                    if(item.cropName) {
                       cropQuantities[item.cropName] = (cropQuantities[item.cropName] || 0) + item.quantity;
                    }
                }
                if (item.boxCount) {
                    totalBoxes += item.boxCount;
                }
            });
        });
        
        const topCrop = Object.keys(cropQuantities).length > 0 
            ? Object.entries(cropQuantities).sort((a, b) => b[1] - a[1])[0][0] 
            : 'N/A';

        return {
            totalBoxes,
            totalQuantity,
            topCrop,
        };
    }, [sales]);

    const kpiCards = [
        { title: "Total de Caisses Vendues", value: kpis.totalBoxes.toFixed(0), icon: Box, description: "Total de caisses brutes vendues." },
        { title: "Quantité Totale Vendue", value: `${kpis.totalQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg`, icon: Weight, description: "Somme brute de toutes les ventes en kilogrammes." },
        { title: "Culture la Plus Vendue", value: kpis.topCrop, icon: Sprout, description: "Meilleure performance par quantité brute." },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Aperçu Opérationnel</h2>
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

function FinancialKPIs() {
    const { sales, invoices } = useFarmProfile();

    const kpis = useMemo(() => {
        const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
        const totalExpenses = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
        const netProfit = totalRevenue - totalExpenses;

        return {
            totalRevenue,
            totalExpenses,
            netProfit
        };
    }, [sales, invoices]);

    const kpiCards = [
        { id: "revenue", title: "Chiffre d'Affaires Brut", value: kpis.totalRevenue, icon: DollarSign, description: "Revenu total de toutes les ventes." },
        { id: "expenses", title: "Total des Charges", value: kpis.totalExpenses, icon: TrendingDown, description: "Total des dépenses enregistrées." },
        { id: "profit", title: "Bénéfice Net", value: kpis.netProfit, icon: LineChart, description: "Différence entre les revenus et les charges." },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Aperçu Financier</h2>
            <div className="grid gap-6 md:grid-cols-3">
                {kpiCards.map(kpi => (
                     <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-2xl font-bold", {
                                "text-destructive": kpi.id === 'profit' && kpi.value < 0,
                                "text-primary": kpi.id === 'profit' && kpi.value >= 0,
                            })}>
                                {kpi.value.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' })}
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
    const router = useRouter();

    const farmerFeatureCards = [
        { title: "Analyse des Ventes", description: "Suivez les ventes et analysez les revenus à partir de documents.", href: "/dashboard/sales-intelligence", icon: TrendingUp, cta: "Analyser les Ventes" },
        { title: "Analyse des Factures", description: "Suivez les dépenses en téléchargeant des factures et des reçus.", href: "/dashboard/invoice-intelligence", icon: Receipt, cta: "Analyser les Factures" },
        { title: "Gestion des Employés", description: "Gérez votre personnel, leurs rôles et leurs informations.", href: "/dashboard/employees", icon: Users, cta: "Gérer les Employés" },
        { title: "Docteur des Plantes", description: "Diagnostiquez les maladies des plantes en téléchargeant une photo.", href: "/dashboard/plant-doctor", icon: HeartPulse, cta: "Diagnostiquer une Plante" },
        { title: "Analyse de Sol", description: "Téléchargez un rapport de sol pour un plan personnalisé.", href: "/dashboard/soil-analysis", icon: FlaskConical, cta: "Analyser le Sol" },
        { title: "Calendrier Agricole", description: "Obtenez un calendrier personnalisé pour vos cultures.", href: "/dashboard/farm-calendar", icon: CalendarDays, cta: "Générer un Calendrier" },
    ];

    const technicianFeatureCards = [
        { title: "Docteur des Plantes", description: "Diagnostiquez les maladies des plantes en télécharge-ant une photo.", href: "/dashboard/plant-doctor", icon: HeartPulse, cta: "Diagnostiquer une Plante" },
        { title: "Calendrier Agricole", description: "Obtenez un calendrier personnalisé pour les cultures.", href: "/dashboard/farm-calendar", icon: CalendarDays, cta: "Générer un Calendrier" },
        { title: "Marché", description: "Parcourez les produits des fournisseurs agricoles.", href: "/dashboard/marketplace", icon: Store, cta: "Parcourir les Produits" },
        { title: "Ressources à Proximité", description: "Trouvez des ressources comme des fournisseurs et des bureaux.", href: "/dashboard/nearby", icon: Map, cta: "Trouver des Ressources" }
    ];
    
    const supplierFeatureCards = [
        { title: "Catalogue de Produits", description: "Gérez vos listes de produits et votre inventaire.", href: "/dashboard/catalog", icon: BookCopy, cta: "Gérer le Catalogue" },
        { title: "Messages & Commandes", description: "Consultez les demandes et les commandes des clients.", href: "/dashboard/messages", icon: Inbox, cta: "Voir la Boîte de Réception" },
        { title: "Ressources à Proximité", description: "Découvrez d'autres entreprises agricoles près de chez vous.", href: "/dashboard/nearby", icon: Map, cta: "Trouver des Ressources" },
    ];
    
    const navItems = useMemo(() => {
        const role = profile?.role;
        if (role === 'farmer') return farmerFeatureCards.map(f => ({ href: f.href, label: f.title }));
        if (role === 'technician') return technicianFeatureCards.map(f => ({ href: f.href, label: f.title }));
        if (role === 'supplier') return supplierFeatureCards.map(f => ({ href: f.href, label: f.title }));
        return [];
    }, [profile?.role]);

    useEffect(() => {
        // Prefetch all navigation links to make page transitions faster
        navItems.forEach(item => {
        router.prefetch(item.href);
        });
    }, [navItems, router]);


    let featureCards = [];
    let welcomeMessage = "Bienvenue !";
    let profileDetails = null;
    let welcomeDescription = "Votre assistant agricole intelligent est prêt à vous aider à optimiser votre rendement et à gérer votre ferme efficacement.";

    if (profile?.role === 'farmer') {
        featureCards = farmerFeatureCards;
        welcomeMessage = `Bienvenue, Agriculteur !`;
        profileDetails = (
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span><strong className="font-medium text-foreground">Cultures :</strong> <span className="capitalize">{profile.crops.map(crop => `${CROP_EMOJI_MAP[crop.toLowerCase()] || ''} ${crop}`).join(', ')}</span></span>
                    <span><strong className="font-medium text-foreground">Superficie :</strong> {profile?.surfaceArea} Hectares</span>
                    <span><strong className="font-medium text-foreground">Localisation :</strong> {profile?.locationName || "Non définie"}</span>
                </div>
                 <div className="flex items-center justify-between">
                    <Link href="/dashboard/sales-intelligence">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Les Ventes
                        </Button>
                    </Link>
                    <Link href="/dashboard/invoice-intelligence">
                        <Button variant="destructive">
                           <PlusCircle className="mr-2 h-4 w-4" />
                           Les Factures
                        </Button>
                    </Link>
                 </div>
            </div>
        );
    } else if (profile?.role === 'technician') {
        featureCards = technicianFeatureCards;
        welcomeMessage = `Bienvenue, Technicien !`;
        welcomeDescription = "Prêt à aider les agriculteurs ? Utilisez vos outils pour diagnostiquer les problèmes et créer des plans."
        profileDetails = (
             <p className="mt-4 text-sm text-muted-foreground"><strong className="font-medium text-foreground">Localisation :</strong> {profile?.locationName || "Non définie"}</p>
        );
    } else if (profile?.role === 'supplier') {
        featureCards = supplierFeatureCards;
        welcomeMessage = `Bienvenue, ${profile?.companyName || 'Fournisseur'} !`;
        welcomeDescription = "Gérez votre catalogue de produits et connectez-vous avec les clients."
         profileDetails = (
            <p className="mt-4 text-sm text-muted-foreground"><strong className="font-medium text-foreground">Localisation :</strong> {profile?.locationName || "Non définie"}</p>
        );
    }


    return (
        <div className="flex flex-col gap-8">
            <Card className="overflow-hidden relative border-0 shadow-lg bg-gradient-to-br from-primary/20 via-primary/5 to-background">
                <div className="p-6 md:p-10 flex flex-col justify-center z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{welcomeMessage}</h1>
                    <p className="mt-2 text-muted-foreground max-w-2xl">{welcomeDescription}</p>
                    {profileDetails && (
                        <div className="mt-6">
                            {profileDetails}
                        </div>
                    )}
                </div>
            </Card>

            {profile?.role === 'farmer' && (
                <div className="space-y-8">
                    <FinancialKPIs />
                    <OperationalKPIs />
                </div>
            )}
            
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Vos Outils</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

    

    
