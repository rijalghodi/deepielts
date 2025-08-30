import { Suspense } from "react";

import { CtaSection } from "@/components/home/cta-section";
import { FaqSection } from "@/components/home/faq-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { PricingSection } from "@/components/home/pricing-section";
import { SubmissionSection } from "@/components/home/submission-section";
import { SubmissionSectionSkeleton } from "@/components/home/submission-section/submission-section-skeleton";
import { VsTraditionalSection } from "@/components/home/vs-traditional-section";
import { FallingStarsBackground } from "@/components/ui/falling-stars-bg";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-0 relative">
        <div className="relative w-full">
          <FallingStarsBackground className="z-0" />
          <div
            style={{
              background: "radial-gradient(at center, rgba(255, 255, 255, 0.03), transparent 50%)",
              width: 1200,
              height: 1200,
              borderRadius: "100%",
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute top-0 left-0 z-0`}
          />
          <div
            style={{
              background: "radial-gradient(at center, rgba(255, 255, 255, 0.03), transparent 50%)",
              width: 1200,
              height: 1200,
              borderRadius: "100%",
              transform: "translate(50%, -50%)",
            }}
            className={`absolute top-0 right-0 z-0`}
          />
          <section
            id="hero-section"
            className="relative max-w-screen-lg mx-auto w-full px-5 md:px-6 pt-16 sm:pt-8 pb-8"
          >
            <HeroSection />
          </section>

          <section
            id="submission-section"
            className="relative max-w-screen-lg mx-auto w-full px-5 md:px-6 pt-6 pb-32 lg:pb-36 overflow-hidden"
          >
            <Suspense fallback={<SubmissionSectionSkeleton />}>
              <SubmissionSection />
            </Suspense>
          </section>
        </div>

        <section id="features-section" className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
          <div className="max-w-screen-lg mx-auto">
            <FeaturesSection />
          </div>
        </section>

        <section id="vs-traditional-section" className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
          <div className="max-w-screen-lg mx-auto">
            <VsTraditionalSection />
          </div>
        </section>
        {/* 
        <section id="testimonial-section" className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
          <div className="max-w-screen-xl w-fit mx-auto">
            <TestimonialSection />
          </div>
        </section> */}

        <section id="pricing-section" className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
          <div className="max-w-screen-lg mx-auto">
            <PricingSection />
          </div>
        </section>

        <section id="faq-section" className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
          <div className="max-w-screen-lg mx-auto">
            <FaqSection />
          </div>
        </section>

        <section id="cta-section" className="w-full px-5 md:px-6 py-24 lg:py-32">
          <div className="max-w-screen-lg mx-auto">
            <CtaSection />
          </div>
        </section>
      </div>
    </>
  );
}
