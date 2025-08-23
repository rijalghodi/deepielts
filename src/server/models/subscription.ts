import { SubscriptionStatus } from "@paddle/paddle-node-sdk";

export interface Subscription {
  readonly id: string;
  readonly status: SubscriptionStatus;
  readonly customerId: string; // Paddle customer ID
  readonly currencyCode: string;
  readonly startedAt: string | null;
  readonly nextBilledAt: string | null;
  readonly priceId: string;
  readonly productId: string;
  readonly productName: string;
  readonly price: number;
  readonly priceUnit: string;
  readonly priceName: string;
  readonly billingCycleInterval: string;
  readonly billingCycleFrequency: number;
  readonly canceledAt: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
