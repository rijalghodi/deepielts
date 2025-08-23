import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { inputVariants } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createSubmissionBodySchema } from "@/server/dto/submission.dto";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

export function AnswerInput() {
  const [wordCount, setWordCount] = useState(0);

  const { control, watch } = useFormContext<z.infer<typeof createSubmissionBodySchema>>();

  useEffect(() => {
    const count = (watch("answer")?.match(/\b\w+\b/g) || []).length;
    setWordCount(count);
  }, [watch("answer")]);

  return (
    <FormField
      name="answer"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Answer</FormLabel>
          <div className={cn(inputVariants({ focusStyle: "none" }), "flex flex-col gap-4 p-4 w-full")}>
            <Textarea
              placeholder="Enter your answer..."
              minRows={5}
              maxRows={10}
              plainStyle
              preventResize
              value={field.value}
              onChange={field.onChange}
              className="text-base"
            />

            {/* TOOL */}
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-xs text-muted-foreground">{wordCount} words</span>
              {field.value && (
                <Button variant="outline" size="xs" onClick={() => field.onChange("")}>
                  <Eraser /> Clear Answer
                </Button>
              )}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
