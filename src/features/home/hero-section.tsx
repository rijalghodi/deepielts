"use client";

import { Sparkles } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export function HeroSection() {
  const { user } = useAuth();
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6 lg:gap-8 items-center", user && "gap-4 md:gap-4 lg:gap-4")}>
      <Badge variant="light" size="lg">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>{APP_NAME}</span>
      </Badge>

      <h1
        className={cn(
          "text-[36px] md:text-[60px] lg:text-[64px] leading-tight tracking-normal font-semibold text-center",
          user && "text-[28px] md:text-[36px] lg:text-[40px] leading-snug",
        )}
      >
        IELTS Writing Feedback <br /> <span className="text-primary">Powered by AI</span>
      </h1>
      <p className={cn("text-lg md:text-2xl text-center text-muted-foreground", user && "text-lg md:text-xl")}>
        Instant feedback. Band 9 insights. Improve fast.
      </p>
    </div>
  );
}
