import { EventEntity, EventName, SubscriptionCreatedEvent, SubscriptionUpdatedEvent } from "@paddle/paddle-node-sdk";
import { Timestamp } from "firebase-admin/firestore";

import { Subscription } from "@/server/models/subscription";
import { updateSubscription } from "@/server/services/subscription.repo";

export interface CustomerData {
  userId: string;
  customerId: string;
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
    case EventName.SubscriptionCanceled:
    case EventName.SubscriptionPastDue:
    case EventName.SubscriptionPaused:
      // TODO: Handle cancel / pause / past due / paused subscription events
      break;
  }
}

async function updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
  try {
    const userId = (eventData.data.customData as { userId: string })?.userId;
    const customerId = eventData.data.customerId;
    if (!customerId) {
      console.error("No customer ID found in subscription event");
      return;
    }
    const subscriptionData: Subscription = {
      id: eventData.data.id,
      status: eventData.data.status,
      customerId: customerId,
      currencyCode: eventData.data.currencyCode,
      startedAt: eventData.data.startedAt,
      nextBilledAt: eventData.data.nextBilledAt,
      canceledAt: eventData.data.canceledAt,
      createdAt: eventData.data.createdAt,
      updatedAt: eventData.data.updatedAt,
      userId: userId,
      items: eventData.data.items,
    };
    await updateSubscription(userId, subscriptionData);
  } catch (error) {
    console.error("Error updating subscription data:", error);
    throw error;
  }
}

// TODO: Handle cancel / pause / past due / paused subscription events
