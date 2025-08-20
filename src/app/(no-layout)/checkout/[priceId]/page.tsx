import { CheckoutContents } from "@/components/checkout/checkout-content";

import { authGetUser } from "@/app/api/auth/auth-middleware";
import { getSubscriptionByUserId } from "@/server/services/subscription.repo";

interface CheckoutPageProps {
  params: Promise<{ priceId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { priceId } = await params;
  const user = await authGetUser();
  const subscription = await getSubscriptionByUserId(user?.uid ?? "");

  if (!user) {
    return <div>Unauthorized</div>;
  }

  // if (subscription) {
  //   return <div>Already have an active subscription</div>;
  // }

  if (!priceId) {
    return <div>No priceId</div>;
  }

  return (
    <main>
      <CheckoutContents userEmail={user?.email} userId={user?.uid} priceId={priceId} />
    </main>
  );
}
