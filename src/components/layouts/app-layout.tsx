"use client";

import { Bot, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { CheckoutDialog } from "@/components/home/checkout-dialog";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import { AIAside } from "./ai-aside";
import AppFooter from "./app-footer";
import { AppHeader } from "./app-header";
import { AsideInset, AsideTrigger, useAside } from "../ui/aside";
import { Button } from "../ui/button";

const AsideTriggerButton = () => {
  const { isMobile, open, openMobile } = useAside();
  const isOpen = (!isMobile && open) || (isMobile && openMobile);
  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-0 z-50">
      <AsideTrigger asChild>
        <Button
          variant="contrast"
          size="lg"
          className={cn(
            "rounded-none rounded-l-full w-36 transition-all duration-200 shadow-xl",
            isOpen && !isMobile && "w-12",
            isMobile && "-rotate-90 origin-right mr-5 rounded-none rounded-t-lg",
          )}
        >
          {isOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <>
              <Bot className="h-4 w-4" /> Analysis
            </>
          )}
        </Button>
      </AsideTrigger>
    </div>
  );
};

const SidebarMobileTriggerButton = () => {
  const { isMobile } = useSidebar();
  const { user } = useAuth();

  if (!isMobile || !user) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 z-[5]">
      <SidebarTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-none rounded-r-full shadow-xl">
          <Menu />
        </Button>
      </SidebarTrigger>
    </div>
  );
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const { setOpen, setOpenMobile } = useAside();
  const isDashboard = pathname === "/";

  useEffect(() => {
    if (!isDashboard) {
      setOpen(false);
      setOpenMobile(false);
    }
  }, [isDashboard]);

  return (
    <>
      {user && <AppSidebar userName={user.name} />}
      {isDashboard && <AsideTriggerButton />}
      <SidebarMobileTriggerButton />
      <SidebarInset>
        <AsideInset>
          <AppHeader />
          <main
            className={cn(
              "flex flex-col relative transition-[padding-left] duration-200 ease-linear overflow-hidden min-h-screen",
            )}
            style={{
              paddingTop: 60,
            }}
          >
            <div className="flex-1">{children}</div>
            <AppFooter />
          </main>
        </AsideInset>
      </SidebarInset>
      {isDashboard && <AIAside />}
      <SettingsDialog />
      <CheckoutDialog />
      <AuthDialog />
    </>
  );
}
