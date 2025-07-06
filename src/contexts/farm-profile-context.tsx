"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { type FarmProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

type FarmProfileContextType = {
  profile: FarmProfile | null;
  loading: boolean;
  logout: () => void;
};

const FarmProfileContext = createContext<FarmProfileContextType | undefined>(undefined);

export const FarmProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('farm-profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        router.push('/');
      }
    } catch (error) {
        console.error("Failed to parse farm profile", error);
        localStorage.removeItem('farm-profile');
        router.push('/');
    } finally {
        setLoading(false);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('farm-profile');
    setProfile(null);
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

  return (
    <FarmProfileContext.Provider value={{ profile, loading, logout }}>
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
