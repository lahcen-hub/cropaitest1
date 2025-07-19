
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { Button } from "@/components/ui/button";
import { LANGUAGE_MAP, CROP_EMOJI_MAP, type FarmProfile } from "@/lib/types";
import { FarmProfileForm } from "@/components/farm-profile-form";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const { profile, logout, updateProfile } = useFarmProfile();
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

    if (!profile) return null;

    const handleProfileUpdate = (data: FarmProfile) => {
        updateProfile(data);
        setIsEditing(false);
        toast({
            title: "Profile Updated",
            description: "Your information has been saved.",
        });
    };

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline">
                        Edit Profile
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Update your profile information below.
                    </p>
                </div>
                <FarmProfileForm
                    onSubmit={handleProfileUpdate}
                    initialProfile={profile}
                    submitButtonText="Save Changes"
                />
                <div className="flex justify-center mt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        This is the information used to personalize your CropAI experience.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Role</span>
                        <span className="capitalize">{profile.role}</span>
                   </div>
                   {profile.role === 'supplier' ? (
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Company Name</span>
                        <span className="capitalize">{profile.companyName}</span>
                    </div>
                   ) : (
                    <>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Crops</span>
                            <span className="capitalize">
                                {profile.crops.map(crop => `${CROP_EMOJI_MAP[crop.toLowerCase()] || ''} ${crop}`).join(', ')}
                            </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Surface Area</span>
                            <span>{profile.surfaceArea} Hectares</span>
                        </div>
                    </>
                   )}
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Location</span>
                        <span>{profile.locationName || 'Not set'}</span>
                   </div>
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Language</span>
                        <span>{LANGUAGE_MAP[profile.preferredLanguage]}</span>
                   </div>
                   <div className="pt-4 flex gap-2">
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        <Button variant="destructive" onClick={logout}>Log Out</Button>
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
