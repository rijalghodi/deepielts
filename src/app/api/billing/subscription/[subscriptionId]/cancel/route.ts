import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";

import { handleError } from "@/server/services/interceptor";
import { AppError, AppResponse } from "@/types";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ subscriptionId: string }> }) {
  try {
    const { subscriptionId } = await params;

    if (!subscriptionId) {
      throw new AppError({ message: "Subscription ID is required", code: 400 });
    }

    const paddle = getPaddleInstance();

    try {
      // Cancel subscription in Paddle
      await paddle.subscriptions.cancel(subscriptionId, {
        effectiveFrom: "next_billing_period",
      });

      // Note: Subscription status will be updated via webhook when Paddle sends the cancellation event
      logger.info(`Subscription ${subscriptionId} cancellation initiated in Paddle`);

      return NextResponse.json(
        new AppResponse({
          message: "Subscription cancellation initiated successfully",
          data: { subscriptionId },
        }),
      );
    } catch (paddleError) {
      logger.error(`Failed to cancel Paddle subscription: ${paddleError}`);
      throw new AppError({
        message: "Failed to cancel subscription in Paddle",
        code: 500,
      });
    }
  } catch (error: any) {
    logger.error(error, "POST /api/billing/subscription/[subscriptionId]/cancel");
    Sentry.captureException(error);
    return handleError(error);
  }
}
