import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";
import { Timestamp } from "firebase-admin/firestore";

import { db } from "@/lib/firebase/firebase-admin";

export interface SubscriptionData {
  subscription_id: string;
  subscription_status: string;
  price_id: string;
  product_id: string;
  scheduled_change?: Date;
  customer_id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CustomerData {
  customer_id: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function processEvent(eventData: EventEntity) {
  switch (eventData.eventType) {
    case EventName.SubscriptionCreated:
    case EventName.SubscriptionUpdated:
      await updateSubscriptionData(eventData);
      break;
    case EventName.CustomerCreated:
    case EventName.CustomerUpdated:
      await updateCustomerData(eventData);
      break;
  }
}

async function updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
  try {
    const customerId = eventData.data.customerId;
    if (!customerId) {
      console.error("No customer ID found in subscription event");
      return;
    }

    const subscriptionData: SubscriptionData = {
      subscription_id: eventData.data.id,
      subscription_status: eventData.data.status,
      price_id: eventData.data.items[0]?.price?.id ?? "",
      product_id: eventData.data.items[0]?.price?.productId ?? "",
      scheduled_change: eventData.data.scheduledChange?.effectiveAt
        ? new Date(eventData.data.scheduledChange.effectiveAt)
        : undefined,
      customer_id: customerId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Insert/update subscription under users/{userId}/subscriptions/{subscriptionId}
    const subscriptionRef = db.collection("users").doc(customerId).collection("subscriptions").doc(eventData.data.id);

    await subscriptionRef.set(subscriptionData, { merge: true });

    console.log(`Subscription ${eventData.data.id} updated for customer ${customerId}`);
  } catch (error) {
    console.error("Error updating subscription data:", error);
    throw error;
  }
}

async function updateCustomerData(eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
  try {
    const customerData: CustomerData = {
      customer_id: eventData.data.id,
      email: eventData.data.email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Insert/update customer under users/{userId}/customer
    const customerRef = db.collection("users").doc(eventData.data.id).collection("customer").doc("profile");

    await customerRef.set(customerData, { merge: true });

    console.log(`Customer ${eventData.data.id} updated`);
  } catch (error) {
    console.error("Error updating customer data:", error);
    throw error;
  }
}
