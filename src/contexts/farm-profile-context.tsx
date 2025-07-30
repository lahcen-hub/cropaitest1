
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { type FarmProfile, type SalesData, type SaleRecord, type Product, type InvoiceData, type InvoiceRecord } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

type FarmProfileContextType = {
  profile: FarmProfile | null;
  sales: SaleRecord[];
  invoices: InvoiceRecord[];
  products: Product[];
  loading: boolean;
  logout: () => void;
  updateProfile: (newProfile: FarmProfile) => void;
  addSale: (saleData: SalesData) => void;
  deleteSale: (saleId: string) => void;
  addInvoice: (invoiceData: InvoiceData) => void;
  deleteInvoice: (invoiceId: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
};

const FarmProfileContext = createContext<FarmProfileContextType | undefined>(undefined);

export const FarmProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('farm-profile');
      const storedSales = localStorage.getItem('sales-data');
      const storedInvoices = localStorage.getItem('invoices-data');
      const storedProducts = localStorage.getItem('products-data');

      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        // Add cucumber to crops if it's not there for the user
        if (parsedProfile.crops && !parsedProfile.crops.includes('cucumber')) {
            parsedProfile.crops.push('cucumber');
        }
        setProfile(parsedProfile);

      } else {
        router.push('/signup');
        return; // Stop execution if no profile
      }
      if (storedSales) {
        setSales(JSON.parse(storedSales));
      }
      if (storedInvoices) {
        setInvoices(JSON.parse(storedInvoices));
      }
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        localStorage.removeItem('farm-profile');
        localStorage.removeItem('sales-data');
        localStorage.removeItem('invoices-data');
        localStorage.removeItem('products-data');
        router.push('/signup');
    } finally {
        setLoading(false);
    }
  }, [router]);

  const updateProfile = (newProfile: FarmProfile) => {
    setProfile(newProfile);
    localStorage.setItem('farm-profile', JSON.stringify(newProfile));
  };

  const addSale = useCallback((saleData: Omit<SalesData, 'photoDataUri'>) => {
    const newSale: SaleRecord = {
        ...saleData,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
    };
    setSales(prevSales => {
        const updatedSales = [newSale, ...prevSales];
        localStorage.setItem('sales-data', JSON.stringify(updatedSales));
        return updatedSales;
    });
  }, []);

  const deleteSale = useCallback((saleId: string) => {
    setSales(prevSales => {
        const updatedSales = prevSales.filter(sale => sale.id !== saleId);
        localStorage.setItem('sales-data', JSON.stringify(updatedSales));
        return updatedSales;
    });
  }, []);

  const addInvoice = useCallback((invoiceData: InvoiceData) => {
    const newInvoice: InvoiceRecord = {
        ...invoiceData,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
    };
    setInvoices(prevInvoices => {
        const updatedInvoices = [newInvoice, ...prevInvoices];
        localStorage.setItem('invoices-data', JSON.stringify(updatedInvoices));
        return updatedInvoices;
    });
  }, []);

  const deleteInvoice = useCallback((invoiceId: string) => {
    setInvoices(prevInvoices => {
        const updatedInvoices = prevInvoices.filter(invoice => invoice.id !== invoiceId);
        localStorage.setItem('invoices-data', JSON.stringify(updatedInvoices));
        return updatedInvoices;
    });
  }, []);

  const addProduct = useCallback((productData: Product) => {
    const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
    };
    setProducts(prevProducts => {
        const updatedProducts = [newProduct, ...prevProducts];
        localStorage.setItem('products-data', JSON.stringify(updatedProducts));
        return updatedProducts;
    });
  }, []);
  
  const updateProduct = useCallback((updatedProduct: Product) => {
      setProducts(prevProducts => {
          const updatedProductsList = prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p);
          localStorage.setItem('products-data', JSON.stringify(updatedProductsList));
          return updatedProductsList;
      });
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prevProducts => {
        const updatedProducts = prevProducts.filter(p => p.id !== productId);
        localStorage.setItem('products-data', JSON.stringify(updatedProducts));
        return updatedProducts;
    });
  }, []);

  const logout = () => {
    localStorage.removeItem('farm-profile');
    localStorage.removeItem('sales-data');
    localStorage.removeItem('invoices-data');
    localStorage.removeItem('products-data');
    setProfile(null);
    setSales([]);
    setInvoices([]);
    setProducts([]);
    router.push('/');
  }

  if (loading) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
          <Logo />
          <Loader2 className="mt-4 h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }
  
  const contextValue = { profile, sales, invoices, setSales, products, loading, logout, updateProfile, addSale, deleteSale, addInvoice, deleteInvoice, addProduct, updateProduct, deleteProduct };

  return (
    <FarmProfileContext.Provider value={contextValue}>
      {!loading && profile && children}
    </FarmProfileContext.Provider>
  );
};

export const useFarmProfile = () => {
  const context = useContext(FarmProfileContext);
  if (context === undefined) {
    throw new Error('useFarmProfile must be used within a FarmProfileProvider');
  }
  return context;
};
