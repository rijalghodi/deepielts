import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionActivatedEvent,
  SubscriptionCanceledEvent,
  SubscriptionCreatedEvent,
  SubscriptionPastDueEvent,
  SubscriptionPausedEvent,
  SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";
import { Timestamp } from "firebase-admin/firestore";

import { Subscription } from "@/server/models/subscription";
import { upsertCustomerId as insertCustomerId, upsertSubscription } from "@/server/services/subscription.repo";
import { getUserByCustomerId, getUserByEmail } from "@/server/services/user.service";

import logger from "../logger";

import { AppError } from "@/types";

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
    case EventName.SubscriptionActivated:
      await upsertSubscriptionData(eventData);
      break;
    case EventName.SubscriptionCanceled:
    case EventName.SubscriptionPastDue:
    case EventName.SubscriptionPaused:
      // TODO: Handle cancel / pause / past due / paused subscription events
      await upsertSubscriptionData(eventData);
      break;
    case EventName.CustomerCreated:
    case EventName.CustomerUpdated:
      await upsertCustomerData(eventData);
      break;
  }
}

async function upsertSubscriptionData(
  eventData:
    | SubscriptionCreatedEvent
    | SubscriptionUpdatedEvent
    | SubscriptionActivatedEvent
    | SubscriptionCanceledEvent
    | SubscriptionPastDueEvent
    | SubscriptionPausedEvent,
) {
  try {
    let userId = (eventData.data.customData as { userId: string })?.userId;

    if (!userId) {
      const customerId = eventData.data.customerId;
      const customer = await getUserByCustomerId(customerId);
      if (!customer) {
        throw new AppError({ message: "No user found with customer ID " + customerId, code: 400 });
      }
      userId = customer.id;
    }

    const item = eventData.data.items?.[0];

    const amountMinor = Number(item?.price?.unitPrice?.amount) || 0;
    const currency = item?.price?.unitPrice?.currencyCode || eventData.data.currencyCode;

    // Convert minor units (e.g. cents) to major units
    const amount = amountMinor / 100;

    const subscriptionData: Subscription = {
      id: eventData.data.id,
      status: eventData.data.status,
      customerId: eventData.data.customerId,
      currencyCode: currency,
      startedAt: eventData.data.startedAt,
      nextBilledAt: eventData.data.nextBilledAt,
      canceledAt: eventData.data.canceledAt,
      createdAt: eventData.data.createdAt,
      updatedAt: eventData.data.updatedAt,
      productId: item?.product?.id || "",
      productName: item?.product?.name || "",
      priceId: item?.price?.id || "",
      price: amount,
      priceName: item.price?.name || "",
      priceUnit: item.price?.unitPrice?.currencyCode || "",
      billingCycleInterval: item.price?.billingCycle?.interval || "",
      billingCycleFrequency: item.price?.billingCycle?.frequency || 1,
    };

    await upsertSubscription(userId, subscriptionData);
  } catch (error) {
    logger.error(error, "Error updating subscription data");
    throw error;
  }
}

// TODO: Handle cancel / pause / past due / paused subscription events
async function upsertCustomerData(eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
  const customerId = eventData.data.id;

  console.log("customerId", customerId);
  const email = eventData.data.email;

  // get user by email
  const user = await getUserByEmail(email);

  if (!user) {
    throw new AppError({ message: "No user found with email " + email, code: 400 });
  }

  if (!customerId) {
    throw new AppError({ message: "No customer ID found in customer event", code: 400 });
  }

  await insertCustomerId(user.id, customerId);
}
