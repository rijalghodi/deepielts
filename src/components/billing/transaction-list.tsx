"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { billingGetTransactions, billingGetTransactionsKey } from "@/lib/api/billing.api";

import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

interface Props {
  userId: string;
}

export function TransactionList({ userId }: Props) {
  const [all, setAll] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery({
    queryKey: billingGetTransactionsKey(userId, 10, all),
    queryFn: () => billingGetTransactions(userId, 10, all),
  });

  const transactions = data?.data?.transactions || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-36" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            <Table>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="cursor-pointer text-muted-foreground"
                    onClick={() => window.open(transaction.invoiceUrl, "_blank")}
                  >
                    <TableCell className="font-medium">
                      {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{formatAmount(transaction.amount, transaction.currencyCode || "USD")}</TableCell>
                    <TableCell>
                      <TransactionStatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell className="">{transaction.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {all && (
              <div className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={() => setAll(false)}>
                  Show Less
                </Button>
              </div>
            )}
            {data?.data?.hasMore && (
              <div className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={() => setAll(true)}>
                  Show All
                </Button>
              </div>
            )}
          </div>
        ) : error ? (
          <p className="text-sm text-muted-foreground">{(error as any)?.message || "No transactions found."}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No transactions found.</p>
        )}
      </CardContent>
    </Card>
  );
}

function formatAmount(amount: string, currency: string) {
  const zeroDecimalCurrencies = ["IDR", "JPY", "KRW"];

  const num = typeof amount === "string" ? parseInt(amount, 10) : amount;

  const value = zeroDecimalCurrencies.includes(currency) ? num : num / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

const TransactionStatusBadge = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
    case "complete":
      return <Badge className="bg-success/10 text-success">Completed</Badge>;
    case "incomplete":
    case "ready":
    case "pending":
    case "draft":
    case "billed":
    case "paid":
      return <Badge className="bg-info/10 text-info">Incomplete</Badge>;
    case "canceled":
    case "past_due":
      return <Badge className="bg-destructive/10 text-destructive">Canceled</Badge>;
    default:
      return <Badge className="bg-neutral/10 text-neutral">Unknown</Badge>;
  }
};
