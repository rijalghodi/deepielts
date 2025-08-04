"use client";

import { Bot, X } from "lucide-react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

import { AppAside } from "./app-aside";
import AppFooter from "./app-footer";
import { AppHeader } from "./app-header";
import { AsideInset, AsideTrigger, useAside } from "../ui/aside";
import { FallingStarsBackground } from "../ui/falling-stars-bg";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { open } = useAside();

  return (
    <>
      {user && <AppSidebar userName={user.name} />}
      <div className="fixed top-1/2 -translate-y-1/2 right-0 z-50">
        <AsideTrigger asChild>
          <button
            className={cn(
              "h-10 text-sm flex items-center justify-center gap-2 bg-foreground text-background px-3 font-semibold shadow-lg py-2.5 hover:bg-foreground/90 hover:text-primary transition-all duration-200 w-36",
              "-rotate-90 lg:rotate-0 origin-right mr-5 lg:mr-0",
              "rounded-t-md lg:rounded-none lg:rounded-l-full",
              open && "w-12",
            )}
          >
            {open ? (
              <X className="h-4 w-4" />
            ) : (
              <>
                <Bot className="h-4 w-4" /> AI Assitant{" "}
              </>
            )}
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
