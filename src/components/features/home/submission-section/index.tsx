"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { submissionGet, submissionGetKey } from "@/lib/api/submission.api";

import { SubmissionForm } from "@/components/features/home/submission-section/submission-form";

import { QuestionType } from "@/server/models/submission";

export function SubmissionSection() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");
  const isNew = searchParams.get("new");

  const { data: submissionData } = useQuery({
    queryKey: submissionGetKey(submissionId || ""),
    queryFn: () => submissionGet(submissionId!),
    enabled: !!submissionId,
  });

  return (
    <SubmissionForm
      submissionData={
        isNew
          ? {
              answer: "",
              question: "",
              questionType: QuestionType.TASK_1_GENERAL,
            }
          : {
              answer: submissionData?.data?.answer,
              question: submissionData?.data?.question,
              questionType: submissionData?.data?.questionType,
              attachment: submissionData?.data?.attachment || undefined,
              feedback: submissionData?.data?.feedback || undefined,
            }
      }
    />
  );
}
