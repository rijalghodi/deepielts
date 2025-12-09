import { authGetUser } from "@/app/api/auth/auth-middleware";
import { CheckoutContents } from "@/components/checkout/checkout-content";
import { StatePage } from "@/components/ui/state-page";
import { getSubscriptionByUserId } from "@/server/services/subscription.repo";

interface CheckoutPageProps {
  params: Promise<{ priceId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { priceId } = await params;
  const user = await authGetUser();
  const subscription = await getSubscriptionByUserId(user?.uid ?? "");

  if (!user) {
    return <StatePage title="Unauthorized" description="Please login to continue" icon="error" />;
  }

  if (subscription) {
    return (
      <StatePage
        title="Already have an active subscription"
        icon="success"
        description="Enjoy unlimited essay evaluation"
        link="/dashboard"
        linkLabel="Go to Dashboard"
      />
    );
  }

  if (!priceId) {
    return <StatePage title="Invalid URL. No priceId" description="Please check the URL and try again" icon="error" />;
  }

  return (
    <main>
      <CheckoutContents userEmail={user.email} userId={user.uid} priceId={priceId} />
    </main>
  );
}
