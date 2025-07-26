import { Sparkles } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <Badge variant="outline" className="!font-normal !bg-muted !py-1.5 px-3.5">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>AI-Powered. Trained on real essays</span>
      </Badge>

      <h1 className="text-[36px] md:text-[60px] lg:text-[64px] leading-tight tracking-normal font-semibold text-center">
        IELTS Writing Feedback <br /> <span className="text-primary">Powered by AI</span>
      </h1>
      <p className="text-lg md:text-2xl text-center text-muted-foreground">
        Instant feedback. Band 9 insights. Improve fast.
      </p>
    </div>
  );
}
