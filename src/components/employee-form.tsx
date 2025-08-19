
"use client";

import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeSchema, type Employee, EMPLOYEE_ROLES } from "@/lib/types";
import { Loader2 } from "lucide-react";

type EmployeeFormProps = {
  onSubmit: (data: Omit<Employee, 'id'>) => void;
  initialEmployee?: Employee | null;
  submitButtonText?: string;
};

export function EmployeeForm({ onSubmit, initialEmployee, submitButtonText = "Ajouter l'Employé" }: EmployeeFormProps) {
  const form = useForm<Omit<Employee, 'id'>>({
    resolver: zodResolver(EmployeeSchema.omit({ id: true })),
    defaultValues: initialEmployee ? {
        name: initialEmployee.name,
        role: initialEmployee.role,
        contact: initialEmployee.contact,
        status: initialEmployee.status,
    } : {
      name: "",
      role: undefined,
      contact: "",
      status: "active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom Complet</FormLabel>
              <FormControl>
                <Input placeholder="ex., Jean Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle de l'Employé</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EMPLOYEE_ROLES.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role === 'driver' ? 'Chauffeur' : 'Ouvrier Agricole'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact (N° de téléphone)</FormLabel>
              <FormControl>
                <Input placeholder="ex., 0612345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
