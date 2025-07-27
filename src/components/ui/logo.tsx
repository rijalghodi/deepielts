"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

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
  const isDark = resolvedTheme === "dark";

  if (isDark) {
    return <Image src={logoDark} alt="Logo" width={width} height={height} className={cn("h-auto", className)} />;
  }

  return <Image src={logoLight} alt="Logo" width={width} height={height} className={cn("h-auto", className)} />;
}
