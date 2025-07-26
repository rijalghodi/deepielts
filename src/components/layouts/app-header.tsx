"use client";

import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AuthDialog } from "@/features/auth/login/auth-dialog";

import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, useSidebar } from "../ui/sidebar";
import { ThemeToggle } from "../ui/theme-toggle";

export function AppHeader() {
  const { user } = useAuth();
  const { open, isMobile } = useSidebar();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 32);
    });

    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-200 ease-linear px-5"
      style={{ left: isMobile ? "0" : open && user ? SIDEBAR_WIDTH : user ? SIDEBAR_WIDTH_ICON : "0" }}
    >
      <div
        className={cn(
          "max-w-screen-lg w-full py-3 transition-all duration-300 rounded-xl px-3.5 border mx-auto",
          scrolled
            ? "bg-background/50 dark:bg-muted/50 backdrop-blur-lg border-border shadow-lg"
            : "border-transparent shadow-none",
        )}
      >
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="flex gap-2 items-center">
            <Logo width={100} height={50} className="w-[80px] h-auto md:w-[100px]" />
          </Link>

          <div className="flex gap-4">
            <div>
              {user ? (
                <Button>
                  <Crown />
                  Upgrade to Pro
                </Button>
              ) : (
                <Suspense>
                  <AuthDialog>
                    <Button>
                      Login <Sparkles />
                    </Button>
                  </AuthDialog>
                </Suspense>
              )}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
