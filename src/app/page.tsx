"use client";

import { Suspense } from "react";

import { CtaSection } from "@/components/features/home/cta-section";
import { FaqSection } from "@/components/features/home/faq-section";
import { FeaturesSection } from "@/components/features/home/features-section";
import { HeroSection } from "@/components/features/home/hero-section";
import { PricingSection } from "@/components/features/home/pricing-section";
import { SubmissionSection } from "@/components/features/home/submission-section";
import { TestimonialSection } from "@/components/features/home/testimonial-section";
import { VsTraditionalSection } from "@/components/features/home/vs-traditional-section";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-0 relative">
        <section className="max-w-screen-lg mx-auto w-full px-5 md:px-6 pt-16 sm:pt-8 pb-8">
          <HeroSection />
        </section>

        <section className="relative max-w-screen-lg mx-auto w-full px-5 md:px-6 pt-6 pb-32 lg:pb-36 overflow-hidden">
          <Suspense>
            <SubmissionSection />
          </Suspense>
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
    </>
  );
}
