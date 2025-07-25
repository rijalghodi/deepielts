"use client";

import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AuthDialog } from "@/features/auth/login/auth-dialog";

import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { ThemeToggle } from "../ui/theme-toggle";

export function Header() {
  const { user } = useAuth();

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
      className={cn(
        "sticky z-50 top-4 max-w-screen-lg mx-auto py-3 transition-all duration-300 rounded-xl px-3.5 border",
        scrolled
          ? "bg-background/50 dark:bg-muted/50 backdrop-blur-lg border-border shadow-lg"
          : "bg-transparent border-transparent shadow-none",
      )}
    >
      <div className="flex justify-between items-center w-full">
        <Link href="/" className="flex gap-2 items-center">
          <Logo width={100} height={50} />
        </Link>

        <div className="flex gap-4">
          <div className="hidden md:block">
            {user ? (
              <Button>
                <Crown />
                Upgrade to Pro
              </Button>
            ) : (
              <AuthDialog>
                <Button>
                  Login <Sparkles />
                </Button>
              </AuthDialog>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
