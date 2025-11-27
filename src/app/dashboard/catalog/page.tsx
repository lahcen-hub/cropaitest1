
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { MoreHorizontal, PlusCircle, BookCopy, Trash2, Edit, Bot, Loader2, Upload, AlertCircle } from "lucide-react";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { useToast } from "@/hooks/use-toast";
import { type Product } from "@/lib/types";
import { ProductForm } from "@/components/product-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { extractCatalogDataAction } from "./actions";

export default function CatalogPage() {
  const { profile, products, addProduct, updateProduct, deleteProduct, addMultipleProducts } = useFarmProfile();
  const { toast } = useToast();
  
  // State for manual add/edit form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // State for AI import
  const [catalogFile, setCatalogFile] = useState<File | null>(null);
  const [catalogPreview, setCatalogPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedProducts, setExtractedProducts] = useState<Omit<Product, 'id'>[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);


  const handleFormSubmit = (data: Product) => {
    if (editingProduct) {
      updateProduct({ ...data, id: editingProduct.id });
      toast({ title: "Produit Mis à Jour", description: `${data.name} a été mis à jour.` });
    } else {
      addProduct(data);
      toast({ title: "Produit Ajouté", description: `${data.name} a été ajouté à votre catalogue.` });
    }
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleCloseDialog = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
    toast({ title: "Produit Supprimé", variant: "destructive" });
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { 
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "Veuillez télécharger un fichier de moins de 4 Mo.",
        });
        return;
      }
      setError(null);
      setCatalogFile(file);
      if (file.type.startsWith("image/")) {
        setCatalogPreview(URL.createObjectURL(file));
      } else {
        setCatalogPreview(null);
      }
    }
  };

  const handleExtract = async () => {
    if (!catalogFile || !profile) return;

    setLoading(true);
    setError(null);
    setExtractedProducts([]);

    const reader = new FileReader();
    reader.readAsDataURL(catalogFile);
    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      const result = await extractCatalogDataAction({
        documentDataUri: dataUri,
        preferredLanguage: profile.preferredLanguage,
      });

      setLoading(false);
      if (result.error || !result.data) {
        setError(result.error || "L'extraction a échoué. Aucune donnée retournée.");
        toast({ variant: "destructive", title: "Erreur d'Extraction", description: result.error });
      } else {
        setExtractedProducts(result.data.products);
        setIsReviewing(true);
        toast({ title: "Extraction Réussie", description: `${result.data.products.length} produits trouvés. Veuillez vérifier.` });
        setCatalogFile(null);
        setCatalogPreview(null);
      }
    };
  };

  const handleConfirmExtraction = () => {
    addMultipleProducts(extractedProducts);
    toast({ title: "Catalogue Mis à Jour", description: `${extractedProducts.length} produits ont été ajoutés.`});
    setIsReviewing(false);
    setExtractedProducts([]);
  }

  
  if (profile?.role !== 'supplier') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Accès Refusé</CardTitle>
                <CardDescription>Cette page est uniquement disponible pour les fournisseurs.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Importer un Catalogue avec l'IA</CardTitle>
          <CardDescription>
            Gagnez du temps en téléchargeant votre catalogue de produits (image ou PDF). L'IA extraira les informations pour vous.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="catalog-file">Fichier du Catalogue</Label>
            <Input id="catalog-file" type="file" accept="image/*,application/pdf" onChange={handleFileChange} disabled={loading} />
          </div>
          {catalogPreview && (
            <div className="relative mt-4 h-48 w-full max-w-sm overflow-hidden rounded-md border">
              <Image src={catalogPreview} alt="Aperçu du catalogue" layout="fill" objectFit="contain" />
            </div>
          )}
          {catalogFile && !catalogPreview && (
             <div className="mt-4 p-4 text-center text-sm bg-muted rounded-md text-muted-foreground">
                Fichier PDF sélectionné : {catalogFile.name}
             </div>
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
          <Button onClick={handleExtract} disabled={!catalogFile || loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            {loading ? "Analyse en cours..." : "Extraire les Produits"}
          </Button>
        </CardFooter>
      </Card>


      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Catalogue de Produits</CardTitle>
              <CardDescription>
                Gérez vos produits ici. Ajoutez de nouveaux produits manuellement ou via l'importation IA.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un Produit Manuel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
              <BookCopy className="w-12 h-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Votre catalogue est vide</h3>
              <p className="mt-1 text-sm text-muted-foreground">Cliquez sur "Ajouter un Produit" ou importez un catalogue pour commencer.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          {product.photoDataUri ? (
                              <Image src={product.photoDataUri} alt={product.name} width={48} height={48} className="object-cover rounded-md" />
                          ) : (
                              <BookCopy className="w-6 h-6 text-muted-foreground" />
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="text-right">{product.price.toFixed(2)} MAD</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(product)}>
                            <Edit className="mr-2 h-4 w-4"/>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id!)} className="text-destructive">
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
      
      <Dialog open={isFormOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingProduct ? "Modifier le Produit" : "Ajouter un Nouveau Produit"}</DialogTitle>
                <DialogDescription>
                    Remplissez les détails ci-dessous.
                </DialogDescription>
            </DialogHeader>
            <ProductForm 
                onSubmit={handleFormSubmit}
                initialProduct={editingProduct}
                submitButtonText={editingProduct ? "Enregistrer les Modifications" : "Ajouter le Produit"}
            />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isReviewing} onOpenChange={setIsReviewing}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
              <DialogTitle>Vérifier les Produits Extraits</DialogTitle>
              <DialogDescription>
                  L'IA a extrait {extractedProducts.length} produits. Vérifiez les informations avant de les ajouter à votre catalogue.
              </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-1 -mx-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Unité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extractedProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>{product.price.toFixed(2)} MAD</TableCell>
                    <TableCell>{product.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
              <DialogClose asChild>
                  <Button variant="ghost">Annuler</Button>
              </DialogClose>
              <Button onClick={handleConfirmExtraction}>
                  Confirmer et Ajouter {extractedProducts.length} Produits
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
