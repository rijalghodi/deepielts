import { apiGet, apiPost } from "./utils";

import { ApiResponse } from "@/types";

export interface Subscription {
  id: string;
  status: string;
  customerId: string;
  currencyCode: string;
  startedAt: string | null;
  nextBilledAt: string | null;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Transaction {
  id: string;
  status: string;
  amount: string;
  currencyCode: string;
  invoiceUrl: string;
  createdAt: string;
  description: string;
}

export const billingGetSubscription = async (userId: string): Promise<ApiResponse<Subscription> | undefined> => {
  return apiGet<ApiResponse<Subscription>>({
    endpoint: `/billing/subscription`,
    queryParams: { userId },
  });
};

export const billingGetTransactions = async (customerId: string): Promise<ApiResponse<Transaction[]> | undefined> => {
  return apiGet<ApiResponse<Transaction[]>>({
    endpoint: `/billing/transactions`,
    queryParams: { customerId },
  });
};

export const billingCancelSubscription = async (
  subscriptionId: string,
): Promise<ApiResponse<{ subscriptionId: string }> | undefined> => {
  return apiPost<ApiResponse<{ subscriptionId: string }>>({
    endpoint: `/billing/subscription/${subscriptionId}/cancel`,
  });
};

export const billingGetSubscriptionKey = (userId: string) => ["billing-subscription", userId];
export const billingGetTransactionsKey = (customerId: string) => ["billing-transactions", customerId];
