import { WandSparkles } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { inputVariants } from "@/components/ui/input";
import { InputImage } from "@/components/ui/input-image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { QuestionType } from "@/server/models/submission";

type Props = {
  taskType: QuestionType;
  onChange?: (value: string) => void;
  onImageChange?: (value?: string) => void;
  value?: string;
  imageValue?: string;
};

export function QuestionInput({ taskType, onChange, onImageChange, value, imageValue }: Props) {
  const [question, setQuestion] = useState(value);
  const [image, setImage] = useState<string | undefined>(imageValue);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    onChange?.(e.target.value);
  };

  const handleImageChange = (value?: string) => {
    setImage(value);
    onImageChange?.(value);
  };

  return (
    <div className={cn(inputVariants({ focusStyle: "none" }), "flex flex-col gap-4 p-5")}>
      {/* QUESTION */}
      <div className="flex gap-2 flex-col md:flex-row">
        <div className="flex flex-col gap-3 flex-1">
          <Label>Question</Label>
          <Textarea
            placeholder={
              taskType === QuestionType.Task1Academic
                ? "Enter a Task 1 Academic question or topic..."
                : taskType === QuestionType.Task1General
                  ? "Enter a Task 1 General question or topic..."
                  : "Enter a Task 2 question or topic..."
            }
            minRows={2}
            maxRows={10}
            plainStyle
            className="text-base sm:text-base"
            preventResize
            value={question}
            onChange={handleQuestionChange}
          />
        </div>
        {taskType === QuestionType.Task1Academic && (
          <div className="flex items-center justify-center">
            <InputImage placeholder="Upload Task 1 Image" value={image} onChange={handleImageChange} />
          </div>
        )}
      </div>

      {/* TOOL */}
      <div className="flex flex-wrap items-center justify-center w-full gap-2">
        {/* TODO: Add question selection */}
        {/* <Button variant="accent" size="sm">
          <SquareMousePointer />
          Select Question
        </Button> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <WandSparkles /> Generate Question
            </Button>
          </TooltipTrigger>
          <TooltipContent className="w-[300px]" side="bottom">
            To get a specific question, enter a topic in a text box. Otherwise, a random question will be generated.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
