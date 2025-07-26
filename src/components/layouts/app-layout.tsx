"use client";

import { Loader } from "lucide-react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, useSidebar } from "@/components/ui/sidebar";

import AppFooter from "./app-footer";
import { AppHeader } from "./app-header";
import { FallingStarsBackground } from "../ui/falling-stars-bg";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { open, isMobile } = useSidebar();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center gap-12">
          <Loader className="animate-spin w-6 h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen">
      {user && <AppSidebar userName={user.name} />}

      <AppHeader />

      <div
        className={cn("relative w-screen transition-[padding-left] duration-200 ease-linear overflow-hidden")}
        style={{
          paddingLeft: isMobile ? "0" : open && user ? SIDEBAR_WIDTH : user ? SIDEBAR_WIDTH_ICON : "0",
          marginTop: 60,
        }}
      >
        <FallingStarsBackground className="z-0" />
        <div
          style={{
            background: "z-0 radial-gradient(at center, rgba(255, 255, 255, 0.02), transparent 50%)",
            width: 1000,
            height: 1000,
            borderRadius: "100%",
            transform: "translate(-50%, -50%)",
          }}
          className={`absolute top-0 left-0`}
        />
        <div
          style={{
            background: "z-0 radial-gradient(at center, rgba(255, 255, 255, 0.02), transparent 50%)",
            width: 1000,
            height: 1000,
            borderRadius: "100%",
            transform: "translate(50%, -50%)",
          }}
          className={`absolute top-0 right-0`}
        />
        {children}
        <AppFooter />
      </div>
    </div>
  );
}
