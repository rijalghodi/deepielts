import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { getSubscriptionByUserId } from "@/server/services/subscription.repo";

import { handleError } from "@/server/services/interceptor";
import { AppError, AppResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params or headers (you may need to implement auth middleware)
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      throw new AppError({ message: "User ID is required", code: 400 });
    }

    // Get subscription from database
    const subscription = await getSubscriptionByUserId(userId);

    if (!subscription) {
      return NextResponse.json(
        new AppResponse({
          message: "No subscription found",
          data: null,
        }),
      );
    }

    // Get additional subscription details from Paddle if needed
    const paddle = getPaddleInstance();

    try {
      const paddleSubscription = await paddle.subscriptions.get(subscription.id);

      // Merge Paddle data with our stored data
      const enrichedSubscription = {
        ...subscription,
        // Add any additional fields from Paddle that we want to expose
        items: paddleSubscription.items,
        billingDetails: paddleSubscription.billingDetails,
      };

      return NextResponse.json(
        new AppResponse({
          message: "Subscription retrieved successfully",
          data: enrichedSubscription,
        }),
      );
    } catch (paddleError) {
      // If Paddle call fails, return the stored subscription data
      logger.warn(`Failed to fetch Paddle subscription data: ${paddleError}`);

      return NextResponse.json(
        new AppResponse({
          message: "Subscription retrieved successfully",
          data: subscription,
        }),
      );
    }
  } catch (error: any) {
    logger.error(error, "GET /api/billing/subscription");
    Sentry.captureException(error);
    return handleError(error);
  }
}
