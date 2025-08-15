import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function PriceSection({ checkoutData }: Props) {
  return (
    <div>
      <pre>{JSON.stringify(checkoutData, null, 2)}</pre>
    </div>
  );
}
