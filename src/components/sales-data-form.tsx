
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SalesDataSchema, type SalesData } from "@/lib/types";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type SalesDataFormProps = {
  onSubmit: (data: SalesData) => void;
  initialData: SalesData | null;
  submitButtonText?: string;
  onCancel: () => void;
};

export function SalesDataForm({ onSubmit, initialData, submitButtonText = "Confirm & Save Sale", onCancel }: SalesDataFormProps) {
  const form = useForm<SalesData>({
    resolver: zodResolver(SalesDataSchema),
    defaultValues: initialData || {
      items: [],
      totalAmount: 0,
      currency: "USD",
      vendorName: "",
      transactionDate: new Date().toISOString().split('T')[0],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });
  
  const totalCalculated = fields.reduce((acc, item, index) => {
    const price = form.watch(`items.${index}.totalPrice`) || 0;
    return acc + price;
  }, 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="vendorName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Central Market" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Transaction Date</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <Separator />
        
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Sale Items</h3>
            {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md relative space-y-2">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remove Item</span>
                </Button>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     <FormField
                        control={form.control}
                        name={`items.${index}.cropName`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Crop</FormLabel>
                            <FormControl><Input placeholder="Tomato" {...field} /></FormControl>
                            <FormMessage/>
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl><Input type="number" placeholder="10" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
                             <FormMessage/>
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`items.${index}.unit`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl><Input placeholder="kg" {...field} /></FormControl>
                             <FormMessage/>
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unit Price</FormLabel>
                            <FormControl><Input type="number" placeholder="1.50" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
                             <FormMessage/>
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`items.${index}.totalPrice`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Price</FormLabel>
                            <FormControl><Input type="number" placeholder="15.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
                             <FormMessage/>
                        </FormItem>
                        )}
                    />
                </div>
            </div>
            ))}
             <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ cropName: "", quantity: 0, unit: "kg", unitPrice: 0, totalPrice: 0 })}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
            </Button>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Receipt Total</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 15.99" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., TND" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <div className="text-sm">
                <span className="text-muted-foreground">Calculated Total: </span>
                <span className="font-medium">{totalCalculated.toFixed(2)}</span>
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {submitButtonText}
            </Button>
        </div>
      </form>
    </Form>
  );
}
