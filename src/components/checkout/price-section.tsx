import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { useRouter } from "next/navigation";

import { formatMoney } from "@/lib/paddle/parse-money";

import { Skeleton } from "../ui/skeleton";

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function PriceSection({ checkoutData }: Props) {
  const router = useRouter();

  if (!checkoutData) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-[100px] h-[14px]" />
        <Skeleton className="w-[140px] h-[28px]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center md:items-start">
      <p className="text-base tracking-tight font-medium mb-4 text-muted-foreground">
        Subscribe to {checkoutData?.items[0].product.name}
      </p>
      <p className="text-3xl font-semibold mb-2">
        {formatMoney(checkoutData?.totals.total || 0, checkoutData?.currency_code || "USD")}
      </p>
      {/* <p className="text-base leading-[16px] text-muted-foreground">inc. tax</p> */}
    </div>
  );
}
