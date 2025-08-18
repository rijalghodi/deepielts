"use client";

import { CreditCard, FileText, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  billingGetSubscription,
  billingGetTransactions,
  billingCancelSubscription,
  billingGetSubscriptionKey,
  billingGetTransactionsKey,
} from "@/lib/api/billing.api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { State } from "@/components/ui/states";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  customerId?: string;
  className?: string;
}

export function BillingSection({ userId, customerId, className }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch subscription data
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useQuery({
    queryKey: billingGetSubscriptionKey(userId),
    queryFn: () => billingGetSubscription(userId),
    enabled: !!userId,
  });

  // Fetch transactions data
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: billingGetTransactionsKey(customerId || ""),
    queryFn: () => billingGetTransactions(customerId || ""),
    enabled: !!customerId,
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: billingCancelSubscription,
    onSuccess: () => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({ queryKey: billingGetSubscriptionKey(userId) });
    },
  });

  const subscription = subscriptionData?.data;
  const transactions = transactionsData?.data || [];
  const isLoading = subscriptionLoading || transactionsLoading;
  const error = subscriptionError || transactionsError;

  const handleUpdateSubscription = () => {
    router.push("/pricing");
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      await cancelMutation.mutateAsync(subscription.id);
    } catch (err) {
      console.error("Error canceling subscription:", err);
    }
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <State
          title="Failed to load billing data"
          description="There was an error loading your billing information. Please try again later."
          icon="error"
        />
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            {subscription ? "Your active subscription details" : "No active subscription"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Started</span>
                <span className="text-sm font-medium">
                  {subscription.startedAt ? new Date(subscription.startedAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              {subscription.nextBilledAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Billing</span>
                  <span className="text-sm font-medium">
                    {new Date(subscription.nextBilledAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {subscription.canceledAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Canceled</span>
                  <span className="text-sm font-medium">{new Date(subscription.canceledAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active subscription found.</p>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>Your payment history and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {transaction.amount} {transaction.currencyCode}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => window.open(transaction.invoiceUrl, "_blank")}>
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {transactions.length > 5 && (
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  View All ({transactions.length})
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No transactions found.</p>
          )}
        </CardContent>
      </Card>

      {/* Subscription Management */}
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
              onClick={handleCancelSubscription}
              disabled={cancelMutation.isPending}
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              {cancelMutation.isPending ? "Canceling..." : "Cancel Subscription"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
