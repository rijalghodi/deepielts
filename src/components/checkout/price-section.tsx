import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { Crown } from "lucide-react";

import { formatMoney } from "@/lib/paddle/parse-money";

import { Skeleton } from "../ui/skeleton";

interface Props {
  checkoutData: CheckoutEventsData | null;
  isLoading?: boolean;
}

export function PriceSection({ checkoutData, isLoading }: Props) {
  if (!checkoutData || isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-[100px] h-[14px]" />
        <Skeleton className="w-[140px] h-[28px]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center lg:items-start">
      <Crown className="text-primary w-5 h-5 mb-4" />

      <p className="text-base tracking-tight font-medium mb-4">Subscribe to {checkoutData?.items[0].product.name}</p>
      <p className="text-3xl font-semibold mb-2">
        {formatMoney(checkoutData?.totals.total || 0, checkoutData?.currency_code || "USD")}
      </p>
    </div>
  );
}
