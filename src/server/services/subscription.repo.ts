import { db } from "@/lib/firebase/firebase-admin";

import { Subscription } from "../models/subscription";

import { AppError } from "@/types/global";

export async function updateSubscription(userId: string, subscription: Subscription): Promise<void> {
  try {
    // Insert/update subscription under users/{userId}/subscriptions/{subscriptionId}
    const subscriptionRef = db.collection("users").doc(userId).collection("subscriptions").doc(subscription.id);

    await subscriptionRef.set(subscription, { merge: true });
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      name: "updateSubscriptionDataError",
      code: 500,
    });
  }
}
