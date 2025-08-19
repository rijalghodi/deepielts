import { SubscriptionStatus } from "@paddle/paddle-node-sdk";

export interface Subscription {
  readonly id: string;
  readonly status: SubscriptionStatus;
  readonly customerId: string; // Paddle customer ID
  readonly currencyCode: string;
  readonly startedAt: string | null;
  readonly nextBilledAt: string | null;
  // readonly items?: SubscriptionItemNotification[] | null;
  readonly priceId: string;
  readonly productId: string;
  readonly canceledAt: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly userId: string;
}
