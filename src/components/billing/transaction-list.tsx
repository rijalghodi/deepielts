"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

import { billingGetTransactions, billingGetTransactionsKey } from "@/lib/api/billing.api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Table, TableBody, TableCell, TableRow } from "../ui/table";

interface Props {
  userId: string;
}

export function TransactionList({ userId }: Props) {
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: billingGetTransactionsKey(userId, limit),
    queryFn: () => billingGetTransactions(userId, limit),
  });

  const transactions = data?.data?.transactions || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8" />
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
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{formatAmount(transaction.amount, transaction.currencyCode)}</TableCell>
                    <TableCell>
                      <TransactionStatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell className="text-right">{transaction.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => window.open(transaction.invoiceUrl, "_blank")}>
                        <FileText className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data?.data?.hasMore && (
              <div className="flex justify-center">
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setLimit(limit + 10)}>
                  Show More
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
    case "complete":
      return <Badge className="bg-success/10 text-success">Complete</Badge>;
    case "incomplete":
    case "ready":
    case "pending":
    case "draft":
    case "billed":
    case "paid":
      return <Badge className="bg-blue-50 text-blue-500">Incomplete</Badge>;
    case "canceled":
    case "past_due":
      return <Badge className="bg-destructive/10 text-destructive">Canceled</Badge>;
    default:
      return <Badge className="bg-gray-50 text-gray-500">Unknown</Badge>;
  }
};
