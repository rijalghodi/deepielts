"use client";

import { type Environments, initializePaddle, type Paddle, PricePreviewParams, Theme } from "@paddle/paddle-js";
import type { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { PRICING_PLANS } from "@/lib/constants/pricing";

export type PaddlePrices = Record<
  string,
  {
    id: string;
    price: string;
    currency: string;
    formattedPrice: string;
    name: string; // pro
    description: string;
    frequency: string; // month, quarter
  }
>;

interface PaddleContextType {
  paddle: Paddle | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  checkoutData: CheckoutEventsData | null;
  initializePaddle: (eventCallback?: (event: any) => void) => Promise<void>;
  openCheckout: (options: { priceId: string; userEmail?: string; theme?: Theme }) => void;
  getPrices: (country?: string) => Promise<PaddlePrices>;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

interface PaddleProviderProps {
  children: ReactNode;
  defaultEventCallback?: (event: any) => void;
}

export function PaddleProvider({ children, defaultEventCallback }: PaddleProviderProps) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(null);

  const handleCheckoutEvents = useCallback((event: CheckoutEventsData) => {
    setCheckoutData(event);
  }, []);

  const initializePaddleInstance = useCallback(
    async (eventCallback?: (event: any) => void) => {
      if (!paddle?.Initialized && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
        setIsLoading(true);
        setError(null);

        try {
          const paddleInstance = await initializePaddle({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
            eventCallback: (event) => {
              if (event.data && event.name) {
                handleCheckoutEvents(event.data);
              }
              if (eventCallback) {
                eventCallback(event);
              }
            },
            checkout: {
              settings: {
                variant: "one-page",
                displayMode: "inline",
                allowLogout: true,
                frameTarget: "paddle-checkout-frame",
                frameInitialHeight: 450,
                frameStyle:
                  "width: 100%; background-color: transparent; border: none; padding:20px; border-radius: 10px;",
                theme: "light",
                successUrl: "/checkout/success",
              },
            },
          });

          if (paddleInstance) {
            setPaddle(paddleInstance);
            setIsInitialized(true);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to initialize Paddle");
          console.error("Paddle initialization error:", err);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [paddle?.Initialized, handleCheckoutEvents],
  );

  const openCheckout = useCallback(
    ({ priceId, userEmail, theme }: { priceId: string; userEmail?: string; theme?: Theme }) => {
      if (!paddle?.Initialized) {
        console.error("Paddle not initialized");
        return;
      }

      paddle.Checkout.open({
        ...(userEmail && { customer: { email: userEmail } }),
        items: [{ priceId, quantity: 1 }],
        settings: {
          showAddDiscounts: false,
          ...(theme && { theme }),
        },
      });
    },
    [paddle],
  );

  const getPrices = useCallback(
    async (country: string = "US"): Promise<PaddlePrices> => {
      if (!paddle?.Initialized) {
        throw new Error("Paddle not initialized");
      }

      try {
        const lineItems = PRICING_PLANS.map((tier) => [tier.priceIds?.month, tier.priceIds?.quarter])
          .flat()
          .filter(Boolean)
          .map((priceId) => ({ priceId: priceId as string, quantity: 1 }));

        const pricePreviewRequest: Partial<PricePreviewParams> = {
          items: lineItems,
          ...(country !== "OTHERS" && { address: { countryCode: country } }),
        };

        const prices = await paddle.PricePreview(pricePreviewRequest as PricePreviewParams);

        return prices.data.details.lineItems.reduce((acc, item) => {
          acc[item.price.id] = {
            id: item.price.id,
            price: item.formattedTotals.total,
            frequency: item.price.customData?.frequency as string,
            currency: "USD",
            formattedPrice: item.formattedTotals.total,
            name: (item.price.customData?.name as string) || "Unknown Product",
            description: item.price.description || "No description available",
          };
          return acc;
        }, {} as PaddlePrices);
      } catch (error) {
        console.error("Failed to get prices:", error);
        throw error;
      }
    },
    [paddle],
  );

  // Auto-initialize Paddle when the provider mounts
  useEffect(() => {
    initializePaddleInstance();
  }, [initializePaddleInstance]);

  const value: PaddleContextType = {
    paddle,
    isInitialized,
    isLoading,
    error,
    checkoutData,
    initializePaddle: initializePaddleInstance,
    openCheckout,
    getPrices,
  };

  return <PaddleContext.Provider value={value}>{children}</PaddleContext.Provider>;
}

export function usePaddle() {
  const context = useContext(PaddleContext);
  if (context === undefined) {
    throw new Error("usePaddle must be used within a PaddleProvider");
  }
  return context;
}

// Hook for components that need to get product prices with state management
export function usePaddlePrices(country: string = "US") {
  const { getPrices, isInitialized } = usePaddle();
  const [prices, setPrices] = useState<PaddlePrices>({} as PaddlePrices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!isInitialized) return;

    setLoading(true);
    setError(null);

    try {
      const priceData = await getPrices(country);
      setPrices(priceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prices");
      console.error("Price fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [getPrices, country, isInitialized]);

  // Auto-fetch prices when component mounts or dependencies change
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}
