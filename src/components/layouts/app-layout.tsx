"use client";

import { Loader } from "lucide-react";

import { useAuth } from "@/lib/contexts/auth-context";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Header } from "./app-header";
import { FallingStarsBackground } from "../ui/falling-stars-bg";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

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
    <SidebarProvider>
      {user && <AppSidebar userName={user.name} />}

      {/* Scrollable area */}
      <div className="flex-1 relative">
        {/* <div
          className="absolute inset-0 h-screen w-screen"
          style={{
            background: "radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.05), transparent 70%)",
          }}
        /> */}
        <FallingStarsBackground className="z-0" />

        {/* HEADER */}
        <Header />

        <main className="mx-auto mt-6 relative">
          {children}
          {/* filler content to make it scrollable */}
          {Array.from({ length: 100 }).map((_, i) => (
            <p key={i}>Hellox</p>
          ))}
        </main>
      </div>
    </SidebarProvider>
  );
}
