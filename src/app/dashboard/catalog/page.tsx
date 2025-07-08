
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Construction, BookCopy } from "lucide-react";
import Image from "next/image";

export default function CatalogPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Product Catalog Management</CardTitle>
                    <CardDescription>
                        Upload, manage, and publish your product listings. This feature is coming soon.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <Construction className="h-4 w-4" />
                        <AlertTitle>Under Construction</AlertTitle>
                        <AlertDescription>
                            AI-powered catalog uploads and product management tools will be available here soon.
                        </AlertDescription>
                    </Alert>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                         <Image src="https://placehold.co/800x450.png" alt="Catalog placeholder" layout="fill" objectFit="cover" data-ai-hint="product catalog"/>
                         <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <div className="text-center p-4 bg-background/80 rounded-lg shadow-lg">
                                <BookCopy className="mx-auto h-12 w-12 text-primary"/>
                                <p className="mt-2 font-semibold text-foreground">Catalog management coming soon</p>
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
