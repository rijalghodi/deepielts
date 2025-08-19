import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { processEvent } from "@/lib/paddle/process-webhook";

import { handleError } from "@/server/services/interceptor";

import { AppError, AppResponse } from "@/types";

export async function POST(request: NextRequest) {
  console.log("OK -----------------------------------------------");

  try {
    const signature = request.headers.get("paddle-signature");

    const rawRequestBody = await request.text();

    if (!signature) {
      logger.error("Missing Paddle signature");
      throw new AppError({ message: "Missing Paddle signature", code: 400 });
    }

    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error("Webhook secret not configured");
      throw new AppError({ message: "Webhook secret not configured", code: 500 });
    }

    const paddle = getPaddleInstance();
    const eventData = await paddle.webhooks.unmarshal(rawRequestBody, webhookSecret, signature);

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
