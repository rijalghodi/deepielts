import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BILLING_FREQUENCY, BillingFrequency } from "@/lib/constants/pricing";

interface Props {
  setFrequency: (frequency: BillingFrequency) => void;
  frequency: BillingFrequency;
}

export function ToggleFrequency({ frequency, setFrequency }: Props) {
  return (
    <div className="flex justify-center mb-8">
      <Tabs
        value={frequency.value}
        onValueChange={(value) =>
          setFrequency(BILLING_FREQUENCY.find((billingFrequency) => value === billingFrequency.value)!)
        }
      >
        <TabsList>
          {BILLING_FREQUENCY.map((billingFrequency) => (
            <TabsTrigger key={billingFrequency.value} value={billingFrequency.value}>
              {billingFrequency.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
