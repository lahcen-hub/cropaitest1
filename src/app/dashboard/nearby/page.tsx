"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Construction } from "lucide-react";
import Image from "next/image";

export default function NearbyResourcesPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Nearby Resources</CardTitle>
                    <CardDescription>
                        Find agricultural resources in your area. This feature is coming soon.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <Construction className="h-4 w-4" />
                        <AlertTitle>Under Construction</AlertTitle>
                        <AlertDescription>
                            An interactive map showing suppliers, cooperatives, and offices will be available here soon.
                        </AlertDescription>
                    </Alert>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                         <Image src="https://placehold.co/800x450.png" alt="Map placeholder" layout="fill" objectFit="cover" data-ai-hint="map location"/>
                         <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <div className="text-center p-4 bg-background/80 rounded-lg shadow-lg">
                                <MapPin className="mx-auto h-12 w-12 text-primary"/>
                                <p className="mt-2 font-semibold text-foreground">Map feature coming soon</p>
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
