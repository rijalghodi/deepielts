import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { Crown } from "lucide-react";

import { formatMoney } from "@/lib/paddle/parse-money";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingTextProps {
  value: number | undefined;
  currencyCode: string | undefined;
}

function LoadingText({ value, currencyCode }: LoadingTextProps) {
  if (value === undefined) {
    return <Skeleton className="h-[20px] w-[75px] bg-border" />;
  } else {
    return formatMoney(value, currencyCode);
  }
}

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function CheckoutItems({ checkoutData }: Props) {
  if (!checkoutData) {
    return (
      <div className="flex flex-col gap-6 w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 w-full">
            <Skeleton className="w-[50px] h-[40px] rounded-md" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="w-full h-[12px]" />
              <Skeleton className="w-full h-[12px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={"space-y-5"}>
      <div className={"flex items-start gap-3"}>
        <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10">
          <Crown className="text-primary w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <p className={"text-sm font-medium"}>{checkoutData?.items[0].product.name}</p>
          <p className={"text-xs text-muted-foreground"}>{checkoutData?.items[0].product.description}</p>
        </div>
        <LoadingText currencyCode={checkoutData?.currency_code} value={checkoutData?.items[0].totals.subtotal} />
      </div>
      <div className="space-y-5 pl-11">
        <Separator className={"bg-border "} />
        <div className={"flex justify-between"}>
          <span className={"text-sm leading-[20px] font-medium"}>Subtotal</span>
          <span className={"text-base leading-[20px] font-semibold"}>
            <LoadingText currencyCode={checkoutData?.currency_code} value={checkoutData?.totals.subtotal} />
          </span>
        </div>
        <div className={"flex justify-between"}>
          <span className={"text-sm leading-[20px] font-medium"}>Tax</span>
          <span className={"text-base leading-[20px] font-semibold"}>
            <LoadingText currencyCode={checkoutData?.currency_code} value={checkoutData?.totals.tax} />
          </span>
        </div>
        <Separator className={"bg-border"} />
        <div className={"flex justify-between"}>
          <span className={"text-sm leading-[20px] font-medium"}>Total due today</span>
          <span className={"text-base leading-[20px] font-semibold"}>
            <LoadingText currencyCode={checkoutData?.currency_code} value={checkoutData?.totals.total} />
          </span>
        </div>
      </div>
    </div>
  );
}
