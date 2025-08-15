"use client";

import { useParams } from "next/navigation";

import { useAuth } from "@/lib/contexts/auth-context";

import { CheckoutSection } from "@/components/checkout/checkout-section";

export default function CheckoutPage() {
  const { priceId } = useParams<{ priceId: string }>();
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <CheckoutSection userEmail={user?.email} priceId={priceId} quantity={1} />
    </div>
  );
}
