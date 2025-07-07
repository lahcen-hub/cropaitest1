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
  const [preferredLanguage, setPreferredLanguage] = useState<(typeof LANGUAGES)[number]>("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosePlantProblemOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
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
        title: "Missing Photo",
        description: "Please upload a photo to get a diagnosis.",
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
        <h1 className="text-3xl md:text-4xl font-bold font-headline">AI Plant Doctor</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Try our AI-powered plant diagnosis. For personalized advice and more features, <Link href="/signup" className="text-primary underline">create a free account</Link>.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Plant Photo</CardTitle>
            <CardDescription>
              Take a clear photo of the affected plant. We'll analyze it to identify potential issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="plant-photo">Plant Photo</Label>
                    <Input id="plant-photo" type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="language">Response Language</Label>
                     <Select onValueChange={(val) => setPreferredLanguage(val as any)} value={preferredLanguage}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Select a language" />
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
                <Image src={previewUrl} alt="Plant preview" layout="fill" objectFit="contain" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={!photoDataUri || loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Get AI Diagnosis
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {!loading && !error && !result && (
               <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
                  <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                      <Stethoscope className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground font-headline">Diagnosis will appear here</h3>
                  <p className="mt-1 text-muted-foreground">Upload an image and click "Get AI Diagnosis" to begin.</p>
               </Card>
          )}
          {loading && (
            <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Analyzing your plant... This may take a moment.</p>
            </Card>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                      <Stethoscope className="h-6 w-6 text-primary" />
                      <CardTitle>Diagnosis</CardTitle>
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
                      <CardTitle>Recommended Treatment</CardTitle>
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
