import { StatePage } from "@/components/ui/state-page";

export default async function SuccessPage() {
  return (
    <main>
      <StatePage
        title="Payment successful"
        description="Success! Your payment is complete, and you're all set."
        icon="success"
      />
    </main>
  );
}
