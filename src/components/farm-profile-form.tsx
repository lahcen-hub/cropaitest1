
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

export function FarmProfileForm({ onSubmit, initialProfile, submitButtonText = "Create Profile & Enter App" }: FarmProfileFormProps) {
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FarmProfile>({
    resolver: zodResolver(farmProfileSchema),
    defaultValues: initialProfile || {
      role: undefined,
      companyName: "",
      crops: [],
      surfaceArea: 0,
      preferredLanguage: "en",
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
        title: "Geolocation Error",
        description: "Your browser does not support geolocation.",
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
            title: "Location Acquired",
            description: "Your location has been set.",
        });
        setIsLocating(false);
      },
      (error) => {
        toast({
            variant: "destructive",
            title: "Geolocation Error",
            description: "Could not get your location. Please check your browser permissions.",
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
                  <FormLabel>Your Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role} className="capitalize">
                          {role}
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
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Agri Supplies Inc." {...field} />
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
                  name="surfaceArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Surface Area (Hectares)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crops"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Crops You Grow</FormLabel>
                        <FormDescription>Select all that apply.</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {CROP_TYPES.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="crops"
                            render={({ field }) => {
                              return (
                                <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
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
              </>
            )}

            <div className="grid md:grid-cols-2 gap-6 items-end">
                <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating} className="w-full">
                        {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                        Use Current Location
                        </Button>
                        <Button type="button" variant="secondary" disabled>
                        Select on Map
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
                        <FormLabel>Preferred Language</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
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
