import { GetTransactionsResult } from "@/server/dto/transactions.dto";
import { ApiResponse } from "@/types";

import { apiGet, apiPost } from "./utils";

export interface Subscription {
  id: string;
  status?: string;
  customerId?: string;
  currencyCode?: string;
  startedAt?: string | null;
  nextBilledAt?: string | null;
  canceledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  productId?: string;
  productName?: string;
  priceId?: string;
  priceName?: string;
  priceUnit?: string;
  billingCycleInterval?: string;
  billingCycleFrequency?: number;
  price?: number;
}

type PortalUrlResponse = {
  url: string;
};

export const billingGetPortalUrl = async () => {
  return apiGet<ApiResponse<PortalUrlResponse>>({
    endpoint: `/billing/portal-url`,
  });
};

export const billingGetSubscription = async (userId: string) => {
  return apiGet<ApiResponse<Subscription>>({
    endpoint: `/billing/subscription`,
    queryParams: { userId },
  });
};

export const billingGetTransactions = async (userId: string, limit: number = 10, all: boolean) => {
  return apiGet<ApiResponse<GetTransactionsResult>>({
    endpoint: `/billing/transactions`,
    queryParams: { userId, limit, all },
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
export const billingGetPortalUrlKey = (userId: string) => ["portal-url", userId];
export const billingGetTransactionsKey = (userId: string, limit: number, all: boolean) => [
  "transactions",
  userId,
  limit,
  all,
];
