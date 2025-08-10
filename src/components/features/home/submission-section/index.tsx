"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { submissionGet, submissionGetKey } from "@/lib/api/submission.api";

import { SubmissionForm } from "@/components/features/home/submission-section/submission-form";

export function SubmissionSection() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");

  const { data: submissionData } = useQuery({
    queryKey: submissionGetKey(submissionId || ""),
    queryFn: () => submissionGet(submissionId!),
    enabled: !!submissionId,
  });

  return (
    <>
      <SubmissionForm submissionData={submissionData?.data} />
    </>
  );
}
