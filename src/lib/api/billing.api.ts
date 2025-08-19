import { GetTransactionsResult } from "@/server/dto/transactions.dto";
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

export const billingGetSubscription = async (userId: string) => {
  return apiGet<ApiResponse<Subscription>>({
    endpoint: `/billing/subscription`,
    queryParams: { userId },
  });
};

export const billingGetTransactions = async (userId: string, limit: number = 10) => {
  return apiGet<ApiResponse<GetTransactionsResult>>({
    endpoint: `/billing/transactions`,
    queryParams: { userId, limit },
  });
};

export const billingCancelSubscription = async (
  subscriptionId: string,
): Promise<ApiResponse<{ subscriptionId: string }> | undefined> => {
  return apiPost<ApiResponse<{ subscriptionId: string }>>({
    endpoint: `/billing/subscription/${subscriptionId}/cancel`,
  });
};

export const billingGetSubscriptionKey = (userId: string) => ["subscriptions", userId];
export const billingGetTransactionsKey = (userId: string, limit: number) => ["transactions", userId, limit];
