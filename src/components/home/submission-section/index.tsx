"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { SubmissionForm } from "@/components/home/submission-section/submission-form";
import { submissionGet, submissionGetKey } from "@/lib/api/submission.api";

export function SubmissionSection() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");

  const { data: submissionData } = useQuery({
    queryKey: submissionGetKey(submissionId || ""),
    queryFn: () => submissionGet(submissionId!),
    enabled: !!submissionId,
  });

  return (
    <SubmissionForm
      submissionData={
        submissionData?.data
          ? {
              answer: submissionData?.data?.answer,
              question: submissionData?.data?.question,
              questionType: submissionData?.data?.questionType,
              attachment: submissionData?.data?.attachment || undefined,
              feedback: submissionData?.data?.feedback || undefined,
            }
          : undefined
      }
    />
  );
}
