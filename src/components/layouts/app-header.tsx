"use client";

import { Crown, Sparkle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { AuthDialog } from "@/features/auth/login/auth-dialog";

import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { ThemeToggle } from "../ui/theme-toggle";

type Menu = {
  title: string;
  link: string;
  openInNewTab?: boolean;
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex justify-between items-center w-full">
      <Link href="/" className="flex gap-2 items-center">
        <Logo width={90} height={32} />
      </Link>

      <div className="flex gap-4">
        <div className="hidden md:block">
          {user ? (
            <Button size="sm">
              <Crown />
              Upgrade to Pro
            </Button>
          ) : (
            <AuthDialog>
              <Button size="sm">
                Login <Sparkle />
              </Button>
            </AuthDialog>
          )}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
