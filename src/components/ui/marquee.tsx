import React, { ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
}

const Marquee = ({ children, className, pauseOnHover = false, reverse = false }: MarqueeProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  //   const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current && containerRef.current) {
        setContentWidth(contentRef.current.scrollWidth);
        // setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [children]);

  //   const animationDuration = contentWidth > 0 ? contentWidth / speed : 10;

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={contentRef}
        className={cn(
          "flex gap-4",
          isPaused ? "animate-none" : "animate-marquee",
          reverse && "animate-marquee-reverse",
        )}
        style={
          {
            "--marquee-duration": `10s`,
          } as React.CSSProperties
        }
      >
        {children}
        {children} {/* Duplicate content for seamless loop */}
      </div>
    </div>
  );
};

export default Marquee;
