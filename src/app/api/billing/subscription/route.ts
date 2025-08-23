import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";

import { handleError } from "@/server/services/interceptor";
import { getSubscriptionByUserId } from "@/server/services/subscription.repo";

import { authGetUser } from "../../auth/auth-middleware";

import { AppError, AppResponse } from "@/types";

export async function GET(_request: NextRequest) {
  try {
    const user = await authGetUser();

    if (!user) {
      throw new AppError({ message: "User ID is required", code: 400 });
    }

    // Get subscription from database
    const subscription = await getSubscriptionByUserId(user.uid);

    if (!subscription) {
      return NextResponse.json(
        new AppResponse({
          message: "No subscription found",
          data: null,
        }),
      );
    }

    return NextResponse.json(
      new AppResponse({
        message: "Subscription retrieved successfully",
        data: subscription,
      }),
    );

    // // Get additional subscription details from Paddle if needed
    // const paddle = getPaddleInstance();

    // try {
    //   const paddleSubscription = await paddle.subscriptions.get(subscription.id);

    //   // Merge Paddle data with our stored data
    //   const enrichedSubscription = {
    //     ...subscription,
    //     // Add any additional fields from Paddle that we want to expose
    //     items: paddleSubscription.items,
    //     billingDetails: paddleSubscription.billingDetails,
    //   };

    //   return NextResponse.json(
    //     new AppResponse({
    //       message: "Subscription retrieved successfully",
    //       data: enrichedSubscription,
    //     }),
    //   );
    // } catch (paddleError) {
    //   // If Paddle call fails, return the stored subscription data
    //   logger.warn(`Failed to fetch Paddle subscription data: ${paddleError}`);

    //   return NextResponse.json(
    //     new AppResponse({
    //       message: "Subscription retrieved successfully",
    //       data: subscription,
    //     }),
    //   );
    // }
  } catch (error: any) {
    logger.error(error, "GET /api/billing/subscription");
    Sentry.captureException(error);
    return handleError(error);
  }
}
