import { Transaction as PaddleTransaction } from "@paddle/paddle-node-sdk";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";

import { Transaction } from "@/server/dto/transactions.dto";
import { getUserById } from "@/server/services";
import { handleError } from "@/server/services/interceptor";

import { AppError, AppResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Get customer ID from query params
    const userId = request.nextUrl.searchParams.get("userId");
    const limit = Number(request.nextUrl.searchParams.get("limit") || 10);
    const all = request.nextUrl.searchParams.get("all") === "true";

    if (!userId) {
      throw new AppError({ message: "User ID is required", code: 400 });
    }

    const paddle = getPaddleInstance();

    const user = await getUserById(userId);
    if (!user || !user.customerId) {
      throw new AppError({ message: "User not found or customer ID not found", code: 404 });
    }
    const customerId = user.customerId;

    // Get transactions from Paddle
    const transactionCollection = paddle.transactions.list({
      customerId: [customerId],
      perPage: limit,
      include: ["customer"],
    });

    let transactions: PaddleTransaction[] = [];

    if (all) {
      for await (const transaction of transactionCollection) {
        transactions.push(transaction);
      }
    } else {
      transactions = await transactionCollection.next();
    }

    const formattedTransactions: Transaction[] = transactions.map((transaction) => ({
      id: transaction.id,
      status: transaction.status,
      amount: transaction.details?.totals?.total || "0",
      currencyCode: transaction.details?.totals?.currencyCode,
      name: transaction.details?.lineItems?.[0]?.product?.name || "Unknown",
      invoiceUrl: transaction.checkout?.url || "",
      createdAt: transaction.createdAt,
      transaction: transaction,
      customer: transaction.customer?.email,
      price: transaction.items?.[0]?.price?.name,
    }));

    return NextResponse.json(
      new AppResponse({
        data: {
          transactions: formattedTransactions,
          total: transactionCollection.estimatedTotal,
          hasMore: transactionCollection.hasMore,
        },
      }),
    );
  } catch (error: any) {
    logger.error(error, "GET /api/billing/transactions");
    Sentry.captureException(error);
    return handleError(error);
  }
}
