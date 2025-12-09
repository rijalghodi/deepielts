// ShimmeringBackground.tsx
import React from "react";

import { cn } from "@/lib/utils";

export function ShimmeringBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="w-full h-full relative">
        <div className="absolute inset-0 animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%] bg-[linear-gradient(to_right,transparent_0%,transparent_25%,hsla(var(--primary)_/_0.4)_50%,transparent_75%,transparent_100%)]" />
        {/* <div className="absolute inset-0 animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%] bg-[linear-gradient(45deg,transparent_0%,transparent_0%,hsla(var(--primary)_/_0.2)_50%,transparent_100%,transparent_100%)]" /> */}
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
