import { authGetUser } from "@/app/api/auth/auth-middleware";
import { CurrentSubscription } from "@/components/billing/current-subscription";

export default async function BillingPage() {
  const user = await authGetUser();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <section id="billing-section" className="relative max-w-screen-lg mx-auto w-full px-5 py-10">
      <div className="space-y-8">
        <CurrentSubscription userId={user.uid} />

        {/* <TransactionList userId={user.uid} /> */}
      </div>
    </section>
  );
}
