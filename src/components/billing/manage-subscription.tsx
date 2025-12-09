"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Subscription } from "@/lib/api/billing.api";

interface Props {
  subscription: Subscription | null;
  isLoading: boolean;
  onCancelSubscription: () => Promise<void>;
  isCanceling: boolean;
}

export function ManageSubscription({ subscription, isLoading, onCancelSubscription, isCanceling }: Props) {
  const router = useRouter();

  const handleUpdateSubscription = () => {
    router.push("/pricing");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Manage Subscription
        </CardTitle>
        <CardDescription>Update or cancel your subscription</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleUpdateSubscription} className="w-full">
          Update Plan
        </Button>
        {subscription && subscription.status === "active" && (
          <Button
            variant="outline"
            onClick={onCancelSubscription}
            disabled={isCanceling}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            {isCanceling ? "Canceling..." : "Cancel Subscription"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
