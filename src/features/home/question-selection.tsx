import { QuestionType } from "@/server/models/submission";
import React from "react";

type Props = {
  onSelect: (question: string) => void;
  taskType: QuestionType;
};

export function QuestionSelection({ onSelect, taskType }: Props) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2"></div>
        </div>
      </div>
    </div>
  );
}
