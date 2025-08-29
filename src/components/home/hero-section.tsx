"use client";

import { Sparkles } from "lucide-react";
import React from "react";

import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const { user } = useAuth();
  return (
    <div className={cn("space-y-6 lg:space-y-8 items-center")}>
      <div className="flex justify-center">
        <Badge variant="light" size="lg">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{APP_NAME}</span>
        </Badge>
      </div>

      <h1
        className={cn(
          "text-[36px] md:text-[60px] lg:text-[64px] leading-tight tracking-normal font-semibold text-center",
          user && "text-[28px] md:text-[36px] lg:text-[40px] leading-snug",
        )}
      >
        IELTS Writing Checker <br /> <span className="text-primary">Powered by AI</span>
      </h1>

      {!user && (
        <p className={cn("text-lg md:text-2xl text-center text-muted-foreground")}>
          Instant feedback. Band 9 insights. Improve fast.
        </p>
      )}
    </div>
  );
}
