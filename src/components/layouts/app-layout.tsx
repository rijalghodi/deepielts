"use client";

import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Header } from "./app-header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      setScrolled(el.scrollTop > 20);
      console.log(el.scrollTop);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  console.log(scrolled);

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
      <div ref={scrollRef} className="flex-1 overflow-auto px-6">
        <header
          className={cn(
            "sticky max-w-screen-lg mx-auto py-4 transition-all duration-300 z-50",
            scrolled
              ? "bg-muted/50 backdrop-blur-lg rounded-full border shadow-lg mt-3"
              : "bg-transparent border-0 shadow-none",
          )}
        >
          <Header />
        </header>
        <main className="mt-[60px]">
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
