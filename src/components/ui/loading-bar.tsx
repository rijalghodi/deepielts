"use client";

import { motion } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

interface LoadingBarProps {
  isVisible: boolean;
  className?: string;
}

export function LoadingBar({ isVisible, className }: LoadingBarProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t", className)}
    >
      <div className="max-w-screen-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <span className="text-sm text-muted-foreground font-medium">Analyzing your submission with AI...</span>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
