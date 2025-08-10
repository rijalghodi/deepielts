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
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { State } from "@/components/ui/states";
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

const ITEMS_PER_PAGE = 10;

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
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
          <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <State title="Failed to load submission history" icon="error" />;
  }

  if (!submissions || submissions.length === 0) {
    return <State title="No submissions found" icon="empty" />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-stretch">
      {submissions.map((submission) => (
        <button key={submission.id} onClick={() => onSubmissionClick(submission)} className="text-left">
          <Card className="py-4 hover:bg-accent h-full">
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
  const [questionTypes, setQuestionTypes] = useState<string[]>([
    QuestionType.TASK_2,
    QuestionType.TASK_1_ACADEMIC,
    QuestionType.TASK_1_GENERAL,
  ]);
  const [selectedSubmission, setSelectedSubmission] = useState<GetSubmissionResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["submission-list", questionTypes, currentPage],
    queryFn: () =>
      submissionList({
        questionTypes: questionTypes.join(","),
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
  });

  const submissions = data?.data?.items || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  // Reset to first page when question types change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [questionTypes]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

      {/* Pagination */}
      <div className="flex gap-2 justify-between">
        {/* Results count */}
        {pagination && (
          <div className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalCount)} of {pagination.totalCount} submissions
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={10} onPageChange={handlePageChange} isLoading={isLoading} />
      </div>

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
