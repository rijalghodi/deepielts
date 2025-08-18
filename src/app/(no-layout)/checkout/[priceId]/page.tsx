import { CheckoutContents } from "@/components/checkout/checkout-content";

import { authGetUser } from "@/app/api/auth/auth-middleware";

interface CheckoutPageProps {
  params: Promise<{ priceId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { priceId } = await params;
  const user = await authGetUser();

  if (!priceId) {
    return <div>No priceId</div>;
  }

  return (
    <main>
      <CheckoutContents userEmail={user?.email} userId={user?.uid} priceId={priceId} />
    </main>
  );
}
