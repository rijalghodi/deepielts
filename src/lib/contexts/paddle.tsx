"use client";

import { type Environments, initializePaddle, type Paddle, PricePreviewParams } from "@paddle/paddle-js";
import type { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export type PaddlePrice = {
  id: string;
  price: string;
  formattedPrice: string;
  currency: string;
  name: string;
  description: string;
  interval?: string;
  frequency?: number;
};

interface PaddleContextType {
  paddle: Paddle | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  checkoutData: CheckoutEventsData | null;
  initializePaddle: () => Promise<void>;
  openCheckout: (priceId: string, userEmail?: string) => void;
  getPrice: (priceId: string) => Promise<PaddlePrice | null>;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

interface PaddleProviderProps {
  children: ReactNode;
}

export function PaddleProvider({ children }: PaddleProviderProps) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(null);

  const handleCheckoutEvents = useCallback((event: CheckoutEventsData) => {
    setCheckoutData(event);
  }, []);

  const initializePaddleInstance = useCallback(async () => {
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
          },
          checkout: {
            settings: {
              variant: "one-page",
              displayMode: "inline",
              frameTarget: "paddle-checkout-frame",
              frameInitialHeight: 450,
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
  }, [paddle?.Initialized, handleCheckoutEvents]);

  const openCheckout = useCallback(
    (priceId: string, userEmail?: string) => {
      if (!paddle?.Initialized) {
        console.error("Paddle not initialized");
        return;
      }

      paddle.Checkout.open({
        ...(userEmail && { customer: { email: userEmail } }),
        items: [{ priceId, quantity: 1 }],
      });
    },
    [paddle],
  );

  const getPrice = useCallback(
    async (priceId: string): Promise<PaddlePrice | null> => {
      if (!paddle?.Initialized) {
        throw new Error("Paddle not initialized");
      }

      try {
        const pricePreviewRequest: Partial<PricePreviewParams> = {
          items: [{ priceId, quantity: 1 }],
        };

        const prices = await paddle.PricePreview(pricePreviewRequest as PricePreviewParams);

        if (prices.data.details.lineItems.length > 0) {
          const item = prices.data.details.lineItems[0];

          if (!item) return null;

          return {
            id: item.price.id,
            price: item.formattedTotals.total as string,
            formattedPrice: item.formattedTotals.total as string,
            currency: "USD",
            name: (item.product.name as string) || "Unknown Product",
            description: item.product.description || "No description available",
            interval: item.price.billingCycle?.interval || "month",
            frequency: item.price.billingCycle?.frequency,
          };
        } else {
          throw new Error("Price not found");
        }
      } catch (error) {
        console.error("Failed to get price:", error);
        throw error;
      }
    },
    [paddle],
  );

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
    getPrice,
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

export function usePaddlePrice(priceId: string) {
  const { getPrice, isLoading, isInitialized } = usePaddle();
  const [price, setPrice] = useState<PaddlePrice | null>(null);
  useEffect(() => {
    getPrice(priceId).then(setPrice);
  }, [getPrice, priceId]);
  return { price, isLoading, isInitialized };
}
