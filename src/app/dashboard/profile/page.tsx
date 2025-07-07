"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { Button } from "@/components/ui/button";
import { LANGUAGE_MAP } from "@/lib/types";

export default function ProfilePage() {
    const { profile, logout } = useFarmProfile();

    if (!profile) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Farm Profile</CardTitle>
                    <CardDescription>
                        This is the information used to personalize your CropAI experience.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Role</span>
                        <span className="capitalize">{profile.role}</span>
                   </div>
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Crops</span>
                        <span className="capitalize">{profile.crops.join(', ')}</span>
                   </div>
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Surface Area</span>
                        <span>{profile.surfaceArea} Hectares</span>
                   </div>
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Farm Location</span>
                        <span>{profile.locationName || 'Not set'}</span>
                   </div>
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Language</span>
                        <span>{LANGUAGE_MAP[profile.preferredLanguage]}</span>
                   </div>
                   <div className="pt-4 flex gap-2">
                        <Button disabled>Edit Profile</Button>
                        <Button variant="destructive" onClick={logout}>Log Out</Button>
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
