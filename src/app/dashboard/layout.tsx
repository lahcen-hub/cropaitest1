
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
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { FarmProfileProvider, useFarmProfile } from "@/contexts/farm-profile-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
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
  Truck,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useFarmProfile();
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const navItemsConfig = {
    farmer: [
        { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { href: "/dashboard/sales-intelligence", label: "Analyse des Ventes", icon: TrendingUp },
        { href: "/dashboard/invoice-intelligence", label: "Analyse des Factures", icon: Receipt },
        { href: "/dashboard/cargo-dashboard", label: "Tableau de Bord des Cargaisons", icon: Truck },
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
  };

  const navItems = navItemsConfig[profile?.role || 'farmer'];
  const avatarName = profile?.role === 'supplier' ? profile.companyName : profile?.role;
  const currentNavItem = navItems.slice().sort((a, b) => b.href.length - a.href.length).find(item => pathname.startsWith(item.href));
  const pageTitle = currentNavItem?.label || "Tableau de Bord";


  return (
    <SidebarProvider>
      <Sidebar>
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
        <SidebarFooter>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/profile" className="flex-grow">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://placehold.co/100x100.png`} />
                  <AvatarFallback className="capitalize bg-primary text-primary-foreground">
                    {avatarName ? getInitials(avatarName) : <User />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium capitalize text-sidebar-foreground">
                    {avatarName}
                  </span>
                  <span className="text-xs text-muted-foreground">Voir le Profil</span>
                </div>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col w-full">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="flex items-center gap-4">
             <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-bold tracking-tight">
              {pageTitle}
            </h1>
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
