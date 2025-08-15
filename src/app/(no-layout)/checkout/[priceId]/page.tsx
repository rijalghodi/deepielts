"use client";

import { useParams } from "next/navigation";

import { useAuth } from "@/lib/contexts/auth-context";

import { CheckoutContents } from "@/components/checkout/checkout-content";

export default function CheckoutPage() {
  const { priceId } = useParams<{ priceId: string }>();
  const { user } = useAuth();

  if (!priceId) {
    return <div>No priceId</div>;
  }

  return (
    <div>
      <CheckoutContents userEmail={user?.email} priceId={priceId} />
    </div>
  );
}
