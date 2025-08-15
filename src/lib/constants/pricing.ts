export interface PricingPlan {
  title: string;
  description: string;
  features: { name: string; included: boolean; description?: string }[];
  highlighted?: boolean;
  priceIds: Record<string, string | null>;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    title: "Free",
    description: "Try core features for free",
    features: [
      { name: "1000+ IELTS Practice Questions", included: true },
      { name: "3 IELTS Writing Scoring per day", included: true },
      { name: "Advanced & In-Depth Feedback", included: true },
      { name: "Export result to PDF file", included: true },
    ],
    priceIds: {},
  },
  {
    title: "Pro",
    description: "Unlimited essay evaluation ",
    highlighted: true,
    priceIds: {
      month: "pri_01k2jwa6k408c4gp8z55kgcet9",
      quarter: "pri_01k2jw96cd3dn513rar0r7rsrc",
    },
    features: [
      { name: "1000+ IELTS Practice Questions", included: true },
      { name: "Unlimited IELTS Writing Scoring", included: true },
      { name: "Advanced & In-Depth Feedback", included: true },
      { name: "Export result to PDF file", included: true },
    ],
  },
];

// -------------------------------------------------------------------------------
// Billing Frequency
// -------------------------------------------------------------------------------

export interface BillingFrequency {
  value: string;
  label: string;
  suffix: string;
}

export const BILLING_FREQUENCY: BillingFrequency[] = [
  { value: "month", label: "Monthly", suffix: "/month" },
  { value: "quarter", label: "Quarterly", suffix: "/3 months" },
];
