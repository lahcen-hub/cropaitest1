
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { extractSalesDataAction } from "./actions";
import { Loader2, AlertCircle, Bot, Upload, BarChart, LineChart, Trash2 } from "lucide-react";
import { type SalesData, type SaleRecord } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { type DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SalesDashboard() {
  const { sales, deleteSale, profile } = useFarmProfile();
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
        const saleDate = new Date(sale.transactionDate || sale.timestamp);
        const isInDateRange = !dateRange || (dateRange.from && dateRange.to && saleDate >= dateRange.from && saleDate <= dateRange.to);
        const hasSelectedCrop = selectedCrop === 'all' || sale.items.some(item => item.cropName === selectedCrop);
        return isInDateRange && hasSelectedCrop;
      })
      .sort((a, b) => new Date(b.transactionDate || b.timestamp).getTime() - new Date(a.transactionDate || a.timestamp).getTime());
  }, [sales, dateRange, selectedCrop]);

  const chartConfig = {
    total: {
      label: "Sales",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const chartData = useMemo(() => {
    const revenuePerCrop = new Map<string, number>();
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        revenuePerCrop.set(item.cropName, (revenuePerCrop.get(item.cropName) || 0) + item.totalPrice);
      });
    });
    const barChartData = Array.from(revenuePerCrop.entries()).map(([name, total]) => ({ name, total }));

    const salesByDate = new Map<string, number>();
     filteredSales.forEach(sale => {
        const date = new Date(sale.transactionDate || sale.timestamp).toISOString().split('T')[0];
        salesByDate.set(date, (salesByDate.get(date) || 0) + sale.totalAmount);
    });
    const lineChartData = Array.from(salesByDate.entries()).map(([date, total]) => ({ date, total })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return { barChartData, lineChartData };
  }, [filteredSales]);

  if (sales.length === 0) {
    return (
      <Card className="flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6">
        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <BarChart className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-foreground font-headline">No sales data yet</h3>
        <p className="mt-1 text-muted-foreground">Upload your first sales receipt to see your dashboard.</p>
      </Card>
    );
  }

  return (
     <Tabs defaultValue="overview">
        <div className="flex flex-wrap items-center gap-4 mb-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="all-sales">All Sales</TabsTrigger>
            </TabsList>
            <div className="flex-grow" />
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

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue per Crop</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ChartContainer config={chartConfig}>
              <RechartsBarChart accessibilityLayer data={chartData.barChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} className="text-xs capitalize"/>
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} className="text-xs"/>
                <RechartsTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
                <RechartsLineChart accessibilityLayer data={chartData.lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(profile?.preferredLanguage, {month: 'short', day: 'numeric'})} tickLine={false} axisLine={false} tickMargin={8} className="text-xs"/>
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} className="text-xs"/>
                    <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-total)" }} activeDot={{ r: 6 }} />
                </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="all-sales">
        <Card>
          <CardHeader>
            <CardTitle>All Sales Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSales.map(sale => (
                        <TableRow key={sale.id}>
                            <TableCell>{new Date(sale.transactionDate || sale.timestamp).toLocaleDateString()}</TableCell>
                            <TableCell>{sale.vendorName || 'N/A'}</TableCell>
                            <TableCell>{sale.items.map(i => `${i.quantity} ${i.unit} ${i.cropName}`).join(', ')}</TableCell>
                            <TableCell className="text-right font-medium">{sale.totalAmount.toFixed(2)} {sale.currency}</TableCell>
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
      </TabsContent>
    </Tabs>
  )
}

export default function SalesIntelligencePage() {
  const { profile, addSale } = useFarmProfile();
  const { toast } = useToast();
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
        setPreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
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

    const result = await extractSalesDataAction({
      photoDataUri,
      preferredLanguage: profile.preferredLanguage,
    });

    if (result.error) {
      setError(result.error);
       toast({
        variant: "destructive",
        title: "Extraction Failed",
        description: result.error,
      });
    } else if (result.data) {
      addSale(result.data, photoDataUri);
      toast({
        title: "Success!",
        description: "Your sales data has been extracted and saved.",
      });
      setPhotoDataUri(null);
      setPreviewUrl(null);
    }

    setLoading(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Upload Sales Document</CardTitle>
            <CardDescription>
              Upload a photo of a receipt, invoice, or handwritten note.
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
            <Button onClick={handleSubmit} disabled={!photoDataUri || loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Extract & Save Data
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <SalesDashboard />
      </div>
    </div>
  );
}
