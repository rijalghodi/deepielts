import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { inputVariants } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onChange?: (value: string) => void;
  value?: string;
};

export function AnswerInput({ onChange, value }: Props) {
  const [answer, setAnswer] = useState(value);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Your Answer</Label>
      <div className={cn(inputVariants({ focusStyle: "none" }), "flex flex-col gap-4 p-4 w-full")}>
        <Textarea
          placeholder="Enter your answer..."
          minRows={5}
          maxRows={10}
          plainStyle
          className="text-base sm:text-base"
          preventResize
          value={answer}
          onChange={handleAnswerChange}
        />

        {/* TOOL */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">340 words</span>
        </div>
      </div>
    </div>
  );
}
