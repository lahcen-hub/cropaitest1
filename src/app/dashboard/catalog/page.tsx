
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
import { MoreHorizontal, PlusCircle, BookCopy, Trash2, Edit } from "lucide-react";
import { useFarmProfile } from "@/contexts/farm-profile-context";
import { useToast } from "@/hooks/use-toast";
import { type Product } from "@/lib/types";
import { ProductForm } from "@/components/product-form";

export default function CatalogPage() {
  const { profile, products, addProduct, updateProduct, deleteProduct } = useFarmProfile();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleFormSubmit = (data: Product) => {
    if (editingProduct) {
      updateProduct({ ...data, id: editingProduct.id });
      toast({ title: "Product Updated", description: `${data.name} has been updated.` });
    } else {
      addProduct(data);
      toast({ title: "Product Added", description: `${data.name} has been added to your catalog.` });
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
    toast({ title: "Product Deleted", variant: "destructive" });
  };
  
  if (profile?.role !== 'supplier') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>This page is only available for suppliers.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div>
      <Dialog open={isFormOpen} onOpenChange={handleCloseDialog}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>
                  Manage your products here. Add new products manually or use our upcoming AI upload feature.
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                <BookCopy className="w-12 h-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Your catalog is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">Click "Add Product" to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Price</TableHead>
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
                      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(product)}>
                              <Edit className="mr-2 h-4 w-4"/>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(product.id!)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
                <DialogTitle>{editingProduct ? "Edit Product" : "Add a New Product"}</DialogTitle>
                <DialogDescription>
                    Fill in the details below.
                </DialogDescription>
            </DialogHeader>
            <ProductForm 
                onSubmit={handleFormSubmit}
                initialProduct={editingProduct}
                submitButtonText={editingProduct ? "Save Changes" : "Add Product"}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
