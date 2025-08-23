// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import {
//   billingCancelSubscription,
//   billingGetSubscription,
//   billingGetSubscriptionKey,
//   billingGetTransactions,
//   billingGetTransactionsKey,
// } from "@/lib/api/billing.api";
// import { cn } from "@/lib/utils";

// import { Button } from "@/components/ui/button";
// import { State } from "@/components/ui/states";

// import { CurrentSubscription } from "./current-subscription";
// import { TransactionList } from "./transaction-list";

// interface Props {
//   userId: string;
//   className?: string;
// }

// export function BillingSection({ userId, className }: Props) {
//   const queryClient = useQueryClient();

//   // Fetch subscription data
//   const {
//     data: subscriptionData,
//     isLoading: subscriptionLoading,
//     error: subscriptionError,
//   } = useQuery({
//     queryKey: billingGetSubscriptionKey(userId),
//     queryFn: () => billingGetSubscription(userId),
//     enabled: !!userId,
//   });

//   // Fetch transactions data
//   const {
//     data: transactionsData,
//     isLoading: transactionsLoading,
//     error: transactionsError,
//   } = useQuery({
//     queryKey: billingGetTransactionsKey(userId),
//     queryFn: () => billingGetTransactions(userId),
//     enabled: !!userId,
//   });

//   // Cancel subscription mutation
//   const cancelMutation = useMutation({
//     mutationFn: billingCancelSubscription,
//     onSuccess: () => {
//       // Invalidate and refetch subscription data
//       queryClient.invalidateQueries({ queryKey: billingGetSubscriptionKey(userId) });
//     },
//   });

//   const subscription = subscriptionData?.data;
//   const transactions = transactionsData?.data || [];
//   const _isLoading = subscriptionLoading || transactionsLoading;
//   const error = subscriptionError || transactionsError;

//   const handleCancelSubscription = async () => {
//     if (!subscription) return;

//     try {
//       await cancelMutation.mutateAsync(subscription.id);
//     } catch (err) {
//       console.error("Error canceling subscription:", err);
//     }
//   };

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <State
//           title="Failed to load billing data"
//           description="There was an error loading your billing information. Please try again later."
//           icon="error"
//         />
//         <Button onClick={() => window.location.reload()} className="mt-4">
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className={cn("space-y-12 w-full", className)}>
//       {/* <CurrentSubscription subscription={subscription || null} isLoading={subscriptionLoading} />

//       <TransactionList transactions={transactions} isLoading={transactionsLoading} /> */}
//     </div>
//   );
// }
