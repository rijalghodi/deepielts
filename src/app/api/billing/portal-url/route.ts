import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { handleError } from "@/server/services/interceptor";
import { getSubscriptionByUserId } from "@/server/services/subscription.repo";
import { AppError, AppResponse } from "@/types";

import { authGetUser } from "../../auth/auth-middleware";

export async function GET(_request: NextRequest) {
  try {
    const userAuth = await authGetUser();

    if (!userAuth) {
      throw new AppError({ message: "Unauthorized", code: 401 });
    }

    const subscription = await getSubscriptionByUserId(userAuth.uid);

    if (!subscription) {
      throw new AppError({ message: "No subscription found", code: 404 });
    }

    console.log(subscription);

    const paddle = getPaddleInstance();

    const customerPortalSession = await paddle.customerPortalSessions.create(subscription.customerId, [
      subscription.id,
    ]);

    return NextResponse.json(
      new AppResponse({
        data: { url: customerPortalSession.urls.subscriptions[0].updateSubscriptionPaymentMethod },
      }),
    );
  } catch (error: any) {
    logger.error(error, "GET /api/billing/portal-url");
    Sentry.captureException(error);
    return handleError(error);
  }
}
