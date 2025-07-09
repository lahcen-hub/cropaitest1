
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { extractSalesDataAction } from "./actions";
import { Loader2, AlertCircle, Bot, Upload, BarChart as BarChartIcon, Trash2, Leaf, Package, Box, Download } from "lucide-react";
import { type SalesData, type SaleRecord } from "@/lib/types";
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


function SalesDashboard() {
  const { sales, deleteSale } = useFarmProfile();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCrop, setSelectedCrop] = useState<string>("all");

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
        const key = `${item.cropName} (${item.unit})`;
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

      // We only convert items sold in 'kg' to boxes.
      const totalQuantityInKg = itemsToSum
        .filter(item => item.unit?.toLowerCase() === 'kg')
        .reduce((sum, item) => sum + item.quantity, 0);
      
      if (totalQuantityInKg > 0) {
        dayTotals[date] = (dayTotals[date] || 0) + (totalQuantityInKg / 31);
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
      label: "Total Quantity",
      color: "hsl(var(--chart-1))",
    },
    items: {
        label: "Items Sold",
        color: "hsl(var(--chart-2))",
    },
    boxes: {
      label: "Boxes Sold",
      color: "hsl(var(--chart-3))",
    }
  } satisfies ChartConfig;

  const calculateBoxesForSale = (sale: SaleRecord) => {
    const totalKg = sale.items
      .filter((item) => item.unit?.toLowerCase() === 'kg')
      .reduce((sum, item) => sum + item.quantity, 0);

    if (totalKg === 0) {
      return "-";
    }
    
    const boxes = totalKg / 31;
    return boxes % 1 === 0 ? boxes.toFixed(0) : boxes.toFixed(1);
  };
  
  const handleDownloadPdf = () => {
    if (filteredSales.length === 0) return;

    const doc = new jsPDF();
    const primaryColor = '#267048'; // Matching the theme

    // Main Title
    doc.setFontSize(18);
    doc.text("Sales Intelligence Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const dateRangeString = dateRange?.from && dateRange?.to 
        ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` 
        : "All time";
    doc.text(`Date Range: ${dateRangeString}`, 14, 28);
    doc.text(`Crop Filter: ${selectedCrop === 'all' ? 'All Crops' : selectedCrop}`, 14, 34);

    let y = 45;

    // Summary Table
    if (totalItemsData.length > 0) {
        doc.setFontSize(14);
        doc.text("Sales Volume Summary", 14, y);
        y += 8;
        autoTable(doc, {
            startY: y,
            head: [['Crop & Unit', 'Total Quantity']],
            body: totalItemsData.map(item => [item.name, item.total.toLocaleString()]),
            headStyles: { fillColor: primaryColor },
            theme: 'striped',
        });
        y = (doc as any).lastAutoTable.finalY + 15;
    }


    // Sales History Table
    if (filteredSales.length > 0) {
        doc.setFontSize(14);
        doc.text("Detailed Sales History", 14, y);
        y += 8;
        autoTable(doc, {
            startY: y,
            head: [['Date', 'Items', 'Boxes (est.)']],
            body: filteredSales.map(sale => [
                new Date(sale.transactionDate || sale.timestamp).toLocaleDateString(),
                sale.items.map(i => `${i.quantity} ${i.unit} ${i.cropName}`).join(', '),
                calculateBoxesForSale(sale)
            ]),
            headStyles: { fillColor: primaryColor },
            theme: 'striped',
        });
    }

    doc.save(`sales-intelligence-report.pdf`);
  };


  if (sales.length === 0) {
    return (
      <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <BarChartIcon className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-foreground font-headline">No sales data yet</h3>
        <p className="mt-1 text-muted-foreground">Upload your first sales document to see your history.</p>
      </Card>
    );
  }

  return (
     <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      Sales Volume by Crop & Unit
                    </CardTitle>
                    <CardDescription>Total quantity sold for each crop and unit combination.</CardDescription>
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
                      Daily Sales Trend
                    </CardTitle>
                    <CardDescription>Total quantity of items sold per day. Note: this may aggregate items with different units (e.g. kg, box). Filter by a crop for a more specific view.</CardDescription>
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
                                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
                  Daily Sales Trend (Boxes/Caisses)
                </CardTitle>
                <CardDescription>Estimated number of boxes sold per day (based on a conversion of 31 kg per box).</CardDescription>
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
                            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Sales History</CardTitle>
                        <CardDescription>View and filter your past sales records.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={filteredSales.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by crop" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueCrops.map(crop => (
                                <SelectItem key={crop} value={crop} className="capitalize">{crop === 'all' ? 'All Crops' : crop}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Boxes (est.)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSales.map(sale => (
                            <TableRow key={sale.id}>
                                <TableCell>{new Date(sale.transactionDate || sale.timestamp).toLocaleDateString()}</TableCell>
                                <TableCell>{sale.items.map(i => `${i.quantity} ${i.unit} ${i.cropName}`).join(', ')}</TableCell>
                                <TableCell>{calculateBoxesForSale(sale)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => deleteSale(sale.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
     </div>
  )
}

export default function SalesIntelligencePage() {
  const { profile, addSale } = useFarmProfile();
  const { toast } = useToast();
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for review flow
  const [extractedData, setExtractedData] = useState<SalesData | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  
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
      setError(null);
      setExtractedData(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
        setPreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractData = async () => {
    if (!photoDataUri || !profile) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please upload a photo.",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedData(null);

    const result = await extractSalesDataAction({
      photoDataUri,
      preferredLanguage: profile.preferredLanguage,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
       toast({
        variant: "destructive",
        title: "Extraction Failed",
        description: result.error,
      });
    } else if (result.data) {
       toast({
        title: "Extraction Complete!",
        description: "Please review the data before saving.",
      });
      setExtractedData(result.data);
      setIsReviewing(true);
    }
  };
  
  const handleConfirmSale = (data: SalesData) => {
    if (!photoDataUri) return;
    addSale(data, photoDataUri);
    toast({
        title: "Success!",
        description: "Your sales data has been saved.",
    });
    // Reset state
    setIsReviewing(false);
    setExtractedData(null);
    setPhotoDataUri(null);
    setPreviewUrl(null);
    setError(null);
  }

  const handleCancelReview = () => {
    setIsReviewing(false);
    setExtractedData(null);
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload Sales Document</CardTitle>
              <CardDescription>
                Upload a photo of a sales document to automatically extract the net weight, crop, and date.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sales-doc">Document Photo</Label>
                <Input id="sales-doc" type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
              </div>
              {previewUrl && (
                <div className="relative mt-4 h-64 w-full overflow-hidden rounded-md border">
                  <Image src={previewUrl} alt="Sales document preview" layout="fill" objectFit="contain" />
                </div>
              )}
              {error && (
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Extraction Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleExtractData} disabled={!photoDataUri || loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Extract Data for Review
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <SalesDashboard />
        </div>
      </div>
      
      <Dialog open={isReviewing} onOpenChange={setIsReviewing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
              <DialogTitle>Review Extracted Sales Data</DialogTitle>
              <DialogDescription>
                  The AI has extracted the crop, net weight ("poids net"), and date. Please review and correct any information before saving.
              </DialogDescription>
          </DialogHeader>
          <SalesDataForm 
              initialData={extractedData}
              onSubmit={handleConfirmSale}
              onCancel={handleCancelReview}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
