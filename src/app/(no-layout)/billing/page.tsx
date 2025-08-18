"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { BillingSection } from "@/components/billing/billing-section";

export default function BillingPage() {
  const router = useRouter();
  const { user } = useAuth();

  // For demo purposes, using mock customerId
  // In production, this would come from the user's subscription data
  const mockCustomerId = "demo-customer-id";

  if (!user) {
    return (
      <div className="w-screen">
        <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-4">Please log in to view your billing information.</p>
            <Button onClick={() => router.push("/")}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen">
      <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-screen">
        <div className="w-full bg-muted/50 px-6 pt-20 lg:py-20 lg:px-16 flex justify-center lg:justify-end">
          <div className="hidden lg:flex flex-col gap-6 w-full max-w-[400px]">
            <BillingSection userId={user.id} customerId={mockCustomerId} />
          </div>

          {/* Mobile View */}
          <div className="lg:hidden flex flex-col items-center w-full max-w-[400px]">
            <BillingSection userId={user.id} customerId={mockCustomerId} />
          </div>
        </div>

        <div className="px-6 py-16 lg:py-20 lg:px-16 shadow-lg flex justify-center lg:justify-start">
          <div className="w-full max-w-[540px]">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Billing & Subscription</h1>
              <p className="text-muted-foreground">
                Manage your subscription, view billing history, and access invoices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
