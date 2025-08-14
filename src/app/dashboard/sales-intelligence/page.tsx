
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { extractSalesDataAction } from "./actions";
import { Loader2, AlertCircle, Bot, Upload, BarChart as BarChartIcon, Trash2, Leaf, Package, Box, Download, X, PieChart } from "lucide-react";
import { type SalesData, type SaleRecord, CROP_BOX_WEIGHTS, CROP_EMOJI_MAP } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { type DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalesDataForm } from "@/components/sales-data-form";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


function SalesDashboard() {
  const { sales, deleteSale } = useFarmProfile();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const uniqueCrops = useMemo(() => {
    const crops = new Set<string>();
    sales.forEach(sale => sale.items.forEach(item => crops.add(item.cropName)));
    return ["all", ...Array.from(crops)];
  }, [sales]);

  const filteredSales = useMemo(() => {
    return sales
      .filter(sale => {
        if (!sale.transactionDate && !sale.timestamp) return false;
        const saleDate = new Date(sale.transactionDate || sale.timestamp);
        const isInDateRange = !dateRange || !dateRange.from || !dateRange.to || (saleDate >= dateRange.from && saleDate <= dateRange.to);
        const hasSelectedCrop = selectedCrop === 'all' || sale.items.some(item => item.cropName === selectedCrop);
        return isInDateRange && hasSelectedCrop;
      })
      .sort((a, b) => new Date(b.transactionDate || b.timestamp).getTime() - new Date(a.transactionDate || a.timestamp).getTime());
  }, [sales, dateRange, selectedCrop]);
  
  const totalItemsData = useMemo(() => {
    const cropTotals: { [key: string]: number } = {};
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const emoji = CROP_EMOJI_MAP[item.cropName.toLowerCase()] || '';
        const key = `${emoji} ${item.cropName} (${item.unit})`;
        cropTotals[key] = (cropTotals[key] || 0) + item.quantity;
      });
    });
    return Object.entries(cropTotals).map(([name, total]) => ({
      name,
      total,
    })).sort((a,b) => b.total - a.total);
  }, [filteredSales]);

  const salesByDayData = useMemo(() => {
    const dayTotals: { [key: string]: number } = {};
    filteredSales.forEach(sale => {
      const date = new Date(sale.transactionDate || sale.timestamp).toISOString().split('T')[0];
      
      const itemsToSum = selectedCrop === "all"
        ? sale.items
        : sale.items.filter((item) => item.cropName === selectedCrop);

      const totalQuantity = itemsToSum.reduce((sum, item) => sum + item.quantity, 0);

      dayTotals[date] = (dayTotals[date] || 0) + totalQuantity;
    });

    return Object.entries(dayTotals)
      .map(([date, total]) => ({
        date,
        total,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredSales, selectedCrop]);

  const boxesByDayData = useMemo(() => {
    const dayTotals: { [key:string]: number } = {};
    filteredSales.forEach(sale => {
      const date = new Date(sale.transactionDate || sale.timestamp).toISOString().split('T')[0];
      
      const itemsToSum = selectedCrop === "all"
        ? sale.items
        : sale.items.filter((item) => item.cropName === selectedCrop);

      let totalBoxes = 0;
      itemsToSum.forEach(item => {
        const boxWeight = CROP_BOX_WEIGHTS[item.cropName.toLowerCase()];
        if(boxWeight && item.unit.toLowerCase() === 'kg'){
            totalBoxes += item.quantity / boxWeight;
        }
      });
      
      if (totalBoxes > 0) {
        dayTotals[date] = (dayTotals[date] || 0) + totalBoxes;
      }
    });

    return Object.entries(dayTotals)
      .map(([date, totalBoxes]) => ({
        date,
        total: Math.round(totalBoxes),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredSales, selectedCrop]);
  
  const chartConfig = {
    total: {
      label: "Quantité Totale",
      color: "hsl(var(--chart-1))",
    },
    items: {
        label: "Articles Vendus",
        color: "hsl(var(--chart-2))",
    },
    boxes: {
      label: "Caisses Vendues",
      color: "hsl(var(--chart-3))",
    }
  } satisfies ChartConfig;

  const calculateBoxesForSale = (sale: SaleRecord) => {
    let totalBoxes = 0;
    sale.items.forEach(item => {
        const boxWeight = CROP_BOX_WEIGHTS[item.cropName.toLowerCase()];
        if(boxWeight && item.unit.toLowerCase() === 'kg'){
            totalBoxes += item.quantity / boxWeight;
        }
    });
    
    if (totalBoxes === 0) {
      return "-";
    }
    
    return totalBoxes % 1 === 0 ? totalBoxes.toFixed(0) : totalBoxes.toFixed(1);
  };
  
  const calculateItemsNetForSale = (sale: SaleRecord) => {
    let totalItemsNet = 0;
    let itemsInKgFound = false;

    sale.items.forEach(item => {
      if (item.unit.toLowerCase() === 'kg') {
        const boxWeight = CROP_BOX_WEIGHTS[item.cropName.toLowerCase()];
        if (boxWeight) {
          itemsInKgFound = true;
          totalItemsNet += (((item.quantity / boxWeight) * 3 - item.quantity) * -1);
        }
      }
    });

    if (!itemsInKgFound) {
      return "-";
    }

    return totalItemsNet.toFixed(2);
  };
  
  const calculateBoxesNetForSale = (sale: SaleRecord) => {
    let totalBoxesNet = 0;
    let itemsInKgFound = false;

    sale.items.forEach(item => {
        if (item.unit.toLowerCase() === 'kg') {
            const boxWeight = CROP_BOX_WEIGHTS[item.cropName.toLowerCase()];
            if (boxWeight) {
                itemsInKgFound = true;
                const itemsNet = (((item.quantity / boxWeight) * 3 - item.quantity) * -1);
                totalBoxesNet += itemsNet / boxWeight;
            }
        }
    });

    if (!itemsInKgFound) {
        return "-";
    }
    
    return totalBoxesNet.toFixed(2);
  };


  
  const handleDownloadPdf = () => {
    if (filteredSales.length === 0) return;

    const doc = new jsPDF();
    const primaryColor = '#267048';

    doc.setFontSize(18);
    doc.text("Rapport d'Analyse des Ventes", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const dateRangeString = dateRange?.from && dateRange?.to 
        ? `${format(dateRange.from, "dd LLL, y")} - ${format(dateRange.to, "dd LLL, y")}` 
        : "Tout le temps";
    doc.text(`Plage de dates : ${dateRangeString}`, 14, 28);
    doc.text(`Filtre de culture : ${selectedCrop === 'all' ? 'Toutes les cultures' : selectedCrop}`, 14, 34);

    let y = 45;

    if (totalItemsData.length > 0) {
        doc.setFontSize(14);
        doc.text("Résumé du Volume des Ventes", 14, y);
        y += 8;
        autoTable(doc, {
            startY: y,
            head: [['Culture & Unité', 'Quantité Totale']],
            body: totalItemsData.map(item => [item.name, item.total.toLocaleString()]),
            headStyles: { fillColor: primaryColor },
            theme: 'striped',
        });
        y = (doc as any).lastAutoTable.finalY + 15;
    }


    if (filteredSales.length > 0) {
        doc.setFontSize(14);
        doc.text("Historique Détaillé des Ventes", 14, y);
        y += 8;
        autoTable(doc, {
            startY: y,
            head: [['Date', 'Articles', 'Caisses (est.)', 'Articles Net (kg)', 'Caisses Net']],
            body: filteredSales.map(sale => [
                format(new Date(sale.transactionDate || sale.timestamp), 'dd/MM/yyyy'),
                sale.items.map(i => `${i.quantity} ${i.unit} ${i.cropName}`).join(', '),
                calculateBoxesForSale(sale),
                calculateItemsNetForSale(sale),
                calculateBoxesNetForSale(sale),
            ]),
            headStyles: { fillColor: primaryColor },
            theme: 'striped',
        });
    }

    doc.save(`rapport-analyse-ventes.pdf`);
  };


  if (sales.length === 0) {
    return (
      <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <BarChartIcon className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-foreground font-headline">Aucune donnée de vente pour le moment</h3>
        <p className="mt-1 text-muted-foreground">Téléchargez votre premier document de vente pour voir votre historique.</p>
      </Card>
    );
  }

  return (
     <div className="space-y-6">
        {showAnalytics && (
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-primary" />
                            Volume des Ventes par Culture & Unité
                            </CardTitle>
                            <CardDescription>Quantité totale vendue pour chaque combinaison de culture et d'unité.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                                <BarChart accessibilityLayer data={totalItemsData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} interval={0} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Tendance des Ventes Quotidiennes
                            </CardTitle>
                            <CardDescription>Quantité totale d'articles vendus par jour. Note : ceci peut agréger des articles avec différentes unités (ex. kg, caisse). Filtrez par culture pour une vue plus spécifique.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                                <LineChart accessibilityLayer data={salesByDayData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => format(new Date(value), "dd MMM")}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" nameKey="total" />} />
                                    <Line dataKey="total" name="items" type="monotone" stroke="var(--color-items)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <Box className="h-5 w-5 text-primary" />
                        Tendance des Ventes Quotidiennes (Caisses)
                        </CardTitle>
                        <CardDescription>Nombre estimé de caisses vendues par jour (basé sur les poids spécifiques aux cultures).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <LineChart accessibilityLayer data={boxesByDayData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => format(new Date(value), "dd MMM")}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" nameKey="total" />} />
                                <Line dataKey="total" name="boxes" type="monotone" stroke="var(--color-boxes)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        )}

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Historique des Ventes</CardTitle>
                        <CardDescription>Affichez et filtrez vos anciens enregistrements de ventes.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowAnalytics(!showAnalytics)}>
                            <PieChart className="mr-2 h-4 w-4" />
                            {showAnalytics ? "Masquer les Analyses" : "Afficher les Analyses"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={filteredSales.length === 0}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger le Rapport
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filtrer par culture" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueCrops.map(crop => (
                                <SelectItem key={crop} value={crop} className="capitalize">{crop === 'all' ? 'Toutes les cultures' : `${CROP_EMOJI_MAP[crop.toLowerCase()] || ''} ${crop}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <ScrollArea className="w-full whitespace-nowrap">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Articles</TableHead>
                                <TableHead>Caisses (est.)</TableHead>
                                <TableHead>Articles Net (kg)</TableHead>
                                <TableHead>Caisses Net</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSales.map(sale => (
                                <TableRow key={sale.id}>
                                    <TableCell>{format(new Date(sale.transactionDate || sale.timestamp), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="min-w-[250px]">{sale.items.map(i => `${CROP_EMOJI_MAP[i.cropName.toLowerCase()] || ''} ${i.quantity} ${i.unit} ${i.cropName}`).join(', ')}</TableCell>
                                    <TableCell>{calculateBoxesForSale(sale)}</TableCell>
                                    <TableCell>{calculateItemsNetForSale(sale)}</TableCell>
                                    <TableCell>{calculateBoxesNetForSale(sale)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => deleteSale(sale.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
     </div>
  )
}

type BulkReviewData = {
    id: string;
    salesData: SalesData;
    photoDataUri: string;
};

export default function SalesIntelligencePage() {
  const { profile, addSale } = useFarmProfile();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<{file: File, dataUri: string, previewUrl: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [extractedData, setExtractedData] = useState<BulkReviewData[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        setError(null);
        setExtractedData([]);

        const newPhotos: {file: File, dataUri: string, previewUrl: string}[] = [];
        const filePromises = Array.from(files).map(file => {
             if (file.size > 4 * 1024 * 1024) { 
                toast({
                    variant: "destructive",
                    title: "Fichier trop volumineux",
                    description: `${file.name} est plus grand que 4Mo.`,
                });
                return null;
            }
            return new Promise<{file: File, dataUri: string, previewUrl: string}>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        file,
                        dataUri: reader.result as string,
                        previewUrl: URL.createObjectURL(file)
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(results => {
            setPhotos(prev => [...prev, ...results.filter(p => p !== null) as any]);
        });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }


  const handleExtractData = async () => {
    if (photos.length === 0 || !profile) {
      toast({
        variant: "destructive",
        title: "Informations Manquantes",
        description: "Veuillez télécharger au moins une photo.",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedData([]);

    try {
        const extractionPromises = photos.map(photo => 
            extractSalesDataAction({
                photoDataUri: photo.dataUri,
                preferredLanguage: profile.preferredLanguage,
            }).then(result => ({ ...result, photoDataUri: photo.dataUri }))
        );

        const results = await Promise.all(extractionPromises);
        
        const errors = results.filter(r => r.error);
        const successes = results.filter(r => !r.error && r.data);

        if (errors.length > 0) {
            const errorMessage = errors.map(e => e.error).join(', ');
            setError(`Échec du traitement de ${errors.length} image(s). Erreurs: ${errorMessage}`);
            toast({
                variant: "destructive",
                title: `L'extraction a échoué pour ${errors.length} image(s)`,
                description: "Veuillez réessayer ou vérifier les images.",
            });
        }
        
        if (successes.length > 0) {
            toast({
                title: `Données extraites avec succès de ${successes.length} image(s)!`,
                description: "Veuillez vérifier chaque document extrait avant de sauvegarder.",
            });
            const bulkData: BulkReviewData[] = successes.map((s) => ({
                id: crypto.randomUUID(),
                salesData: s.data!,
                photoDataUri: s.photoDataUri 
            }));
            setExtractedData(bulkData);
            setIsReviewing(true);
            setPhotos([]);
        } else if (errors.length === 0) {
            setError("Aucune donnée n'a pu être extraite des images fournies.");
        }

    } catch (e: any) {
        setError(e.message || "Une erreur inattendue est survenue lors du traitement par lots.");
        toast({
            variant: "destructive",
            title: "Échec du Traitement par Lots",
            description: e.message || "Une erreur inattendue est survenue.",
        });
    } finally {
        setLoading(false);
    }
  };
  
  const handleConfirmSales = () => {
    if (extractedData.length === 0) return;
    
    let savedCount = 0;
    extractedData.forEach((record) => {
        if(record.salesData.items.length > 0) {
            addSale(record.salesData);
            savedCount++;
        }
    });

    toast({
        title: "Succès!",
        description: `Vos données de vente de ${savedCount} document(s) ont été sauvegardées.`,
    });
    
    setIsReviewing(false);
    setExtractedData([]);
    setError(null);
  }

  const handleUpdateRecord = (id: string, updatedData: SalesData) => {
    setExtractedData(prevData =>
        prevData.map(record =>
            record.id === id ? { ...record, salesData: updatedData } : record
        )
    );
  }

  const handleRemoveRecord = (id: string) => {
      setExtractedData(prevData => prevData.filter(record => record.id !== id));
  }


  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
            <CardTitle>Télécharger les Documents de Vente</CardTitle>
            <CardDescription>
                Téléchargez une ou plusieurs photos pour extraire automatiquement le poids net, la culture et la date.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="sales-doc">Photos des Documents</Label>
                <Input id="sales-doc" type="file" accept="image/*" onChange={handleFileChange} disabled={loading} multiple />
            </div>
            
            {photos.length > 0 && (
                <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative mt-4 h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border">
                            <Image src={photo.previewUrl} alt={`Aperçu du document de vente ${index+1}`} layout="fill" objectFit="contain" />
                            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removePhoto(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Échec de l'Extraction</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            </CardContent>
            <CardFooter>
            <Button onClick={handleExtractData} disabled={photos.length === 0 || loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                {loading ? `Traitement de ${photos.length} images...` : `Extraire les données de ${photos.length} image(s)`}
            </Button>
            </CardFooter>
        </Card>

        <SalesDashboard />

        <Dialog open={isReviewing} onOpenChange={setIsReviewing}>
            <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Vérifier les Données de Vente Extraites</DialogTitle>
                <DialogDescription>
                    L'IA a extrait les données de chaque image. Veuillez vérifier et corriger toute information avant de sauvegarder.
                </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto p-1 space-y-4">
                {extractedData.map((record, index) => (
                    <Card key={record.id} className="relative">
                        <CardHeader>
                            <CardTitle>Document {index + 1}</CardTitle>
                            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => handleRemoveRecord(record.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <Image src={record.photoDataUri} alt={`Document ${index + 1}`} width={200} height={300} className="rounded-md object-contain w-full" />
                                </div>
                                <div className="md:col-span-2">
                                    <SalesDataForm 
                                        initialData={record.salesData}
                                        onUpdate={(updatedData) => handleUpdateRecord(record.id, updatedData)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost">Annuler</Button>
                </DialogClose>
                <Button onClick={handleConfirmSales} disabled={extractedData.length === 0}>
                    Sauvegarder Tous les Enregistrements
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
