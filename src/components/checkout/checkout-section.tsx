// "use client";

// import React, { useEffect } from "react";

// import { usePaddleCheckout } from "@/lib/contexts/paddle";

// import { Skeleton } from "../ui/skeleton";

// type Props = {
//   priceId: string;
//   quantity: number;
//   userEmail?: string;
// };

// export function CheckoutSection({ priceId, quantity, userEmail }: Props) {
//   const { openCheckout, isInitialized, isLoading } = usePaddleCheckout();

//   useEffect(() => {
//     if (!isInitialized) return;
//     openCheckout({
//       priceId,
//       quantity,
//       userEmail,
//       successUrl: "/checkout/success",
//       variant: "one-page",
//       displayMode: "inline",
//     });
//   }, [openCheckout, priceId, quantity, userEmail, isInitialized]);

//   // if (isLoading)
//   //   return (
//   //     <div className="flex items-center justify-center h-screen">
//   //       <Skeleton className="w-xl h-xl" />
//   //       <Skeleton className="w-xl h-xl" />
//   //       <Skeleton className="w-xl h-xl" />
//   //       <Skeleton className="w-xl h-xl" />
//   //     </div>
//   //   );

//   return <div className="checkout-container" />;
// }
