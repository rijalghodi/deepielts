"use client";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import AppFooter from "./app-footer";
import { AppHeader } from "./app-header";
import { FallingStarsBackground } from "../ui/falling-stars-bg";
import { AppAside } from "./app-aside";
import { AsideInset, AsideTrigger } from "../ui/aside";
import { Button } from "../ui/button";
import { ArrowRight, Blocks } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <>
      {user && <AppSidebar userName={user.name} />}
      <div className="fixed top-1/2 -translate-y-1/2 right-0 z-50">
        <AsideTrigger asChild>
          <button className="flex items-center gap-2 bg-foreground text-background rounded-r-md px-5 font-semibold shadow-lg py-2.5 [writing-mode:vertical-lr] rotate-180 hover:bg-foreground/90 hover:text-primary transition-colors duration-200">
            Open Toolbox <Blocks className="w-4 h-4" />
          </button>
        </AsideTrigger>
      </div>
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
      <AppAside />
    </>
  );

  // return (
  //   <div className="relative w-screen">
  //     {user && <AppSidebar userName={user.name} />}

  //     <SidebarInset>
  //       <AppHeader />
  // <div
  //   className={cn("relative w-screen transition-[padding-left] duration-200 ease-linear overflow-hidden")}
  //   style={{
  //     paddingLeft: isMobile ? "0" : open && user ? SIDEBAR_WIDTH : user ? SIDEBAR_WIDTH_ICON : "0",
  //     paddingTop: 60,
  //   }}
  // >
  //   <FallingStarsBackground className="z-0" />
  //   <div
  //     style={{
  //       background: "radial-gradient(at center, rgba(255, 255, 255, 0.03), transparent 50%)",
  //       width: 1200,
  //       height: 1200,
  //       borderRadius: "100%",
  //       transform: "translate(-50%, -50%)",
  //     }}
  //     className={`absolute top-0 left-0 z-0`}
  //   />
  //   <div
  //     style={{
  //       background: "radial-gradient(at center, rgba(255, 255, 255, 0.03), transparent 50%)",
  //       width: 1200,
  //       height: 1200,
  //       borderRadius: "100%",
  //       transform: "translate(50%, -50%)",
  //     }}
  //     className={`absolute top-0 right-0 z-0`}
  //   />
  //   {children}
  //   <AppFooter />
  // </div>
  //     </SidebarInset>
  //   </div>
  // );
}
