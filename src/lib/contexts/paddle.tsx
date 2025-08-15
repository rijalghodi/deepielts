"use client";

import { type Environments, initializePaddle, type Paddle, PricePreviewParams } from "@paddle/paddle-js";
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
  initializePaddle: (eventCallback?: (event: any) => void) => Promise<void>;
  reinitializeWithEvents: (eventCallback: (event: any) => void) => Promise<void>;
  openCheckout: (options: { priceId: string; quantity?: number; userEmail?: string; successUrl?: string }) => void;
  updateCheckoutItems: (priceId: string, quantity: number) => void;
  closeCheckout: () => void;
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

  const initializePaddleInstance = useCallback(
    async (eventCallback?: (event: any) => void) => {
      if (!paddle?.Initialized && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
        setIsLoading(true);
        setError(null);

        try {
          const paddleInstance = await initializePaddle({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
            eventCallback: eventCallback || defaultEventCallback,
            checkout: {
              settings: {
                displayMode: "inline",
                frameTarget: "checkout-container",
                frameInitialHeight: 450,
                frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
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
    [paddle?.Initialized, defaultEventCallback],
  );

  const openCheckout = useCallback(
    ({
      priceId,
      quantity = 1,
      userEmail,
      successUrl,
    }: {
      priceId: string;
      quantity?: number;
      userEmail?: string;
      successUrl?: string;
    }) => {
      if (!paddle?.Initialized) {
        console.error("Paddle not initialized");
        return;
      }

      // Note: Event handling is done through the eventCallback parameter
      // when initializing Paddle, not through Checkout.on
      paddle.Checkout.open({
        ...(userEmail && { customer: { email: userEmail } }),
        items: [{ priceId, quantity }],
        ...(successUrl && { successUrl }),
        // settings: {
        //   displayMode: "inline",
        // },
      });
    },
    [paddle],
  );

  const updateCheckoutItems = useCallback(
    (priceId: string, quantity: number) => {
      if (!paddle?.Initialized) {
        console.error("Paddle not initialized");
        return;
      }

      paddle.Checkout.updateItems([{ priceId, quantity }]);
    },
    [paddle],
  );

  const closeCheckout = useCallback(() => {
    if (!paddle?.Initialized) {
      console.error("Paddle not initialized");
      return;
    }

    paddle.Checkout.close();
  }, [paddle]);

  const reinitializeWithEvents = useCallback(
    async (eventCallback: (event: any) => void) => {
      // Reset state to allow reinitialization
      setPaddle(null);
      setIsInitialized(false);
      setError(null);

      // Reinitialize with new event callback
      await initializePaddleInstance(eventCallback);
    },
    [initializePaddleInstance],
  );

  const getPrices = useCallback(
    async (country: string = "US"): Promise<PaddlePrices> => {
      if (!paddle?.Initialized) {
        throw new Error("Paddle not initialized");
      }

      try {
        // Get line items from pricing plans
        const lineItems = PRICING_PLANS.map((tier) => [tier.priceIds?.month, tier.priceIds?.quarter])
          .flat()
          .filter(Boolean)
          .map((priceId) => ({ priceId: priceId as string, quantity: 1 }));

        const pricePreviewRequest: Partial<PricePreviewParams> = {
          items: lineItems,
          ...(country !== "OTHERS" && { address: { countryCode: country } }),
        };

        const prices = await paddle.PricePreview(pricePreviewRequest as PricePreviewParams);

        console.log("prices", prices);

        // Extract price amounts from response
        return prices.data.details.lineItems.reduce((acc, item) => {
          acc[item.price.id] = {
            id: item.price.id,
            price: item.formattedTotals.total,
            frequency: item.price.customData?.frequency as string,
            currency: "USD", // Default currency
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
    initializePaddle: initializePaddleInstance,
    reinitializeWithEvents,
    openCheckout,
    updateCheckoutItems,
    closeCheckout,
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

// Hook for components that need to open checkout with specific events
export function usePaddleCheckout() {
  const { openCheckout, updateCheckoutItems, closeCheckout, isInitialized } = usePaddle();
  return { openCheckout, updateCheckoutItems, closeCheckout, isInitialized };
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

// // Hook for components that need monthly/quarterly prices specifically
// export function usePaddleFrequencyPrices(country: string = "US") {
//   const { getPricesByFrequency, isInitialized } = usePaddle();
//   const [frequencyPrices, setFrequencyPrices] = useState<{ month: string; quarter: string }>({
//     month: "0",
//     quarter: "0",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchFrequencyPrices = useCallback(async () => {
//     if (!isInitialized) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const priceData = await getPricesByFrequency(country);
//       setFrequencyPrices(priceData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch frequency prices");
//       console.error("Frequency price fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [getPricesByFrequency, country, isInitialized]);

//   // Auto-fetch prices when component mounts or dependencies change
//   useEffect(() => {
//     fetchFrequencyPrices();
//   }, [fetchFrequencyPrices]);

//   return {
//     month: frequencyPrices.month,
//     quarter: frequencyPrices.quarter,
//     loading,
//     error,
//     refetch: fetchFrequencyPrices,
//   };
// }
