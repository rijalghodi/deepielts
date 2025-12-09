"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import logoDark from "~/logo-dark.png";
import logoLight from "~/logo-light.png";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function Logo({ width = 100, height = 100, className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const logo = isDark ? logoDark : logoLight;

  return <Image src={logo} alt="Logo" width={width} height={height} className={cn("h-auto", className)} />;
}
