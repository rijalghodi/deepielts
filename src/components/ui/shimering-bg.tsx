// ShimmeringBackground.tsx
import React from "react";

export function ShimmeringBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="w-full h-full relative">
        <div className="absolute inset-0 animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%] bg-[linear-gradient(to_right,transparent_0%,transparent_25%,hsla(var(--primary)_/_0.2)_50%,transparent_75%,transparent_100%)]" />
        {/* <div className="absolute inset-0 animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%] bg-[linear-gradient(45deg,transparent_0%,transparent_0%,hsla(var(--primary)_/_0.2)_50%,transparent_100%,transparent_100%)]" /> */}
      </div>

      <style jsx>{`
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
