"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CROP_TYPES, ROLES, LANGUAGES, LANGUAGE_MAP, farmProfileSchema, type FarmProfile, CROP_EMOJI_MAP } from "@/lib/types";
import { MapPin, Loader2, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type FarmProfileFormProps = {
  onSubmit: (data: FarmProfile) => void;
  initialProfile?: FarmProfile | null;
  submitButtonText?: string;
};

export function FarmProfileForm({ onSubmit, initialProfile, submitButtonText = "Créer le Profil & Entrer dans l'App" }: FarmProfileFormProps) {
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FarmProfile>({
    resolver: zodResolver(farmProfileSchema),
    defaultValues: initialProfile || {
      role: undefined,
      companyName: "",
      crops: [],
      surfaceArea: 0,
      preferredLanguage: "fr",
    },
  });

  const selectedRole = form.watch("role");
  
  useEffect(() => {
    if (initialProfile) {
      form.reset(initialProfile);
    }
  }, [initialProfile, form]);

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Erreur de Géolocalisation",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue("location", { lat: latitude, lng: longitude }, { shouldValidate: true });
        form.setValue("locationName", `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`, { shouldValidate: true });
        toast({
            title: "Localisation Acquise",
            description: "Votre localisation a été définie.",
        });
        setIsLocating(false);
      },
      (error) => {
        toast({
            variant: "destructive",
            title: "Erreur de Géolocalisation",
            description: "Impossible d'obtenir votre localisation. Veuillez vérifier les autorisations de votre navigateur.",
        });
        setIsLocating(false);
      }
    );
  };
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 grid gap-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre Rôle</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role} className="capitalize">
                          {role === 'farmer' ? 'Agriculteur' : role === 'technician' ? 'Technicien' : 'Fournisseur'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedRole === 'supplier' && (
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'Entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="ex., Agri Fournitures SA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(selectedRole === 'farmer' || selectedRole === 'technician') && (
              <>
                 <FormField
                  control={form.control}
                  name="crops"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Cultures que Vous Cultivez</FormLabel>
                        <FormDescription>Sélectionnez tout ce qui s'applique.</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {CROP_TYPES.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="crops"
                            render={({ field }) => {
                              return (
                                <FormItem key={item} className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item])
                                          : field.onChange(field.value?.filter((value) => value !== item));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal capitalize">{CROP_EMOJI_MAP[item.toLowerCase()] || ''} {item}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surfaceArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Superficie Totale (Hectares)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="grid md:grid-cols-2 gap-6 items-end">
                <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating} className="w-full">
                        {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                        Localisation Actuelle
                        </Button>
                        <Button type="button" variant="secondary" disabled>
                        Carte
                        </Button>
                    </div>
                    {form.watch("locationName") && (
                        <FormDescription className="mt-2 text-primary">{form.watch("locationName")}</FormDescription>
                    )}
                     <FormMessage />
                </FormItem>
                <FormField
                    control={form.control}
                    name="preferredLanguage"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Langue Préférée</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une langue" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {LANGUAGES.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                {LANGUAGE_MAP[lang]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {submitButtonText}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
