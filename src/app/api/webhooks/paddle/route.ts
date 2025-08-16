import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { processEvent } from "@/lib/paddle/process-webhook";

import { handleError } from "@/server/services/interceptor";

import { AppError, AppResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("paddle-signature");
    const rawRequestBody = await request.text();

    if (!signature) {
      throw new AppError({ message: "Missing Paddle signature", code: 400 });
    }

    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new AppError({ message: "Webhook secret not configured", code: 500 });
    }

    // const validator = new WebhooksValidator();

    // if (!validator.isValidSignature(rawRequestBody, signature, webhookSecret)) {
    //   throw new AppError({ message: "Invalid webhook signature", code: 401 });
    // }

    const paddle = getPaddleInstance();
    const eventData = await paddle.webhooks.unmarshal(rawRequestBody, webhookSecret, signature);

    // Process the webhook event
    await processEvent(eventData);

    return NextResponse.json(
      new AppResponse({
        message: "Webhook processed successfully",
        data: {
          eventData,
        },
      }),
    );
  } catch (error: any) {
    logger.error(error, "POST /webhooks/paddle");
    Sentry.captureException(error);
    return handleError(error);
  }
}
