import { PricingSection } from "@/components/features/home/pricing-section";

export default function Pricing() {
  return (
    <>
      <div className="flex flex-col gap-0 relative">
        <section className="bg-background w-full px-5 sm:px-6 py-24 lg:py-32">
          <div className="max-w-screen-lg mx-auto">
            <PricingSection />
          </div>
        </section>
      </div>
    </>
  );
}
