import { Dices, SquareMousePointer } from "lucide-react";
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
    <div className={cn(inputVariants({ focusStyle: "none" }), "flex flex-col gap-4 p-5")}>
      {/* QUESTION */}
      <div className="flex gap-2 flex-col md:flex-row">
        <div className="flex flex-col gap-3 flex-1">
          <Label>Question</Label>
          <Textarea
            placeholder="Enter an IELTS question or topic..."
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
          <InputImage placeholder="Upload Task 1 Image" value={image} onChange={handleImageChange} />
        )}
      </div>

      {/* TOOL */}
      <div className="flex flex-wrap items-center justify-center w-full gap-2">
        <Button variant="accent" size="sm">
          <SquareMousePointer />
          Select Question
        </Button>
        <Button variant="accent" size="sm">
          <Dices /> Randomize Question
        </Button>
      </div>
    </div>
  );
}
