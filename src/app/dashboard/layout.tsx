
"use client";

import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FarmProfileProvider, useFarmProfile } from "@/contexts/farm-profile-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HeartPulse,
  CalendarDays,
  Map,
  LogOut,
  LayoutDashboard,
  User,
  TrendingUp,
  Store,
  BookCopy,
  Inbox,
  FlaskConical,
  Receipt,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useFarmProfile();
  const pathname = usePathname();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const navItemsConfig = useMemo(() => ({
    farmer: [
        { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { href: "/dashboard/sales-intelligence", label: "Analyse des Ventes", icon: TrendingUp },
        { href: "/dashboard/invoice-intelligence", label: "Analyse des Factures", icon: Receipt },
        { href: "/dashboard/employees", label: "Gestion des Employés", icon: Users },
        { href: "/dashboard/plant-doctor", label: "Docteur des Plantes", icon: HeartPulse },
        { href: "/dashboard/soil-analysis", label: "Analyse de Sol", icon: FlaskConical },
        { href: "/dashboard/farm-calendar", label: "Calendrier Agricole", icon: CalendarDays },
        { href: "/dashboard/marketplace", label: "Marché", icon: Store },
        { href: "/dashboard/nearby", label: "Ressources à Proximité", icon: Map },
    ],
    technician: [
        { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { href: "/dashboard/plant-doctor", label: "Docteur des Plantes", icon: HeartPulse },
        { href: "/dashboard/farm-calendar", label: "Calendrier Agricole", icon: CalendarDays },
        { href: "/dashboard/marketplace", label: "Marché", icon: Store },
        { href: "/dashboard/nearby", label: "Ressources à Proximité", icon: Map },
    ],
    supplier: [
        { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { href: "/dashboard/catalog", label: "Catalogue de Produits", icon: BookCopy },
        { href: "/dashboard/messages", label: "Messages & Commandes", icon: Inbox },
        { href: "/dashboard/nearby", label: "Ressources à Proximité", icon: Map },
    ],
  }), []);

  const navItems = useMemo(() => navItemsConfig[profile?.role || 'farmer'], [profile?.role, navItemsConfig]);
  const avatarName = profile?.role === 'supplier' ? profile.companyName : profile?.role;
  const currentNavItem = navItems.slice().sort((a, b) => b.href.length - a.href.length).find(item => pathname.startsWith(item.href));
  const pageTitle = currentNavItem?.label || "Tableau de Bord";

  useEffect(() => {
    // Prefetch all navigation links to make page transitions faster
    navItems.forEach(item => {
      router.prefetch(item.href);
    });
  }, [navItems, router]);


  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton 
                    isActive={currentNavItem?.href === item.href}
                    tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="flex items-center gap-4">
             <SidebarTrigger />
            <h1 className="text-xl font-bold tracking-tight">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://placehold.co/100x100.png`} />
                    <AvatarFallback className="capitalize bg-primary text-primary-foreground">
                      {avatarName ? getInitials(avatarName) : <User />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">
                      {avatarName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FarmProfileProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </FarmProfileProvider>
  );
}
