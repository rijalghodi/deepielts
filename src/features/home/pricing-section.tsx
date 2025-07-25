import React from "react";

import { PricingCard, PricingCardProps } from "@/components/ui/pricing-card";

const plans: PricingCardProps[] = [
  {
    title: "Free",
    description: "Try core features for free",
    features: [
      { name: "1000+ IELTS Practice Questions", included: true },
      { name: "3 Basic IELTS Writing Scoring", included: true },
      { name: "Wait time between two scoring: 3 minute", included: true },
      { name: "Advanced & In-Depth Feedback", included: false },
      { name: "Export result to word file", included: false },
    ],
  },
  {
    title: "Pro",
    description: "Unlimited essay evaluation ",
    popular: true,
    highlighted: true,
    price: {
      week: 2,
      month: 4,
      "3-month": 8,
    },
    features: [
      { name: "1000+ IELTS Practice Questions", included: true },
      { name: "Unlimited Basic IELTS Writing Scoring", included: true },
      { name: "Wait time between two scoring: 1 minute", included: true },
      { name: "Advanced & In-Depth Feedback", included: true },
      { name: "Export result to word file", included: true },
    ],
  },
];
export default function PricingSection() {
  return (
    <div className="w-full px-4 md:px-6 py-24 lg:py-32">
      {/* Title */}
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">Pricing</h2>
        <p className="mt-1 text-muted-foreground">Choose the plan that's right for you.</p>
      </div>
      {/* End Title */}

      <div className="flex gap-4 justify-center">
        {plans.map((plan) => (
          <PricingCard key={plan.title} {...plan} />
        ))}
      </div>
    </div>
  );
}
