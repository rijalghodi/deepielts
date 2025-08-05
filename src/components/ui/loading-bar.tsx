"use client";

import { motion } from "framer-motion";
import React from "react";

interface LoadingBarProps {
  isVisible: boolean;
}

export function LoadingBar({ isVisible }: LoadingBarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-2 overflow-hidden z-50 bg-primary/20">
      <motion.div
        className="h-full w-full bg-primary/70"
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ position: "absolute", left: 0 }}
      />
    </div>
  );
}
