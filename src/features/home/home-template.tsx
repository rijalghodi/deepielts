"use client";

import { Sparkles } from "lucide-react";
import React from "react";

import { APP_NAME } from "@/lib/constants";

import { DoodleArrow } from "@/components/ui/icons/doodle-arrow";

import FaqSection from "./faq-section";
import PricingSection from "./pricing-section";
import { SubmissionForm } from "./submission-form";
import { TestimonialSection } from "./testimonial-section";

export function HomeTemplate() {
  return (
    <div className="flex flex-col gap-4">
      {/* HERO SECTION */}

      <section className="relative flex flex-col gap-4 items-center pt-10 pb-12 w-full max-w-screen-lg mx-auto">
        <div className="flex items-center gap-2 text-sm bg-muted text-foreground border rounded-full px-3 py-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>AI-Powered. Trained on 1000s of real essays</span>
        </div>

        <h1 className="text-[36px] md:text-[60px] lg:text-[72px] leading-tight tracking-normal font-semibold text-center">
          IELTS Writing Feedback <br /> <span className="text-primary">Powered by AI</span>
        </h1>
        <p className="text-lg md:text-2xl text-center text-muted-foreground md:mt-2">
          Instant feedback. Band 9 insights. Improve faster.
        </p>
      </section>

      <section className="relative w-full max-w-screen-lg mx-auto">
        <div className="hidden sm:block absolute top-0 right-0 -rotate-10 text-muted-foreground">
          <div className="font-bold text-lg">Try this out</div>
          <DoodleArrow width={90} height={80} />
        </div>
        <SubmissionForm />
      </section>

      {/* FEATURES SECTION */}
      <section className="flex flex-col gap-4 py-10 max-w-screen-lg mx-auto w-full">
        <h2 className="text-2xl font-bold">Stop Paying Money for IELTS Proofreading!</h2>
        <p className="text-muted-foreground">
          {APP_NAME} is a free IELTS writing checker that helps you improve your writing skills. It is a tool that helps
          you check your IELTS writing task 1 and task 2 essays.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section className="flex flex-col gap-4 max-w-screen-lg mx-auto w-full">
        <h1>Features 1. Task 1 Academic</h1>
        <h1>Features 2. Task 1 General</h1>
        <h1>Features 3. Task 2</h1>
      </section>

      {/* TRIAL SECTION */}
      <section className="flex flex-col gap-4 max-w-screen-lg mx-auto w-full">
        <PricingSection />
      </section>

      {/* TRIAL SECTION */}
      <section className="flex flex-col gap-4 max-w-screen-lg mx-auto w-full">
        <TestimonialSection />
      </section>

      {/* FAQ SECTION */}
      <section className="flex flex-col gap-4 max-w-screen-lg mx-auto w-full">
        <FaqSection />
      </section>
    </div>
  );
}
