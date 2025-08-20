"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { billingGetPortalUrl, billingGetSubscription, billingGetSubscriptionKey } from "@/lib/api/billing.api";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  userId: string;
}

export function CurrentSubscription({ userId }: Props) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const queryClient = useQueryClient();
  // const [showPortal, setShowPortal] = useState(false);

  // Fetch subscription data
  const { data, isLoading, error } = useQuery({
    queryKey: billingGetSubscriptionKey(userId),
    queryFn: () => billingGetSubscription(userId),
    enabled: !!userId,
  });

  // const {
  //   data: portalUrlData,
  //   isLoading: isPortalUrlLoading,
  //   error: portalUrlError,
  // } = useQuery({
  //   queryKey: billingGetPortalUrlKey(userId),
  //   queryFn: () => billingGetPortalUrl(userId),
  //   enabled: !!userId && showPortal,
  // });

  // // Cancel subscription mutation
  // const { mutate: cancelSubscription, isPending: isCanceling } = useMutation({
  //   mutationFn: (subscriptionId: string) => billingCancelSubscription(subscriptionId),
  //   onSuccess: () => {
  //     // Invalidate and refetch subscription data
  //     queryClient.invalidateQueries({ queryKey: billingGetSubscriptionKey(userId) });
  //     setShowCancelDialog(false);
  //   },
  //   onError: (error) => {
  //     console.error("Failed to cancel subscription:", error);
  //     // You might want to show a toast notification here
  //   },
  // });

  const handleManageSubscription = async () => {
    const response = await billingGetPortalUrl(userId);

    const url = response?.data?.url;
    if (url) {
      window.open(url, "_blank");
    }
  };

  const subscription = data?.data;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-36 mb-4" />
          <Skeleton className="h-4 w-36 mb-4" />
          <Skeleton className="h-4 w-36" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 md:flex-row flex-col justify-between">
            {subscription ? (
              <div className="space-y-4 mt-2 max-w-md w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product</span>
                  <span className="text-sm font-medium">{subscription.productName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-medium">
                    {subscription.currencyCode} {subscription.price} /{" "}
                    {subscription.billingCycleFrequency === 1 ? "" : subscription.billingCycleFrequency}{" "}
                    {subscription.billingCycleInterval}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={cn(getStatusColor(subscription.status))}>
                    {subscription.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Started</span>
                  <span className="text-sm font-medium">
                    {subscription.startedAt
                      ? new Date(subscription.startedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
                {subscription.nextBilledAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Next Billing</span>
                    <span className="text-sm font-medium">
                      {new Date(subscription.nextBilledAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {subscription.canceledAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Canceled</span>
                    <span className="text-sm font-medium">
                      {new Date(subscription.canceledAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            ) : error ? (
              <p className="text-sm text-muted-foreground">Error loading subscription.</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {(error as any)?.message || "No active subscription found."}
              </p>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="accent" onClick={handleManageSubscription}>
                Manage Subscription
              </Button>
              {/* {subscription && subscription.status !== "canceled" && (
                <Button variant="destructive" onClick={() => setShowCancelDialog(true)} disabled={isCanceling}>
                  {isCanceling ? "Canceling..." : "Cancel Subscription"}
                </Button>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Confirmation Dialog */}
      {/* <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? This action cannot be undone. Your subscription will
              remain active until the end of the current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={isCanceling}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCanceling}>
              {isCanceling ? "Canceling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-success/10 text-success";
    case "canceled":
      return "bg-destructive/10 text-destructive";
    case "past_due":
      return "bg-warning/10 text-warning";
    case "paused":
      return "bg-neutral/10 text-neutral";
    default:
      return "bg-neutral/10 text-neutral";
  }
};
