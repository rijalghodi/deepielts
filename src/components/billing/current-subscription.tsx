"use client";

import { billingGetSubscription, billingGetSubscriptionKey, type Subscription } from "@/lib/api/billing.api";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

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
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
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
                <div className={cn("text-xs font-medium px-2 py-1 rounded-full", getStatusColor(subscription.status))}>
                  {subscription.status.replace("_", " ").toUpperCase()}
                </div>
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
            <Button>Update Plan</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    case "past_due":
      return "bg-yellow-100 text-yellow-800";
    case "paused":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
