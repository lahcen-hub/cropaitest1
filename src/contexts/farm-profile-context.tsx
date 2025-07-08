"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { type FarmProfile, type SalesData, type SaleRecord } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

type FarmProfileContextType = {
  profile: FarmProfile | null;
  sales: SaleRecord[];
  loading: boolean;
  logout: () => void;
  updateProfile: (newProfile: FarmProfile) => void;
  addSale: (saleData: SalesData, photoDataUri: string) => void;
  deleteSale: (saleId: string) => void;
};

const FarmProfileContext = createContext<FarmProfileContextType | undefined>(undefined);

export const FarmProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('farm-profile');
      const storedSales = localStorage.getItem('sales-data');

      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        router.push('/signup');
        return; // Stop execution if no profile
      }
      if (storedSales) {
        setSales(JSON.parse(storedSales));
      }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        localStorage.removeItem('farm-profile');
        localStorage.removeItem('sales-data');
        router.push('/signup');
    } finally {
        setLoading(false);
    }
  }, [router]);

  const updateProfile = (newProfile: FarmProfile) => {
    setProfile(newProfile);
    localStorage.setItem('farm-profile', JSON.stringify(newProfile));
  };

  const addSale = useCallback((saleData: SalesData, photoDataUri: string) => {
    const newSale: SaleRecord = {
        ...saleData,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        photoDataUri,
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

  const logout = () => {
    localStorage.removeItem('farm-profile');
    localStorage.removeItem('sales-data');
    setProfile(null);
    setSales([]);
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
  
  const contextValue = { profile, sales, loading, logout, updateProfile, addSale, deleteSale };

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
