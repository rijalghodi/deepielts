"use client";

import { useQuery } from "@tanstack/react-query";

import { billingGetSubscription, billingGetSubscriptionKey } from "@/lib/api/billing.api";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "../ui/button";

interface Props {
  userId: string;
}

export function CurrentSubscription({ userId }: Props) {
  // Fetch subscription data
  const { data, isLoading, error } = useQuery({
    queryKey: billingGetSubscriptionKey(userId),
    queryFn: () => billingGetSubscription(userId),
    enabled: !!userId,
  });

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
    <Card>
      <CardHeader>
        <CardTitle>Current Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 md:flex-row flex-col justify-between">
          {subscription ? (
            <div className="space-y-4 mt-2 max-w-md w-full">
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
            {/* <Button>Update Plan</Button> */}
            <Button variant="accent">Cancel Subscription</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
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
