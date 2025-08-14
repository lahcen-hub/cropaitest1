
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
import { InvoiceDataSchema, type InvoiceData } from "@/lib/types";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "react-use";

type InvoiceDataFormProps = {
  onSubmit?: (data: InvoiceData) => void;
  onUpdate?: (data: InvoiceData) => void;
  initialData: InvoiceData | null;
  submitButtonText?: string;
  onCancel?: () => void;
};

export function InvoiceDataForm({ onSubmit, initialData, submitButtonText, onCancel, onUpdate }: InvoiceDataFormProps) {
  const form = useForm<InvoiceData>({
    resolver: zodResolver(InvoiceDataSchema),
    defaultValues: initialData || {
      items: [],
      transactionDate: new Date().toISOString().split('T')[0],
      supplierName: "",
      totalAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  const watchedData = form.watch();

  useDebounce(() => {
    if (onUpdate && form.formState.isDirty) {
        onUpdate(watchedData);
    }
  }, 300, [watchedData, onUpdate, form.formState.isDirty]);


  const formContent = (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
            control={form.control}
            name="transactionDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Date de Transaction</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="supplierName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nom du Fournisseur</FormLabel>
                <FormControl>
                    <Input placeholder="ex., Agri Fournitures" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
      </div>
      
       <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Montant Total</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="250.75" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

      <Separator />
      
      <div className="space-y-4">
          <h3 className="text-sm font-medium">Articles de la Facture</h3>
          {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-md relative space-y-2">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Supprimer l'Article</span>
              </Button>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Nom de l'Article</FormLabel>
                          <FormControl><Input placeholder="Engrais" {...field} /></FormControl>
                          <FormMessage/>
                      </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Quantité</FormLabel>
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
                          <FormLabel>Unité</FormLabel>
                          <FormControl><Input placeholder="sac" {...field} /></FormControl>
                           <FormMessage/>
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Prix</FormLabel>
                          <FormControl><Input type="number" placeholder="25.50" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
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
              onClick={() => append({ name: "", quantity: 0, unit: "", price: 0 })}
              >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un Article
          </Button>
      </div>
    </>
  );

  if (onSubmit && onCancel && submitButtonText) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
                {formContent}
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    );
  }

  return (
    <Form {...form}>
        <div className="space-y-4">
            {formContent}
        </div>
    </Form>
  );
}
