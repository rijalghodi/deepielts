"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { usePaddleCheckout } from "@/lib/contexts/paddle";

import { Button } from "../ui/button";

type Props = {
  priceId: string;
  quantity: number;
  userEmail?: string;
};

export function CheckoutSection({ priceId, quantity, userEmail }: Props) {
  const { openCheckout, isInitialized } = usePaddleCheckout();

  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    openCheckout({
      priceId,
      quantity,
      userEmail,
      successUrl: `${window.location.origin}/checkout/success`,
    });
  }, [openCheckout, priceId, quantity, userEmail, isInitialized]);

  //   if (!isInitialized) return <div>Loading...</div>;
  return (
    <div className="max-w-screen-lg px-5 mx-auto relative py-5">
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft /> Back
      </Button>
      <div className="checkout-container" />
      {!isInitialized && <div>Checkout not initialized</div>}
    </div>
  );
}
