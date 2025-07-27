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
    <div className={cn(inputVariants({ focusStyle: "none" }), "flex flex-col gap-4 p-5")}>
      {/* QUESTION */}
      <div className="flex gap-2">
        <div className="flex flex-col gap-3 flex-1">
          <Label>Your Answer</Label>
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
          {/* {!answer ||
            (answer.length === 0 && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Button variant="accent" size="sm">
                  <WandSparkles /> Generate Answer
                </Button>
              </div>
            ))} */}
        </div>
      </div>

      {/* TOOL */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">340 words</span>
      </div>
    </div>
  );
}
