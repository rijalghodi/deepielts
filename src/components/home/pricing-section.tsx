"use client";

import { Percent } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { BILLING_FREQUENCY, BillingFrequency, PRICING_PLANS } from "@/lib/constants/pricing";
import { useAuth } from "@/lib/contexts/auth-context";
import { usePaddlePrices } from "@/lib/contexts/paddle";

import { useAuthDialog } from "@/components/auth/auth-dialog";
import { Badge } from "@/components/ui/badge";
import { PricingCard } from "@/components/ui/pricing-card";

// import { usePaymentDialog } from "./payment-dialog";
import { ToggleFrequency } from "../checkout/toggle-frequency";
import { Skeleton } from "../ui/skeleton";

export function PricingSection() {
  const router = useRouter();
  const { user } = useAuth();
  const { onOpenChange: toggleAuthDialog } = useAuthDialog();
  const [frequency, setFrequency] = useState<BillingFrequency>(BILLING_FREQUENCY[0]);
  const { prices, loading } = usePaddlePrices("US");

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

      <ToggleFrequency frequency={frequency} setFrequency={setFrequency} />

      <div className="flex flex-col items-center md:items-start md:flex-row gap-4 justify-center">
        {loading ? (
          <>
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="w-full max-w-sm h-[400px] rounded-xl" />
            ))}
          </>
        ) : (
          <>
            {PRICING_PLANS.map((plan) => {
              const priceId = plan.priceIds?.[frequency.value];
              const price = priceId ? prices?.[priceId]?.formattedPrice : null;
              return (
                <PricingCard
                  key={plan.title}
                  {...plan}
                  onClickCta={() => {
                    if (user) {
                      if (priceId === null) {
                        router.push("/#hero-section");
                        return;
                      }
                      router.push(`/checkout/${priceId}`);
                      return;
                    }

                    toggleAuthDialog(true);
                  }}
                  price={priceId === null ? "0" : price}
                  suffixPrice={frequency.suffix}
                  free={priceId === null}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// {/* Mobile: Carousel layout (hidden on large screens) */}
// {/* <div className="md:hidden w-full">
//   <Carousel
//     opts={{
//       align: "center",
//       loop: false,
//     }}
//     className="w-full"
//   >
//     <CarouselContent className="-ml-2 md:-ml-4">
//       {PRICING_PLANS.map((plan) => (
//         <CarouselItem key={plan.title} className="flex justify-center">
//           <PricingCard {...plan} />
//         </CarouselItem>
//       ))}
//     </CarouselContent>
//     <CarouselPagination />
//     <CarouselPrevious className="-left-2" />
//     <CarouselNext className="-right-2" />
//   </Carousel>
// </div> */}
