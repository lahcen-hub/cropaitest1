
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Construction, Store } from "lucide-react";
import Image from "next/image";

export default function MarketplacePage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Marché</CardTitle>
                    <CardDescription>
                        Trouvez et commandez des produits agricoles auprès de fournisseurs. Cette fonctionnalité sera bientôt disponible.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <Construction className="h-4 w-4" />
                        <AlertTitle>En Construction</AlertTitle>
                        <AlertDescription>
                            Un marché consultable de produits de fournisseurs sera bientôt disponible ici.
                        </AlertDescription>
                    </Alert>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                         <Image src="https://placehold.co/800x450.png" alt="Espace réservé pour le marché" layout="fill" objectFit="cover" data-ai-hint="market products"/>
                         <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <div className="text-center p-4 bg-background/80 rounded-lg shadow-lg">
                                <Store className="mx-auto h-12 w-12 text-primary"/>
                                <p className="mt-2 font-semibold text-foreground">Marché bientôt disponible</p>
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
