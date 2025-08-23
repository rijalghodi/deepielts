"use client";

import { motion } from "framer-motion";
import { Loader, Square } from "lucide-react";
import React from "react";

import { Button } from "./button";

interface LoadingBarProps {
  isVisible?: boolean;
  onStop?: () => void;
  title?: string;
}

export function LoadingBar({ isVisible, onStop, title }: LoadingBarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full">
      <div className="w-full flex justify-center mb-5">
        <div className="bg-card border shadow-xl rounded-lg px-3 py-2 flex items-center gap-5">
          <span className="font-semibold text-sm flex items-center gap-2">
            <Loader className="animate-spin w-4 h-4 inline" />
            {title || "Generating Analysis"}
          </span>

          <Button variant="accent" size="sm" title="Stop Generation" onClick={onStop}>
            <Square /> Stop
          </Button>
        </div>
      </div>

      <div className="w-full h-1.5 overflow-hidden z-50 bg-primary/20">
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
    </div>
  );
}
