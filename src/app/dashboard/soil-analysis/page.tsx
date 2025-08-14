
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { useToast } from "@/hooks/use-toast";
import { type GenerateScheduleFromSoilOutput } from "@/ai/flows/generate-schedule-from-soil";
import { generateScheduleFromSoilAction } from "./actions";
import { Loader2, Upload, AlertCircle, Bot, TestTube2, ChevronsRight, Droplets, Leaf, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CROP_EMOJI_MAP } from "@/lib/types";

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
  ideal: "default",
  low: "secondary",
  high: "destructive",
  'n/a': "outline"
};

export default function SoilAnalysisPage() {
  const { profile } = useFarmProfile();
  const { toast } = useToast();
  const [reportDataUri, setReportDataUri] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateScheduleFromSoilOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "Veuillez télécharger un fichier de moins de 4 Mo.",
        });
        return;
      }
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportDataUri(reader.result as string);
        setPreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!reportDataUri || !profile || !selectedCrop) {
      toast({
        variant: "destructive",
        title: "Informations Manquantes",
        description: "Veuillez télécharger un rapport de sol, sélectionner une culture et vous assurer que votre profil est complet.",
      });
      return;
    }
    if (!profile.location) {
        toast({
            variant: "destructive",
            title: "Localisation Manquante",
            description: "Veuillez définir l'emplacement de votre ferme dans votre profil pour générer un calendrier.",
        });
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const actionResult = await generateScheduleFromSoilAction({
      soilReportDataUri: reportDataUri,
      cropType: selectedCrop,
      surfaceArea: profile.surfaceArea * 10000,
      location: profile.locationName || `${profile.location.lat}, ${profile.location.lng}`,
      preferredLanguage: profile.preferredLanguage,
    });

    if (actionResult.error) {
      setError(actionResult.error);
    } else {
      setResult(actionResult.data);
    }
    setLoading(false);
  };
  
  const handleDownloadPdf = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const primaryColor = '#267048';

    doc.setFontSize(18);
    doc.text(`Rapport d'Analyse de Sol pour ${selectedCrop}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 14, 28);
    
    let y = 40;

    doc.setFontSize(14);
    doc.text("Interprétation de l'Agronome IA", 14, y);
    y += 6;
    doc.setFontSize(10);
    const interpretationLines = doc.splitTextToSize(result.soilAnalysis.interpretation, 180);
    doc.text(interpretationLines, 14, y);
    y += doc.getTextDimensions(interpretationLines).h + 4;

    autoTable(doc, {
        startY: y,
        head: [['Paramètre', 'Valeur', 'Statut']],
        body: result.soilAnalysis.parameters.map(p => [p.parameter, p.value, p.status]),
        headStyles: { fillColor: primaryColor },
        theme: 'striped',
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(14);
    doc.text("Calendrier de Fertilisation", 14, y);
    y += 6;
    autoTable(doc, {
        startY: y,
        head: [['Semaine', 'Tâche', 'Instructions']],
        body: result.fertilizationSchedule.map(e => [e.week, e.task, e.instructions]),
        headStyles: { fillColor: primaryColor },
        theme: 'striped',
    });

    y = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.text("Calendrier d'Irrigation", 14, y);
    y += 6;
    autoTable(doc, {
        startY: y,
        head: [['Semaine', 'Tâche', 'Instructions']],
        body: result.irrigationSchedule.map(e => [e.week, e.task, e.instructions]),
        headStyles: { fillColor: primaryColor },
        theme: 'striped',
    });

    doc.save(`rapport-analyse-sol-${selectedCrop}.pdf`);
  };


  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Analyser le Rapport de Sol</CardTitle>
            <CardDescription>
              Téléchargez un rapport d'analyse de sol pour obtenir un calendrier personnalisé.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="soil-report">Fichier du Rapport de Sol</Label>
              <Input id="soil-report" type="file" accept="image/*,application/pdf" onChange={handleFileChange} disabled={loading} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="crop-select">Sélectionner la Culture pour l'Analyse</Label>
                <Select onValueChange={setSelectedCrop} value={selectedCrop} disabled={loading}>
                  <SelectTrigger id="crop-select">
                    <SelectValue placeholder="Sélectionnez une culture" />
                  </SelectTrigger>
                  <SelectContent>
                    {profile?.crops.map((crop) => (
                      <SelectItem key={crop} value={crop} className="capitalize">
                        {CROP_EMOJI_MAP[crop.toLowerCase()] || ''} {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            {previewUrl && reportDataUri?.startsWith("data:image") && (
              <div className="relative mt-4 h-64 w-full overflow-hidden rounded-md border">
                <Image src={previewUrl} alt="Aperçu du rapport de sol" layout="fill" objectFit="contain" />
              </div>
            )}
            {previewUrl && reportDataUri?.startsWith("data:application/pdf") && (
                <div className="mt-4 p-4 text-center text-sm bg-muted rounded-md text-muted-foreground">
                    Fichier PDF sélectionné. L'aperçu n'est pas disponible.
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={!reportDataUri || !selectedCrop || loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Générer les Calendriers
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {!loading && !error && !result && (
             <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                    <TestTube2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-foreground font-headline">Votre analyse apparaîtra ici</h3>
                <p className="mt-1 text-muted-foreground">Téléchargez un rapport, sélectionnez une culture et cliquez sur "Générer les Calendriers".</p>
             </Card>
        )}
        {loading && (
          <Card className="flex h-full min-h-[400px] flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Analyse de votre rapport et construction des calendriers...</p>
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
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TestTube2 className="h-6 w-6 text-primary" />
                        <CardTitle>Rapport Généré par l'IA</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger le Rapport PDF
                    </Button>
                </div>
                <CardDescription>Une analyse de sol complète et des calendriers personnalisés pour votre culture sélectionnée.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <ChevronsRight className="h-5 w-5 text-primary" />
                        Interprétation de l'Agronome IA
                    </h3>
                    <p className="text-muted-foreground text-sm">{result.soilAnalysis.interpretation}</p>
                </div>
                
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Paramètre</TableHead>
                            <TableHead>Valeur</TableHead>
                            <TableHead className="text-right">Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.soilAnalysis.parameters.map((param) => (
                            <TableRow key={param.parameter}>
                                <TableCell className="font-medium">{param.parameter}</TableCell>
                                <TableCell>{param.value}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={statusVariantMap[param.status]} className="capitalize">{param.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>

                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Leaf className="h-5 w-5 text-primary" />
                        Calendrier de Fertilisation
                    </h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Semaine</TableHead>
                                <TableHead>Tâche</TableHead>
                                <TableHead>Instructions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.fertilizationSchedule.map((event) => (
                                <TableRow key={event.week}>
                                    <TableCell className="font-medium">{event.week}</TableCell>
                                    <TableCell>{event.task}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{event.instructions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Droplets className="h-5 w-5 text-primary" />
                        Calendrier d'Irrigation
                    </h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Semaine</TableHead>
                                <TableHead>Tâche</TableHead>
                                <TableHead>Instructions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.irrigationSchedule.map((event) => (
                                <TableRow key={event.week}>
                                    <TableCell className="font-medium">{event.week}</TableCell>
                                    <TableCell>{event.task}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{event.instructions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
