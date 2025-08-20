"use client";

import { Brain, Crown, FileDown, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { create } from "zustand";

import { PRICING_PLANS } from "@/lib/constants/pricing";
import { useAuth } from "@/lib/contexts/auth-context";
import { usePaddlePrices } from "@/lib/contexts/paddle";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type State = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useCheckoutDialog = create<State>((set) => ({
  open: false,
  onOpenChange: (open) => set({ open }),
}));

export function CheckoutDialog() {
  const { open, onOpenChange } = useCheckoutDialog();
  const router = useRouter();
  const { user } = useAuth();
  const { prices, loading } = usePaddlePrices();

  const handleCheckout = (frequency: "month" | "quarter") => {
    const proPlan = PRICING_PLANS.find((plan) => plan.title === "Pro");
    if (proPlan?.priceIds?.[frequency]) {
      router.push(`/checkout/${proPlan.priceIds[frequency]}`);
      onOpenChange(false);
    }
  };

  const getPrice = (frequency: "month" | "quarter") => {
    const proPlan = PRICING_PLANS.find((plan) => plan.title === "Pro");
    const priceId = proPlan?.priceIds?.[frequency];
    if (priceId && prices[priceId]) {
      return prices[priceId].formattedPrice;
    }
    // Fallback prices if Paddle prices aren't loaded yet
    return frequency === "month" ? "$12" : "$30";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border-0">
        <div className="relative p-6">
          {/* Header */}
          <DialogHeader className="flex flex-col items-center text-center mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">Upgrade to Pro</DialogTitle>
            <DialogDescription className="">Unlimited essay evaluation</DialogDescription>
          </DialogHeader>

          {/* Features */}
          <div className="space-y-5 mb-6">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">1000+ IELTS Practice Questions</p>
                <p className="text-sm text-muted-foreground">Access comprehensive practice materials</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Unlimited IELTS Writing Scoring</p>
                <p className="text-sm text-muted-foreground">Get unlimited evaluations for your essays</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Advanced & In-Depth Feedback</p>
                <p className="text-sm text-muted-foreground">Receive detailed analysis and improvement tips</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileDown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Export result to PDF file</p>
                <p className="text-sm text-muted-foreground">Save and share your results easily</p>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="space-y-3 mb-6">
            {/* <Button className="w-full relative" onClick={() => handleCheckout("quarter")} disabled={loading}>
              Quarterly Plan - {getPrice("quarter")}/3 months
            </Button> */}

            {user?.activeSubscription ? (
              <Button
                variant="outline"
                className="w-full bg-success/10 text-success hover:bg-success/10 hover:text-success cursor-default"
              >
                Already have a subscription
              </Button>
            ) : (
              <Button variant="default" className="w-full" onClick={() => handleCheckout("month")} disabled={loading}>
                Upgrade to Pro - {getPrice("month")}/month
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By upgrading you agree to our{" "}
              <Link href="/terms-of-service" className="text-primary cursor-pointer hover:underline">
                terms of service
              </Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
