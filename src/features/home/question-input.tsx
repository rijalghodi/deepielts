import { WandSparkles } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { inputVariants } from "@/components/ui/input";
import { InputImage } from "@/components/ui/input-image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="flex flex-col gap-2">
      <Label>Question</Label>
      <div className={cn(inputVariants({ focusStyle: "none" }), "space-y-2 p-4 w-full")}>
        {/* QUESTION */}
        <div className="flex gap-5 gap-y-3 flex-col md:flex-row w-full">
          {taskType === QuestionType.Task1Academic && (
            <div className="">
              <InputImage placeholder="Upload Task 1 Image" value={image} onChange={handleImageChange} />
            </div>
          )}
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
            className="text-base sm:text-base flex-1"
            preventResize
            value={question}
            onChange={handleQuestionChange}
          />
        </div>
        {/* TOOL */}
        <div className="flex flex-wrap items-center justify-center w-full gap-2">
          <Button variant="outline" size="sm">
            <WandSparkles /> Generate Question
          </Button>
        </div>
      </div>
    </div>
  );
}
