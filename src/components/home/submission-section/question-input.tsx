"use client";

import { WandSparkles } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import TASK_1_GENERAL_QUESTIONS from "@/lib/constants/task-1-general-questions.json";
import TASK_2_QUESTIONS from "@/lib/constants/task-2-questions.json";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { inputVariants } from "@/components/ui/input";
import { InputImage } from "@/components/ui/input-image";
import { Textarea } from "@/components/ui/textarea";

import { createSubmissionBodySchema } from "@/server/dto/submission.dto";
import { QuestionType } from "@/server/models/submission";

type Props = {
  taskType: QuestionType;
};

export function QuestionInput({ taskType }: Props) {
  const { control, setValue } = useFormContext<z.infer<typeof createSubmissionBodySchema>>();

  const handleGenerateQuestion = () => {
    const question =
      taskType === QuestionType.TASK_1_GENERAL
        ? TASK_1_GENERAL_QUESTIONS[Math.floor(Math.random() * TASK_1_GENERAL_QUESTIONS.length)]
        : TASK_2_QUESTIONS[Math.floor(Math.random() * TASK_2_QUESTIONS.length)];
    setValue("question", question.question, { shouldDirty: true });
  };

  return (
    <FormItem>
      <FormLabel>Question</FormLabel>
      <div className="flex flex-col md:flex-row gap-2 w-full">
        {/* IMAGE INPUT */}
        {taskType === QuestionType.TASK_1_ACADEMIC && (
          <FormField
            name="attachment"
            control={control}
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <InputImage
                    placeholder="Upload Task 1 Image"
                    value={field.value}
                    onChange={field.onChange}
                    folder="task-1-academic"
                    maxSizeMB={0.5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          name="question"
          control={control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className={cn(inputVariants({ focusStyle: "none" }), "p-4 flex flex-col gap-2")}>
                  {/* QUESTION */}
                  <Textarea
                    placeholder={
                      "Enter a question or topic..."
                      // taskType === QuestionType.Task1Academic
                      //   ? "Enter a Task 1 Academic question or topic..."
                      //   : taskType === QuestionType.Task1General
                      //     ? "Enter a Task 1 General question or topic..."
                      //     : "Enter a Task 2 question or topic..."
                    }
                    minRows={3}
                    maxRows={5}
                    plainStyle
                    preventResize
                    value={field.value}
                    onChange={field.onChange}
                    className="text-base"
                  />
                  {/* TOOL */}
                  <div className="flex flex-wrap items-center justify-center w-full gap-2">
                    {taskType !== QuestionType.TASK_1_ACADEMIC && !field.value && (
                      <Button variant="outline" size="sm" onClick={handleGenerateQuestion}>
                        <WandSparkles /> Generate Question
                      </Button>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormItem>
  );
}
