"use client";

import { motion } from "motion/react";
import React from "react";

interface LoadingBarProps {
  isVisible: boolean;
}

export function LoadingBar({ isVisible }: LoadingBarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-1.5 overflow-hidden z-50">
      <motion.div
        className="h-full w-1/2 bg-gradient-to-r from-primary/10 via-primary to-primary/10"
        animate={{ x: ["-100%", "150%"] }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
