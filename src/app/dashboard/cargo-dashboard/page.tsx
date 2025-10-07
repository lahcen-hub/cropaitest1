
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { useFarmProfile } from '@/contexts/farm-profile-context';

const db = getFirestore(app);

type Calculation = {
  id: string;
  date: string;
  clientName: string;
  totalCrates: number;
  results: {
    grandTotalPriceRiyal: number;
  };
};

/**
 * Composant pour afficher le tableau de bord des cargaisons d'un agriculteur.
 * Récupère et affiche en temps réel les données de la collection 'calculations'
 * pour une liste de chauffeurs spécifiée.
 */
function FarmerCargoDashboard() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { employees } = useFarmProfile();

  const farmerDriverUids = useMemo(() => {
    return employees.filter(e => e.role === 'driver').map(e => e.id);
  }, [employees]);

  useEffect(() => {
    // Ne pas exécuter la requête si la liste des chauffeurs est vide.
    if (!farmerDriverUids || farmerDriverUids.length === 0) {
      setCalculations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Créer la requête Firestore pour filtrer par UID de chauffeur.
    const calculationsQuery = query(
      collection(db, "calculations"),
      where("uid", "in", farmerDriverUids)
    );

    // Mettre en place l'écouteur en temps réel.
    const unsubscribe = onSnapshot(calculationsQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Calculation));
      setCalculations(data);
      setLoading(false);
    }, (err) => {
      console.error("Erreur lors de la récupération des calculs : ", err);
      setError("Impossible de charger les données des cargaisons. Veuillez vérifier votre connexion à Firebase.");
      setLoading(false);
    });

    // Nettoyer l'écouteur lors du démontage du composant pour éviter les fuites de mémoire.
    return () => unsubscribe();
  }, [farmerDriverUids]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tableau de Bord des Cargaisons</CardTitle>
        <CardDescription>
          Suivez les données de pesée envoyées en temps réel par vos chauffeurs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex flex-col items-center justify-center text-center p-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Chargement des données des cargaisons...</p>
          </div>
        )}
        {!loading && error && (
            <div className="flex flex-col items-center justify-center text-center p-12 text-destructive">
                 <p>{error}</p>
                 <p className="text-sm text-muted-foreground mt-2">Assurez-vous que vos informations de configuration Firebase sont correctes dans `src/lib/firebase/config.ts`.</p>
            </div>
        )}
        {!loading && !error && calculations.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
            <Truck className="w-12 h-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Aucune donnée de cargaison trouvée</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {farmerDriverUids.length > 0
                ? "Aucune donnée de cargaison n'a été trouvée pour les chauffeurs que vous avez ajoutés."
                : "Veuillez d'abord ajouter des employés avec le rôle 'Chauffeur' dans la page 'Gestion des Employés'."}
            </p>
          </div>
        )}
        {!loading && !error && calculations.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Nom du Client</TableHead>
                <TableHead>Caisses Totales</TableHead>
                <TableHead className="text-right">Prix Total (MAD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculations.map(calc => (
                <TableRow key={calc.id}>
                  <TableCell>
                    {calc.date ? format(new Date(calc.date), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">{calc.clientName}</TableCell>
                  <TableCell>{calc.totalCrates}</TableCell>
                  <TableCell className="text-right">
                    {calc.results?.grandTotalPriceRiyal?.toFixed(2) ?? '0.00'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default FarmerCargoDashboard;
