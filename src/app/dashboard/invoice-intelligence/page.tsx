
"use client";

import { useState, useMemo } from "react";
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
import { extractInvoiceDataAction } from "./actions";
import { Loader2, AlertCircle, Bot, Upload, Trash2, Download, X, Receipt, Eye } from "lucide-react";
import { type InvoiceData, type InvoiceRecord } from "@/lib/types";
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
import { InvoiceDataForm } from "@/components/invoice-data-form";
import { format } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


function InvoicesDashboard() {
  const { invoices, deleteInvoice } = useFarmProfile();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceRecord | null>(null);

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => {
        if (!invoice.transactionDate && !invoice.timestamp) return false;
        const invoiceDate = new Date(invoice.transactionDate || invoice.timestamp);
        const isInDateRange = !dateRange || !dateRange.from || !dateRange.to || (invoiceDate >= dateRange.from && invoiceDate <= dateRange.to);
        return isInDateRange;
      })
      .sort((a, b) => new Date(b.transactionDate || b.timestamp).getTime() - new Date(a.transactionDate || a.timestamp).getTime());
  }, [invoices, dateRange]);


  if (invoices.length === 0) {
    return (
      <>
        <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
              <Receipt className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-foreground font-headline">Aucune facture pour le moment</h3>
          <p className="mt-1 text-muted-foreground">Téléchargez votre première facture pour voir votre historique.</p>
        </Card>
      </>
    );
  }

  return (
     <>
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Historique des Factures</CardTitle>
                        <CardDescription>Affichez et filtrez vos factures passées.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                </div>
                <ScrollArea className="w-full whitespace-nowrap">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Fournisseur</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-center">Articles</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.transactionDate ? format(new Date(invoice.transactionDate), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                                    <TableCell>{invoice.supplierName || 'N/A'}</TableCell>
                                    <TableCell>{invoice.totalAmount ? `$${invoice.totalAmount.toFixed(2)}` : 'N/A'}</TableCell>
                                    <TableCell className="text-center">
                                      <Button variant="outline" size="sm" onClick={() => setViewingInvoice(invoice)}>
                                        <Eye className="mr-2 h-4 w-4"/>
                                        Voir ({invoice.items.length})
                                      </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => deleteInvoice(invoice.id)}>
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
        
        <Dialog open={!!viewingInvoice} onOpenChange={(isOpen) => !isOpen && setViewingInvoice(null)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Détails de la Facture</DialogTitle>
                    <DialogDescription>
                        Articles de la facture du {viewingInvoice?.transactionDate ? format(new Date(viewingInvoice.transactionDate), "PPP") : "N/A"} de {viewingInvoice?.supplierName || "N/A"}.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto -mx-6 px-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Article</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Unité</TableHead>
                                <TableHead className="text-right">Prix</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {viewingInvoice?.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell className="text-right">{item.price ? `$${item.price.toFixed(2)}` : "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
     </>
  )
}

type BulkReviewData = {
    id: string;
    invoiceData: InvoiceData;
    photoDataUri: string;
};

export default function InvoiceIntelligencePage() {
  const { profile, addInvoice } = useFarmProfile();
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
                    description: `${file.name} est plus grand que 4MB.`,
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
            extractInvoiceDataAction({
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
                invoiceData: s.data!,
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
  
  const handleConfirmInvoices = () => {
    if (extractedData.length === 0) return;
    
    let savedCount = 0;
    extractedData.forEach((record) => {
        if(record.invoiceData.items.length > 0) {
            addInvoice(record.invoiceData);
            savedCount++;
        }
    });

    toast({
        title: "Succès!",
        description: `Vos données de facturation de ${savedCount} document(s) ont été sauvegardées.`,
    });
    
    setIsReviewing(false);
    setExtractedData([]);
    setError(null);
  }

  const handleUpdateRecord = (id: string, updatedData: InvoiceData) => {
    setExtractedData(prevData =>
        prevData.map(record =>
            record.id === id ? { ...record, invoiceData: updatedData } : record
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
            <CardTitle>Télécharger Factures & Reçus</CardTitle>
            <CardDescription>
                Téléchargez une ou plusieurs photos de vos documents de dépenses pour suivre automatiquement les achats.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="invoice-doc">Photos des Documents</Label>
                <Input id="invoice-doc" type="file" accept="image/*" onChange={handleFileChange} disabled={loading} multiple />
            </div>
            
            {photos.length > 0 && (
                <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative mt-4 h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border">
                            <Image src={photo.previewUrl} alt={`Aperçu du document de facture ${index+1}`} layout="fill" objectFit="contain" />
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

        <InvoicesDashboard />

        <Dialog open={isReviewing} onOpenChange={setIsReviewing}>
            <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Vérifier les Données de Facture Extraites</DialogTitle>
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
                                    <InvoiceDataForm
                                        initialData={record.invoiceData}
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
                <Button onClick={handleConfirmInvoices} disabled={extractedData.length === 0}>
                    Sauvegarder Tous les Enregistrements
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    
