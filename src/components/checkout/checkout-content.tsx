"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePaddle } from "@/lib/contexts/paddle";

import { Button } from "../ui/button";
import { CheckoutItems } from "./checkout-items";
import { PriceSection } from "./price-section";

interface Props {
  userEmail?: string;
  userId?: string;
  priceId: string;
}

export function CheckoutContents({ userEmail, userId, priceId }: Props) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { isInitialized, checkoutData, isLoading, paddle } = usePaddle();

  useEffect(() => {
    if (isInitialized && priceId) {
      paddle?.Checkout.open({
        ...(userEmail && { customer: { email: userEmail } }),
        items: [{ priceId, quantity: 1 }],
        customData: {
          userId,
          userEmail,
        },
        settings: {
          showAddDiscounts: false,
          theme: "light",
          variant: "one-page",
          displayMode: "inline",
          allowLogout: true,
          frameTarget: "paddle-checkout-frame",
          frameInitialHeight: 600,
          frameStyle: "width: 100%; background-color: white;  border: none;",
          successUrl: `${window.location.origin}/checkout/success`,
        },
      });
    }
  }, [isInitialized, priceId, userEmail, resolvedTheme, paddle]);

  return (
    <div className="w-screen">
      <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <div className={"grid grid-cols-1 lg:grid-cols-2 w-full min-h-screen"}>
        <div className={"w-full bg-muted/50 px-6 pt-20 lg:py-20 lg:px-16 flex justify-center lg:justify-end"}>
          <div className={"hidden lg:flex flex-col gap-6 w-full max-w-[400px]"}>
            <PriceSection checkoutData={checkoutData} isLoading={isLoading} />
            <CheckoutItems checkoutData={checkoutData} />
          </div>
          <div className={"lg:hidden flex flex-col items-center w-full max-w-[400px]"}>
            <PriceSection checkoutData={checkoutData} isLoading={isLoading} />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-none flex flex-col gap-4 items-center">
                <AccordionTrigger className={"w-fit"}>
                  <span className="text-muted-foreground no-underline!">Order summary</span>
                </AccordionTrigger>
                <AccordionContent className={"pb-16"}>
                  <CheckoutItems checkoutData={checkoutData} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className={"px-6 py-16 lg:py-20 lg:px-16 shadow-lg flex justify-center lg:justify-start"}>
          <div className={"w-full max-w-[540px]"}>
            <div className="paddle-checkout-frame" />
          </div>
        </div>
      </div>
    </div>
  );
}
