import { Percent } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
    <div className="w-full">
      {/* Title */}
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14 space-y-4">
        <Badge variant="light" size="lg">
          <Percent className="h-3 w-3 mr-1" />
          Affordable
        </Badge>
        <h2 className="section-title">Pricing Plans</h2>
        <p className="section-desc">Start with the free plan, and upgrade to Pro anytime for more features.</p>
      </div>

      {/* Desktop: Grid layout (hidden on small screens) */}
      <div className="hidden md:flex gap-4 justify-center">
        {plans.map((plan) => (
          <PricingCard key={plan.title} {...plan} />
        ))}
      </div>

      {/* Mobile: Carousel layout (hidden on large screens) */}
      <div className="md:hidden w-full">
        <Carousel
          opts={{
            align: "center",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {plans.map((plan) => (
              <CarouselItem key={plan.title} className="flex justify-center">
                <PricingCard {...plan} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPagination />
          <CarouselPrevious className="-left-2" />
          <CarouselNext className="-right-2" />
        </Carousel>
      </div>
    </div>
  );
}
