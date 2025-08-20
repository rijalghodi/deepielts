import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";

import { getUserById } from "@/server/services";
import { handleError } from "@/server/services/interceptor";
import { getSubscriptionByUserId } from "@/server/services/subscription.repo";

import { authGetUser } from "../../auth/auth-middleware";

import { AppError, AppResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const userAuth = await authGetUser();

    if (!userAuth) {
      throw new AppError({ message: "User ID is required", code: 400 });
    }

    const user = await getUserById(userAuth.uid);
    const subscription = await getSubscriptionByUserId(userAuth.uid);

    const paddle = getPaddleInstance();

    const customerPortalSession = await paddle.customerPortalSessions.create(subscription?.customerId ?? "", [
      subscription?.id ?? "",
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
