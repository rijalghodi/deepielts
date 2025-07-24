"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createSubmission } from "@/lib/api/submission.api";
import { createSubmissionBodySchema } from "@/server/dto/submission.dto";
import { QuestionType } from "@/server/models/submission";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/select-input";
import { Textarea } from "@/components/ui/textarea";
import { TextareaInput } from "@/components/ui/textarea-input";
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
      attachments: [],
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
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-3.5 w-full">
      <Form {...form}>
        <FormField
          name="questionType"
          control={form.control}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Question Type</FormLabel>
              <FormControl>
                <SelectInput
                  options={[
                    { label: "Task 1 General", value: QuestionType.Task1General },
                    { label: "Task 1 Academic", value: QuestionType.Task1Academic },
                    { label: "Task 2", value: QuestionType.Task2 },
                  ]}
                  placeholder="Select Question Type"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="question"
          control={form.control}
          render={({ field }) => <QuestionInput taskType={form.watch("questionType") as QuestionType} />}
        />
        <FormField
          name="answer"
          control={form.control}
          render={({ field }) => (
            <FormItem variant="filled">
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your answer" {...field} rows={10} plainStyle />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="attachments"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachments (comma separated URLs)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter attachment URLs, separated by commas"
                  value={field.value?.join(",") || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="answer"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  maxRows={10}
                  plainStyle
                  preventResize
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        <Button
          variant="default"
          className="w-full"
          type="submit"
          disabled={!form.formState.isDirty}
          loading={isPending}
        >
          Submit
        </Button>
      </Form>
    </form>
  );
}
