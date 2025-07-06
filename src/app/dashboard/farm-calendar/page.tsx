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
import { Loader2, CalendarPlus, AlertCircle, Bot, CalendarCheck2 } from "lucide-react";
import { GenerateFarmCalendarOutput } from "@/ai/flows/generate-farm-calendar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
        title: "Missing Information",
        description: "Please select a crop and ensure your profile is complete.",
      });
      return;
    }
    if (!profile.location) {
        toast({
            variant: "destructive",
            title: "Location Missing",
            description: "Please set your farm location in your profile to generate a calendar.",
        });
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const calendarResult = await generateFarmCalendarAction({
      cropType: selectedCrop,
      surfaceArea: profile.surfaceArea,
      location: profile.locationName || `${profile.location.lat}, ${profile.location.lng}`,
    });

    if (calendarResult.error) {
      setError(calendarResult.error);
    } else {
      setResult(calendarResult.data);
    }
    setLoading(false);
  };
  
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Generate Schedule</CardTitle>
            <CardDescription>
              Select a crop to generate a personalized irrigation and fertilization calendar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedCrop} value={selectedCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                {profile?.crops.map((crop) => (
                  <SelectItem key={crop} value={crop} className="capitalize">
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSubmit} disabled={!selectedCrop || loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Generate with AI
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
                <h3 className="text-xl font-semibold text-foreground font-headline">Your calendar will appear here</h3>
                <p className="mt-1 text-muted-foreground">Select a crop and click "Generate with AI" to begin.</p>
             </Card>
        )}
        {loading && (
          <Card className="flex h-full min-h-[400px] flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Generating your custom calendar...</p>
          </Card>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CalendarCheck2 className="h-6 w-6 text-primary" />
                <CardTitle className="capitalize">
                  {selectedCrop} Farming Calendar
                </CardTitle>
              </div>
              <CardDescription>
                A personalized schedule based on your farm's profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap font-sans">
                {result.calendar}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
