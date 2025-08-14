
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { useToast } from "@/hooks/use-toast";
import { generateFarmCalendarAction } from "./actions";
import { Loader2, CalendarPlus, AlertCircle, Bot, CalendarCheck2, Download } from "lucide-react";
import { GenerateFarmCalendarOutput } from "@/ai/flows/generate-farm-calendar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CROP_EMOJI_MAP } from "@/lib/types";


export default function FarmCalendarPage() {
  const { profile } = useFarmProfile();
  const { toast } = useToast();
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateFarmCalendarOutput | null>(null);

  const handleSubmit = async () => {
    if (!profile || !selectedCrop) {
      toast({
        variant: "destructive",
        title: "Informations Manquantes",
        description: "Veuillez sélectionner une culture et vous assurer que votre profil est complet.",
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

    const calendarResult = await generateFarmCalendarAction({
      cropType: selectedCrop,
      surfaceArea: profile.surfaceArea * 10000,
      location: profile.locationName || `${profile.location.lat}, ${profile.location.lng}`,
      preferredLanguage: profile.preferredLanguage,
    });

    if (calendarResult.error) {
      setError(calendarResult.error);
    } else {
      setResult(calendarResult.data);
    }
    setLoading(false);
  };
  
  const handleDownloadPdf = () => {
    if (!result || !result.calendar) return;

    const doc = new jsPDF();
    const primaryColor = '#267048';

    doc.setFontSize(18);
    doc.text(`Calendrier Agricole pour ${selectedCrop}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 14, 28);
    
    autoTable(doc, {
        startY: 40,
        head: [['Semaine', 'Tâche', 'Instructions']],
        body: result.calendar.map(e => [e.week.toString(), e.task, e.instructions]),
        headStyles: { fillColor: primaryColor },
        theme: 'striped',
    });

    doc.save(`calendrier-agricole-${selectedCrop}.pdf`);
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Générer un Calendrier</CardTitle>
            <CardDescription>
              Sélectionnez une culture pour générer un calendrier d'irrigation et de fertilisation personnalisé.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedCrop} value={selectedCrop}>
              <SelectTrigger>
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
            <Button onClick={handleSubmit} disabled={!selectedCrop || loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Générer avec l'IA
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
         {!loading && !error && !result && (
             <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                    <CalendarPlus className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-foreground font-headline">Votre calendrier apparaîtra ici</h3>
                <p className="mt-1 text-muted-foreground">Sélectionnez une culture et cliquez sur "Générer avec l'IA" pour commencer.</p>
             </Card>
        )}
        {loading && (
          <Card className="flex h-full min-h-[400px] flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Génération de votre calendrier personnalisé...</p>
          </Card>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>La Génération a Échoué</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
          <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CalendarCheck2 className="h-6 w-6 text-primary" />
                    <CardTitle className="capitalize">
                    {CROP_EMOJI_MAP[selectedCrop.toLowerCase()] || ''} Calendrier Agricole pour {selectedCrop}
                    </CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger en PDF
                </Button>
              </div>
              <CardDescription>
                Un calendrier personnalisé basé sur le profil de votre ferme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Semaine</TableHead>
                        <TableHead>Tâche</TableHead>
                        <TableHead>Instructions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {result.calendar.map((event) => (
                        <TableRow key={event.week}>
                            <TableCell className="font-medium">{event.week}</TableCell>
                            <TableCell>{event.task}</TableCell>
                            <TableCell className="text-muted-foreground">{event.instructions}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
