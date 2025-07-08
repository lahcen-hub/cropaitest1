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
  Bot,
  User,
  TrendingUp,
} from "lucide-react";
import { usePathname } from "next/navigation";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useFarmProfile();
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const allNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      href: "/dashboard/plant-doctor",
      label: "Plant Doctor",
      icon: HeartPulse,
    },
    {
      href: "/dashboard/farm-calendar",
      label: "Farm Calendar",
      icon: CalendarDays,
    },
    {
      href: "/dashboard/sales-intelligence",
      label: "Sales Intelligence",
      icon: TrendingUp,
    },
    {
      href: "/dashboard/nearby",
      label: "Nearby Resources",
      icon: Map,
    },
  ];

  const navItems = allNavItems.filter(item => {
    if (item.href === "/dashboard/sales-intelligence") {
        return profile?.role === "farmer";
    }
    return true;
  });

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
                  <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.label}>
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
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://placehold.co/100x100.png`} />
                  <AvatarFallback className="capitalize bg-primary text-primary-foreground">
                    {profile?.role ? getInitials(profile.role) : <User />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium capitalize text-sidebar-foreground">
                    {profile?.role}
                  </span>
                  <span className="text-xs text-muted-foreground">View Profile</span>
                </div>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-lg font-semibold md:text-xl font-headline">
            {navItems.find(item => pathname.startsWith(item.href))?.label || "Dashboard"}
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
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
