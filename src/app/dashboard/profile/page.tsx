
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
            title: "Profil Mis à Jour",
            description: "Vos informations ont été enregistrées.",
        });
    };

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline">
                        Modifier le Profil
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Mettez à jour vos informations de profil ci-dessous.
                    </p>
                </div>
                <FarmProfileForm
                    onSubmit={handleProfileUpdate}
                    initialProfile={profile}
                    submitButtonText="Enregistrer les Modifications"
                />
                <div className="flex justify-center mt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Profil</CardTitle>
                    <CardDescription>
                        Ces informations sont utilisées pour personnaliser votre expérience CropAI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Rôle</span>
                        <span className="capitalize">{profile.role}</span>
                   </div>
                   {profile.role === 'supplier' ? (
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Nom de l'Entreprise</span>
                        <span className="capitalize">{profile.companyName}</span>
                    </div>
                   ) : (
                    <>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Cultures</span>
                            <span className="capitalize">
                                {profile.crops.map(crop => `${CROP_EMOJI_MAP[crop.toLowerCase()] || ''} ${crop}`).join(', ')}
                            </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Superficie</span>
                            <span>{profile.surfaceArea} Hectares</span>
                        </div>
                    </>
                   )}
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Localisation</span>
                        <span>{profile.locationName || 'Non définie'}</span>
                   </div>
                   <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Langue</span>
                        <span>{LANGUAGE_MAP[profile.preferredLanguage]}</span>
                   </div>
                   <div className="pt-4 flex gap-2">
                        <Button onClick={() => setIsEditing(true)}>Modifier le Profil</Button>
                        <Button variant="destructive" onClick={logout}>Se Déconnecter</Button>
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
