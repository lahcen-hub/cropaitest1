
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash2, Edit, Users } from "lucide-react";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { useToast } from "@/hooks/use-toast";
import { type Employee } from "@/lib/types";
import { EmployeeForm } from "@/components/employee-form";

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useFarmProfile();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleFormSubmit = (data: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      updateEmployee({ ...data, id: editingEmployee.id });
      toast({ title: "Employé Mis à Jour", description: `${data.name} a été mis à jour.` });
    } else {
      addEmployee(data);
      toast({ title: "Employé Ajouté", description: `${data.name} a été ajouté à votre liste.` });
    }
    setEditingEmployee(null);
    setIsFormOpen(false);
  };

  const handleOpenDialog = (employee: Employee | null = null) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };
  
  const handleCloseDialog = () => {
    setEditingEmployee(null);
    setIsFormOpen(false);
  };

  const handleDelete = (employeeId: string) => {
    deleteEmployee(employeeId);
    toast({ title: "Employé Supprimé", variant: "destructive" });
  };

  return (
    <div>
      <Dialog open={isFormOpen} onOpenChange={handleCloseDialog}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestion des Employés</CardTitle>
                <CardDescription>
                  Gérez votre personnel ici. Ajoutez de nouveaux employés et suivez leurs informations.
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un Employé
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                <Users className="w-12 h-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Aucun employé ajouté</h3>
                <p className="mt-1 text-sm text-muted-foreground">Cliquez sur "Ajouter un Employé" pour commencer.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="capitalize">{employee.role}</TableCell>
                      <TableCell>{employee.contact}</TableCell>
                      <TableCell>
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                          {employee.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir le menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(employee)}>
                              <Edit className="mr-2 h-4 w-4"/>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(employee.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingEmployee ? "Modifier l'Employé" : "Ajouter un Nouvel Employé"}</DialogTitle>
                <DialogDescription>
                    Remplissez les détails ci-dessous.
                </DialogDescription>
            </DialogHeader>
            <EmployeeForm 
                onSubmit={handleFormSubmit}
                initialEmployee={editingEmployee}
                submitButtonText={editingEmployee ? "Enregistrer les Modifications" : "Ajouter l'Employé"}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
