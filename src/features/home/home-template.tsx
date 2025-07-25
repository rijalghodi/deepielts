"use client";

import React from "react";

import { DoodleArrow } from "@/components/ui/icons/doodle-arrow";

import CtaSection from "./cta-section";
import FaqSection from "./faq-section";
import FeaturesSection from "./features-section";
import { HeroSection } from "./hero-section";
import PricingSection from "./pricing-section";
import { SubmissionForm } from "./submission-form";
import { TestimonialSection } from "./testimonial-section";
import VsTraditionalSection from "./vs-traditional-section";

export function HomeTemplate() {
  return (
    <div className="flex flex-col gap-0 relative">
      {/* HERO SECTION */}
      <section className="max-w-screen-lg mx-auto w-full px-4 md:px-6 pt-8 pb-8">
        <HeroSection />
      </section>
      <section className="relative max-w-screen-lg mx-auto w-full px-4 md:px-6 pt-6 pb-32 lg:pb-36">
        <div className="hidden sm:block absolute top-0 right-0 -rotate-10 text-muted-foreground">
          <div className="font-bold text-lg">Try this out</div>
          <DoodleArrow width={90} height={80} />
        </div>
        <SubmissionForm />
      </section>
      {/* FEATURES SECTION */}
      <section className="bg-muted w-full px-4 md:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <FeaturesSection />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-muted w-full px-4 md:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <VsTraditionalSection />
        </div>
      </section>
      {/* TESTIMONIAL SECTION */}
      <section className="bg-background w-full px-4 md:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <TestimonialSection />
        </div>
      </section>
      {/* PRICING SECTION */}
      <section className="relative bg-background w-full px-4 md:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <PricingSection />
          {/* <Spotlight /> */}
        </div>
      </section>
      {/* FAQ SECTION */}
      <section className="flex flex-col gap-4 max-w-screen-lg mx-auto w-full px-4 md:px-6 py-24 lg:py-32">
        <FaqSection />
      </section>

      {/* CTA SECTION */}
      <section className="bg-background w-full px-4 md:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <CtaSection />
        </div>
      </section>
    </div>
  );
}
