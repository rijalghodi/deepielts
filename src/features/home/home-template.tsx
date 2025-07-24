"use client";

import { FallingStarsBackground } from "@/components/ui/falling-stars-bg";
import { Spotlight } from "@/components/ui/spotlight-new";
import { Sparkles } from "lucide-react";
import React from "react";
import { SubmissionForm } from "./submission-form";

export function HomeTemplate() {
  return (
    <div className="flex flex-col gap-4">
      {/* HERO SECTION */}

      <section className="flex flex-col gap-4 relative items-center mt-5">
        <div className="flex items-center gap-2 text-sm bg-muted text-foreground border rounded-full px-3 py-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>AI-Powered. Trained on 1000s of real essays</span>
        </div>

        <h1 className="text-[80px] leading-tight tracking-normal font-semibold text-center">
          IELTS Writing Feedback <br /> <span className="text-primary">Powered by AI</span>
        </h1>
        <p className="text-2xl text-center text-muted-foreground mt-4">
          Instant feedback. Band 9 insights. Improve faster.
        </p>

        <SubmissionForm />
      </section>

      {/* TRIAL SECTION */}
      <section className="flex flex-col gap-4">
        <h1>HomeTemplate</h1>
      </section>
    </div>
  );
}
