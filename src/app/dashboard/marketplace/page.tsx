
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
                    <CardTitle>Marketplace</CardTitle>
                    <CardDescription>
                        Find and order agricultural products from suppliers. This feature is coming soon.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <Construction className="h-4 w-4" />
                        <AlertTitle>Under Construction</AlertTitle>
                        <AlertDescription>
                            A searchable marketplace of supplier products will be available here soon.
                        </AlertDescription>
                    </Alert>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                         <Image src="https://placehold.co/800x450.png" alt="Marketplace placeholder" layout="fill" objectFit="cover" data-ai-hint="market products"/>
                         <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <div className="text-center p-4 bg-background/80 rounded-lg shadow-lg">
                                <Store className="mx-auto h-12 w-12 text-primary"/>
                                <p className="mt-2 font-semibold text-foreground">Marketplace coming soon</p>
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
