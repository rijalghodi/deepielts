"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet";

interface AnalysisSheetProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
  className?: string;
}

export function AnalysisSheet({ isOpen, onClose, analysis, className }: AnalysisSheetProps) {
  if (!analysis) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full max-w-2xl overflow-y-auto", className)}>
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">AI Analysis Results</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="py-6 space-y-6"
        >
          {analysis.data && (
            <div className="space-y-4">
              {/* Band Score */}
              {analysis.data.bandScore && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border"
                >
                  <h3 className="font-semibold text-lg mb-2">Overall Band Score</h3>
                  <div className="text-3xl font-bold text-primary">{analysis.data.bandScore}</div>
                </motion.div>
              )}

              {/* Detailed Analysis */}
              {analysis.data.analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-lg">Detailed Analysis</h3>
                  <div className="prose prose-sm max-w-none">
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: analysis.data.analysis.replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Criteria Scores */}
              {analysis.data.criteriaScores && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="space-y-3"
                >
                  <h3 className="font-semibold text-lg">Criteria Scores</h3>
                  <div className="space-y-2">
                    {Object.entries(analysis.data.criteriaScores).map(([criteria, score]: [string, any]) => (
                      <div key={criteria} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium capitalize">{criteria.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className="font-bold text-primary">{score}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {analysis.data.suggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="space-y-3"
                >
                  <h3 className="font-semibold text-lg">Improvement Suggestions</h3>
                  <div className="space-y-2">
                    {Array.isArray(analysis.data.suggestions) ? (
                      analysis.data.suggestions.map((suggestion: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">{analysis.data.suggestions}</div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Raw Response (for debugging) */}
          {process.env.NODE_ENV === "development" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-8 p-4 bg-muted/30 rounded-lg"
            >
              <h4 className="font-medium text-sm mb-2">Debug Info</h4>
              <pre className="text-xs overflow-auto">{JSON.stringify(analysis, null, 2)}</pre>
            </motion.div>
          )}
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
