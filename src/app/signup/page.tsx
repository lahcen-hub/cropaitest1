
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FarmProfileForm } from "@/components/farm-profile-form";
import { FarmProfile } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function SignUpPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const profile = localStorage.getItem("farm-profile");
    if (profile) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleProfileCreate = (profile: FarmProfile) => {
    localStorage.setItem("farm-profile", JSON.stringify(profile));
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Logo />
        <Loader2 className="mt-4 h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline">
            Welcome to Your Smart Farm Assistant
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create your farm profile to get personalized insights.
          </p>
        </div>
        <FarmProfileForm onSubmit={handleProfileCreate} />
      </div>
    </main>
  );
}
