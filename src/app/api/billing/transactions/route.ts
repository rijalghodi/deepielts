import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";

import { handleError } from "@/server/services/interceptor";
import { AppError, AppResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Get customer ID from query params
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      throw new AppError({ message: "Customer ID is required", code: 400 });
    }

    const paddle = getPaddleInstance();

    try {
      // Get transactions from Paddle
      const transactionsResponse = await paddle.transactions.list({
        customerId: [customerId],
        perPage: 50, // Limit to recent transactions
      });

      // Transform Paddle transaction data to our format
      // Note: Using any type to bypass TypeScript issues with Paddle SDK
      const transactions = (transactionsResponse as any).data || [];
      const formattedTransactions = transactions.map((transaction: any) => ({
        id: transaction.id,
        status: transaction.status,
        amount: transaction.details.totals.total,
        currencyCode: transaction.details.totals.currencyCode,
        invoiceUrl: transaction.invoiceUrl,
        createdAt: transaction.createdAt,
        description: transaction.details.lineItems?.[0]?.description || "Subscription payment",
      }));

      return NextResponse.json(
        new AppResponse({
          message: "Transactions retrieved successfully",
          data: formattedTransactions,
        }),
      );
    } catch (paddleError) {
      logger.error(`Failed to fetch Paddle transactions: ${paddleError}`);
      throw new AppError({
        message: "Failed to fetch transactions from Paddle",
        code: 500,
      });
    }
  } catch (error: any) {
    logger.error(error, "GET /api/billing/transactions");
    Sentry.captureException(error);
    return handleError(error);
  }
}
