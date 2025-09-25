
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { BarChart, Users, Euro, Activity } from "lucide-react";

// Données statiques pour la démonstration
const kpis = [
  {
    title: "Total des Utilisateurs",
    value: "1,250",
    change: "+15.2% ce mois-ci",
    icon: Users,
  },
  {
    title: "Revenu Total (MRR)",
    value: "25,480 MAD",
    change: "+8.1% ce mois-ci",
    icon: Euro,
  },
  {
    title: "Abonnements Actifs",
    value: "450",
    change: "+32 abonnements",
    icon: Activity,
  },
  {
    title: "Taux de Désabonnement",
    value: "2.1%",
    change: "-0.5% ce mois-ci",
    icon: BarChart,
  },
];

const users = [
  {
    id: "usr_1",
    name: "Ahmed Bennani",
    email: "ahmed.b@example.com",
    role: "farmer",
    plan: "Agriculteur Pro",
    joinDate: "2023-01-15",
  },
  {
    id: "usr_2",
    name: "Fatima El Fassi",
    email: "fatima.ef@example.com",
    role: "technician",
    plan: "Agro-Entreprise",
    joinDate: "2023-02-20",
  },
  {
    id: "usr_3",
    name: "AgriFournitures SA",
    email: "contact@agrifournitures.com",
    role: "supplier",
    plan: "Agro-Entreprise",
    joinDate: "2023-03-10",
  },
  {
    id: "usr_4",
    name: "Youssef Alaoui",
    email: "youssef.a@example.com",
    role: "farmer",
    plan: "Débutant",
    joinDate: "2023-04-05",
  },
    {
    id: "usr_5",
    name: "Leila Tazi",
    email: "leila.t@example.com",
    role: "farmer",
    plan: "Agriculteur Pro",
    joinDate: "2023-05-21",
  },
];

const roleVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
    farmer: 'default',
    technician: 'secondary',
    supplier: 'destructive'
};


export default function AdminDashboardPage() {
    const { profile } = useFarmProfile();

    if (profile?.role !== 'admin') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Accès non autorisé</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Vous n'avez pas la permission de voir cette page.</p>
                </CardContent>
            </Card>
        )
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Tableau de Bord Administrateur</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Plan d'Abonnement</TableHead>
                <TableHead>Date d'Inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleVariant[user.role] || 'outline'} className="capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.plan === 'Agriculteur Pro' ? 'default' : 'secondary'}>{user.plan}</Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
