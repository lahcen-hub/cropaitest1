
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { type DiagnosePlantProblemOutput } from "@/ai/flows/diagnose-plant-problem";
import { diagnosePlantProblemGuestAction } from "./actions";
import { Loader2, Upload, AlertCircle, Bot, Stethoscope, Syringe, Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, LANGUAGE_MAP } from "@/lib/types";
import Link from "next/link";

export default function PlantDoctorGuestPage() {
  const { toast } = useToast();
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<(typeof LANGUAGES)[number]>("fr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosePlantProblemOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "Veuillez télécharger une image de moins de 4 Mo.",
        });
        return;
      }
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
        setPreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!photoDataUri) {
      toast({
        variant: "destructive",
        title: "Photo Manquante",
        description: "Veuillez télécharger une photo pour obtenir un diagnostic.",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const diagnosisResult = await diagnosePlantProblemGuestAction({
      photoDataUri,
      preferredLanguage,
    });

    if (diagnosisResult.error) {
      setError(diagnosisResult.error);
    } else {
      setResult(diagnosisResult.data);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Docteur des Plantes IA</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Essayez notre diagnostic de plantes par l'IA. Pour des conseils personnalisés et plus de fonctionnalités, <Link href="/signup" className="text-primary underline">créez un compte gratuit</Link>.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Télécharger une Photo de Plante</CardTitle>
            <CardDescription>
              Prenez une photo claire de la plante affectée. Nous l'analyserons pour identifier les problèmes potentiels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="plant-photo">Photo de la Plante</Label>
                    <Input id="plant-photo" type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="language">Langue de Réponse</Label>
                     <Select onValueChange={(val) => setPreferredLanguage(val as any)} value={preferredLanguage}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Sélectionnez une langue" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                {LANGUAGE_MAP[lang]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {previewUrl && (
              <div className="relative mt-4 h-64 w-full overflow-hidden rounded-md border">
                <Image src={previewUrl} alt="Aperçu de la plante" layout="fill" objectFit="contain" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={!photoDataUri || loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Obtenir un Diagnostic par l'IA
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {!loading && !error && !result && (
               <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
                  <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                      <Stethoscope className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground font-headline">Le diagnostic apparaîtra ici</h3>
                  <p className="mt-1 text-muted-foreground">Téléchargez une image et cliquez sur "Obtenir un Diagnostic par l'IA" pour commencer.</p>
               </Card>
          )}
          {loading && (
            <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Analyse de votre plante en cours... Cela peut prendre un moment.</p>
            </Card>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>L'Analyse a Échoué</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                      <Stethoscope className="h-6 w-6 text-primary" />
                      <CardTitle>Diagnostic</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.diagnosis}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                      <Syringe className="h-6 w-6 text-primary" />
                      <CardTitle>Traitement Recommandé</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                   <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: result.treatment.replace(/\n/g, '<br />') }} />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}
