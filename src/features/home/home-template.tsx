"use client";

import React from "react";

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
      <section className="max-w-screen-lg mx-auto w-full px-5 md:px-6 pt-16 sm:pt-8 pb-8">
        <HeroSection />
      </section>
      <section className="relative max-w-screen-lg mx-auto w-full px-5 md:px-6 pt-6 pb-32 lg:pb-36 overflow-hidden">
        <SubmissionForm />
      </section>

      <section className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <FeaturesSection />
        </div>
      </section>

      <section className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <VsTraditionalSection />
        </div>
      </section>

      <section className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
        <div className="max-w-screen-xl w-fit mx-auto">
          <TestimonialSection />
        </div>
      </section>

      <section className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <PricingSection />
        </div>
      </section>

      <section className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <FaqSection />
        </div>
      </section>

      <section className="w-full px-5 md:px-6 py-24 lg:py-32">
        <div className="max-w-screen-lg mx-auto">
          <CtaSection />
        </div>
      </section>
    </div>
  );
}
