import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputImage } from "@/components/ui/input-image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuestionType } from "@/server/models/submission";
import { Dices, Hand, PlusIcon } from "lucide-react";
import React from "react";

type Props = {
  taskType: QuestionType;
};

export function QuestionInput({ taskType }: Props) {
  return (
    <div className="bg-muted rounded-lg p-4 sm:p-6 flex flex-col gap-2">
      {/* QUESTION */}
      <div className="flex gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <Label>Question</Label>
          <Textarea placeholder="Enter the question" rows={3} maxRows={10} plainStyle className="py-2" preventResize />
          {/* <textarea placeholder="Enter the question" /> */}
        </div>
        {taskType === QuestionType.Task1Academic && <InputImage />}
      </div>

      {/* TOOL */}
      <div className="flex items-center justify-center w-full gap-2">
        <Button variant="accent" size="sm">
          <Hand />
          Select Question
        </Button>
        <Button variant="accent" size="sm">
          <Dices /> Randomize Question
        </Button>
      </div>
    </div>
  );
}
