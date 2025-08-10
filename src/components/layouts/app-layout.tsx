"use client";

import { Bot, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import { AIAside } from "./ai-aside";
import AppFooter from "./app-footer";
import { AppHeader } from "./app-header";
import { AsideInset, AsideTrigger, useAside } from "../ui/aside";
import { Button } from "../ui/button";
import { FallingStarsBackground } from "../ui/falling-stars-bg";

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
              <Bot className="h-4 w-4" /> AI Assitant{" "}
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
          <div
            className={cn("relative transition-[padding-left] duration-200 ease-linear overflow-hidden")}
            style={{
              paddingTop: 60,
            }}
          >
            <FallingStarsBackground className="z-0" />
            <div
              style={{
                background: "radial-gradient(at center, rgba(255, 255, 255, 0.03), transparent 50%)",
                width: 1200,
                height: 1200,
                borderRadius: "100%",
                transform: "translate(-50%, -50%)",
              }}
              className={`absolute top-0 left-0 z-0`}
            />
            <div
              style={{
                background: "radial-gradient(at center, rgba(255, 255, 255, 0.03), transparent 50%)",
                width: 1200,
                height: 1200,
                borderRadius: "100%",
                transform: "translate(50%, -50%)",
              }}
              className={`absolute top-0 right-0 z-0`}
            />
            {children}
            <AppFooter />
          </div>
        </AsideInset>
      </SidebarInset>
      {isDashboard && <AIAside />}
    </>
  );
}
