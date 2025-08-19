import { db } from "@/lib/firebase/firebase-admin";

import { Subscription } from "../models/subscription";

import { AppError } from "@/types/global";

export async function upsertSubscription(userId: string, subscription: Subscription): Promise<void> {
  try {
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

export async function upsertCustomerId(userId: string, customerId: string): Promise<void> {
  try {
    const userRef = db.collection("users").doc(userId);

    await userRef.set(
      { customerId }, // only new field
      { merge: true }, // keep existing fields
    );
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      name: "updateCustomerDataError",
      code: 500,
    });
  }
}

export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  try {
    const subscriptionsRef = db.collection("users").doc(userId).collection("subscriptions");
    const snapshot = await subscriptionsRef.limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    // Get the first (and should be only) subscription
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Subscription;
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      name: "getSubscriptionDataError",
      code: 500,
    });
  }
}
