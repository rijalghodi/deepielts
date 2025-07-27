"use client";

import { Check, HelpCircle, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface PricingFeature {
  name: string;
  included?: boolean;
  tooltip?: string;
  limited?: boolean;
}

export interface PricingCardProps {
  title?: string;
  description?: string;
  price?: {
    month: number;
    week: number;
    "3-month": number;
  };
  features?: PricingFeature[];
  popular?: boolean;
  highlighted?: boolean;
  ctaText?: string;
  discount?: number;
}

export const PricingCard = ({
  title = "Professional",
  description = "Perfect for growing businesses and teams.",
  price,
  features = [],
  popular = false,
  highlighted = false,
  ctaText = "Get Started",
  discount = 15,
}: PricingCardProps) => {
  const [billingCycle, setBillingCycle] = useState<"month" | "week" | "3-month">("week");
  const [isHovered, setIsHovered] = useState(false);

  const currentPrice = price
    ? billingCycle === "month"
      ? price.month
      : billingCycle === "week"
        ? price.week
        : price["3-month"]
    : 0;
  const threeMonthSavings = price ? price.month * 3 - price["3-month"] : 0;

  return (
    <Card
      className={`w-full max-w-sm relative overflow-hidden transition-all duration-300 ${
        highlighted ? "border-primary shadow-lg" : ""
      } ${isHovered ? "shadow-xl" : "shadow-md"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient effect */}
      {highlighted && <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />}

      {/* Popular badge */}
      {popular && (
        <div className="absolute z-0 top-0 right-0">
          <div className="relative">
            <div className="absolute z-0 -right-11 top-3 rotate-45 bg-primary py-1 px-10 text-xs font-semibold text-primary-foreground shadow-sm">
              Popular
            </div>
          </div>
        </div>
      )}

      <CardHeader className={`relative pb-8`}>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          {highlighted && (
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 gap-1">
              <Sparkles className="h-3 w-3" />
              Recommended
            </Badge>
          )}
        </div>
        <CardDescription className="pt-1.5">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Pricing section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold">${currentPrice}</span>
              {price && (
                <span className="text-muted-foreground">
                  /{billingCycle === "month" ? "month" : billingCycle === "week" ? "week" : "3 month"}
                </span>
              )}
            </div>
            {price && (
              <Select
                value={billingCycle}
                onValueChange={(currentValue) => {
                  setBillingCycle(currentValue as "month" | "week" | "3-month");
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full max-w-[120px] shadow-none border-primary/50",
                    highlighted ? "border-primary/50" : "",
                  )}
                >
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent className={cn(highlighted ? "border-primary/50" : "")}>
                  <SelectItem value="week">1 Week</SelectItem>
                  <SelectItem value="month">1 Month</SelectItem>
                  <SelectItem value="3-month">3 Month</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {billingCycle === "3-month" && (
            <div className="text-xs text-success font-medium">
              Save ${threeMonthSavings} ({discount}%) with 3 month billing
            </div>
          )}
        </div>

        {/* Features list */}
        <div className="space-y-3">
          <div className="text-sm font-medium">What's included:</div>
          <ul className="space-y-2.5">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div
                  className={`mt-0.5 rounded-full p-0.5 ${
                    feature.included
                      ? "bg-success text-success-foreground"
                      : feature.limited
                        ? "border-success border text-success"
                        : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {feature.included ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : feature.limited ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm ${!feature.included ? "text-muted-foreground" : ""}`}>{feature.name}</span>
                  {feature.tooltip && <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-6 relative">
        <Button
          className={`w-full ${highlighted ? "bg-primary hover:bg-primary/90" : ""}`}
          variant={highlighted ? "default" : "outline"}
          size="lg"
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
};
