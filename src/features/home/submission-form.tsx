"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { submissionCreateStream } from "@/lib/api/submission.api";
import { useAIAnalysisStore } from "@/lib/zustand/ai-analysis-store";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAnalysis, appendAnalysis, clearAnalysis, setGenerating, setError, generating } = useAIAnalysisStore();
  const { setOpen } = useAside();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: "",
      answer: "",
      questionType: QuestionType.Task1General,
      attachment: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    try {
      setIsSubmitting(true);
      setError(null);
      clearAnalysis();
      setGenerating(true);
      setOpen(true);

      const stream = await submissionCreateStream(values);

      if (!stream) {
        throw new Error("Failed to get response stream");
      }

      reader = stream.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          appendAnalysis(chunk);
        }
      } finally {
        if (reader) {
          reader.releaseLock();
        }
      }

      setGenerating(false);
      onSuccess?.({ success: true });
      form.reset();
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error?.message || "Failed to submit");
      setGenerating(false);
    } finally {
      if (reader) {
        try {
          reader.releaseLock();
        } catch (e) {
          console.error("Error releasing reader lock:", e);
        }
      }
      setIsSubmitting(false);
    }
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

          <div className="flex justify-center">
            <Button
              variant="default"
              className="w-full"
              type="submit"
              size="xl"
              loading={isSubmitting || generating}
              disabled={isSubmitting || generating}
            >
              <Sparkles strokeWidth={1.5} />
              {generating ? "Generating Analysis..." : "Check Score"}
            </Button>
          </div>
        </Form>
      </form>
      {/* Loading Bar */}
      <LoadingBar isVisible={isSubmitting || generating} />
    </motion.div>
  );
}
