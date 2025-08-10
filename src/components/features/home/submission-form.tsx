"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
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

const FORM_STORAGE_KEY = "ielts_submission_form_data";

export function SubmissionForm({ onSuccess }: Props) {
  const { appendAnalysis, clearAnalysis, setGenerating, setError, generating, setAbortController, stopGeneration } =
    useAIAnalysisStore();
  const { setOpen, setOpenMobile } = useAside();
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get stored form data on first render
  const getStoredFormData = (): z.infer<typeof schema> | null => {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(FORM_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that the stored data matches our schema
        const result = schema.safeParse(parsed);
        if (result.success) {
          return result.data;
        }
      }
    } catch (error) {
      console.error("Error parsing stored form data:", error);
    }
    return null;
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: getStoredFormData() || {
      question: "",
      answer: "",
      questionType: QuestionType.TASK_1_GENERAL,
      attachment: undefined,
    },
  });

  // Debounced function to save form data to localStorage
  const saveFormData = (data: z.infer<typeof schema>) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
    }
  };

  // Watch form values and debounce save
  const watchedValues = form.watch();

  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout to save after 3 seconds
    debounceTimeoutRef.current = setTimeout(() => {
      saveFormData(watchedValues);
    }, 1000);

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [watchedValues]);

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    try {
      setError(null);
      clearAnalysis();
      setGenerating(true);
      setOpen(true);
      setOpenMobile(true);

      // Create AbortController for this request
      const abortController = new AbortController();
      setAbortController(abortController);

      const stream = await submissionCreateStream(values, abortController.signal);

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
      setAbortController(null);
      onSuccess?.({ success: true });
    } catch (error: any) {
      console.error("Submission error:", error);

      // Check if the error is due to abort
      if (error.name === "AbortError") {
        setError(null);
      } else {
        setError(error?.message || "Failed to submit");
      }

      setGenerating(false);
      setAbortController(null);
    } finally {
      if (reader) {
        try {
          reader.releaseLock();
        } catch (e) {
          console.error("Error releasing reader lock:", e);
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
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
                      { label: "Task 1 General", value: QuestionType.TASK_1_GENERAL },
                      { label: "Task 1 Academic", value: QuestionType.TASK_1_ACADEMIC },
                      { label: "Task 2", value: QuestionType.TASK_2 },
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

          <QuestionInput taskType={form.watch("questionType") as QuestionType} />

          <AnswerInput />

          <div className="flex justify-center gap-2">
            <Button
              variant="default"
              className="flex-1"
              type="submit"
              size="xl"
              loading={generating}
              disabled={generating}
            >
              <Sparkles />
              {generating ? "Generating Analysis..." : "Check Score"}
            </Button>
          </div>
        </Form>
      </form>
      {/* Loading Bar */}
      <LoadingBar isVisible={generating} onStop={stopGeneration} />
    </motion.div>
  );
}
