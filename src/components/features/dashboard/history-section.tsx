"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { submissionList } from "@/lib/api/submission.api";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { GetSubmissionResult } from "@/server/dto/submission.dto";
import { QuestionType } from "@/server/models";

import SubmissionView from "./submission-view";

const QUESTION_TYPES = [
  {
    label: "Task 2",
    value: QuestionType.TASK_2,
  },
  {
    label: "Task 1 (Academic)",
    value: QuestionType.TASK_1_ACADEMIC,
  },
  {
    label: "Task 1 (General)",
    value: QuestionType.TASK_1_GENERAL,
  },
];

type Props = {
  className?: string;
};

function SubmissionGrid({
  submissions,
  isLoading,
  isError,
  onSubmissionClick,
}: {
  submissions: GetSubmissionResult[];
  isLoading?: boolean;
  isError?: boolean;
  onSubmissionClick: (submission: GetSubmissionResult) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-sm text-destructive py-8 text-center">Failed to load submission history</div>;
  }

  if (!submissions || submissions.length === 0) {
    return <div className="text-sm text-center py-8 text-muted-foreground">No submissions found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {submissions.map((submission) => (
        <button key={submission.id} onClick={() => onSubmissionClick(submission)} className="text-left">
          <Card className="py-4 hover:bg-accent">
            <CardContent className="px-4 text-left">
              <p className="text-sm font-medium mb-2">
                {QUESTION_TYPES.find((type) => type.value === submission.questionType)?.label}
              </p>
              <p className="text-sm text-left line-clamp-3">{submission.question || "No question provided"}</p>
            </CardContent>
            <CardFooter className="px-4 flex justify-between">
              <div className="text-xs text-muted-foreground">
                {submission.createdAt
                  ? new Date(submission.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
              <div className="text-sm font-medium">
                {submission.score?.OVR ? submission.score.OVR.toFixed(1) : "N/A"}
              </div>
            </CardFooter>
          </Card>
        </button>
      ))}
    </div>
  );
}

export default function HistorySection({ className }: Props) {
  const [questionTypes, setQuestionTypes] = useState<string[]>([QuestionType.TASK_2]);
  const [selectedSubmission, setSelectedSubmission] = useState<GetSubmissionResult | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["submission-list", questionTypes],
    queryFn: () => submissionList({ questionTypes: questionTypes.join(",") }),
  });

  const submissions = data?.data?.items || [];

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-wrap gap-5 justify-between">
        <ToggleGroup
          type="multiple"
          value={questionTypes as string[]}
          onValueChange={setQuestionTypes}
          variant="pill"
          size="sm"
          className="*:data-[slot=toggle-group-item]:!px-3 hidden sm:flex"
        >
          {QUESTION_TYPES.map((type) => (
            <ToggleGroupItem key={type.value} value={type.value}>
              {type.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex sm:hidden">
              Question Type
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {QUESTION_TYPES.map((type) => (
              <DropdownMenuCheckboxItem
                className="capitalize"
                checked={questionTypes.includes(type.value)}
                onCheckedChange={(value) => {
                  if (value) {
                    setQuestionTypes([...questionTypes, type.value]);
                  } else {
                    setQuestionTypes(questionTypes.filter((t) => t !== type.value));
                  }
                }}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SubmissionGrid
        submissions={submissions}
        isLoading={isLoading}
        isError={isError}
        onSubmissionClick={setSelectedSubmission}
      />

      {/* Submission View Sheet */}
      {selectedSubmission && (
        <SubmissionView
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          question={selectedSubmission.question || ""}
          answer={selectedSubmission.answer || ""}
          date={
            selectedSubmission.createdAt
              ? new Date(selectedSubmission.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"
          }
          feedback={selectedSubmission.feedback || ""}
          id={selectedSubmission.id}
        />
      )}
    </div>
  );
}
