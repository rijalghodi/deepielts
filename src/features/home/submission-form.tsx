"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { submissionCreate } from "@/lib/api/submission.api";
import { useAnalysisStore } from "@/lib/zustand/analysis-store";

import { useAside } from "@/components/ui/aside";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DoodleArrow } from "@/components/ui/icons/doodle-arrow";
import { LoadingBar } from "@/components/ui/loading-bar";
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
  const { setAnalysis } = useAnalysisStore();
  const { setOpen } = useAside();

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
      return submissionCreate(values).then((res) => res?.data);
    },
    onError: (error: any) => {
      setError(error?.message || "Failed to submit");
    },
    onSuccess: (data) => {
      console.log("data", data);
      // Handle the new response structure with analysis
      if (data?.analysis) {
        setAnalysis(data.analysis);
        setOpen(true);
      }

      onSuccess?.(data);
      form.reset();
    },
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    setError(null);
    setAnalysis(null);
    await submit(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 w-full relative">
        <div className="hidden sm:block absolute top-0 right-0 -rotate-10 text-foreground">
          <div className="font-bold text-lg">Try this out</div>
          <DoodleArrow width={90} height={80} />
        </div>
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

          <div>
            <QuestionInput taskType={form.watch("questionType") as QuestionType} />
          </div>

          <AnswerInput />

          {error && <p className="text-destructive text-sm text-center">{error}</p>}

          <div className="flex justify-center">
            <Button variant="default" className="w-full" type="submit" size="xl" loading={isPending}>
              <Sparkles strokeWidth={1.5} /> Check Score
            </Button>
          </div>
        </Form>
      </form>
      {/* Loading Bar */}
      <LoadingBar isVisible={isPending} />
    </motion.div>
  );
}
