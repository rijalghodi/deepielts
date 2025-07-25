"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createSubmission } from "@/lib/api/submission.api";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectInput } from "@/components/ui/select-input";

import { createSubmissionBodySchema } from "@/server/dto/submission.dto";
import { QuestionType } from "@/server/models/submission";

import { AnswerInput } from "./answer-input";
import { QuestionInput } from "./question-input";

const schema = createSubmissionBodySchema;

type Props = {
  onSuccess?: (data: any) => void;
};

export function SubmissionForm({ onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: "",
      answer: "",
      questionType: QuestionType.Task1General,
      attachments: undefined,
    },
  });

  const { isPending, mutateAsync: submit } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      return createSubmission(values);
    },
    onError: (error: any) => {
      setError(error?.message || "Failed to submit");
    },
    onSuccess: (data) => {
      onSuccess?.(data);
      form.reset();
    },
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    setError(null);
    await submit(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 w-full">
      <Form {...form}>
        <FormField
          name="questionType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Type</FormLabel>
              <FormControl>
                <SelectInput
                  className="sm:max-w-[300px] w-full"
                  options={[
                    { label: "Task 1 General", value: QuestionType.Task1General },
                    { label: "Task 1 Academic", value: QuestionType.Task1Academic },
                    { label: "Task 2", value: QuestionType.Task2 },
                  ]}
                  placeholder="Select Question Type"
                  focusStyle="none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <QuestionInput
          taskType={form.watch("questionType") as QuestionType}
          onChange={(value) => form.setValue("question", value, { shouldDirty: true })}
          onImageChange={(value) => form.setValue("attachments", value, { shouldDirty: true })}
          value={form.watch("question")}
          imageValue={form.watch("attachments")}
        />

        <AnswerInput
          onChange={(value) => form.setValue("answer", value, { shouldDirty: true })}
          value={form.watch("answer")}
        />

        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        <Button variant="default" className="w-full" type="submit" size="xl" loading={isPending}>
          <Sparkles strokeWidth={1.5} /> Check Score
        </Button>
      </Form>
    </form>
  );
}
