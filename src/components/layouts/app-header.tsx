"use client";

import { Crown, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AuthDialog } from "@/components/auth/auth-dialog";

import { useCheckoutDialog } from "../home/checkout-dialog";
import { ASIDE_WIDTH, useAside } from "../ui/aside";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, useSidebar } from "../ui/sidebar";
import { ThemeToggle } from "../ui/theme-toggle";

export function AppHeader() {
  const { user } = useAuth();
  const { onOpenChange: setOpenCheckoutDialog } = useCheckoutDialog();
  const { open: sidebarOpen, isMobile: isSidebarMobile } = useSidebar();
  const { open: asideOpen, isMobile: isAsideMobile } = useAside();

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
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="fixed inset-x-0 top-2 z-50 transition-all duration-200 ease-linear px-5"
      style={{
        left: isSidebarMobile ? "0" : sidebarOpen && user ? SIDEBAR_WIDTH : user ? SIDEBAR_WIDTH_ICON : "0",
        right: isAsideMobile ? "0" : asideOpen ? ASIDE_WIDTH : "0",
      }}
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
            <Logo width={80} height={50} className="w-[60px] h-auto md:w-[70px]" />
          </Link>

          <div className="flex gap-2 items-center">
            <div>
              {user ? (
                <Button onClick={() => setOpenCheckoutDialog(true)}>
                  <Crown />
                  Upgrade to Pro
                </Button>
              ) : (
                <Suspense
                  fallback={
                    <Button>
                      Login <Sparkles />
                    </Button>
                  }
                >
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
    </motion.header>
  );
}
