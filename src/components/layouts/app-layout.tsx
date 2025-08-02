"use client";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SidebarInset, useSidebar } from "@/components/ui/sidebar";

import AppFooter from "./app-footer";
import { AppHeader } from "./app-header";
import { FallingStarsBackground } from "../ui/falling-stars-bg";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { open, isMobile } = useSidebar();

  return (
    <div className="relative w-screen">
      {user && <AppSidebar userName={user.name} />}

      <SidebarInset>
        <AppHeader />
        <div
          className={cn("relative w-screen transition-[padding-left] duration-200 ease-linear overflow-hidden")}
          style={{
            paddingLeft: isMobile ? "0" : open && user ? SIDEBAR_WIDTH : user ? SIDEBAR_WIDTH_ICON : "0",
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
      </SidebarInset>
    </div>
  );
}
