"use client";

import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  answer: string;
  date: string;
  feedback: string;
  id: string;
};

export default function SubmissionView({ isOpen, onClose, question, answer, date, feedback, id }: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" containerClassName="w-full sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Submission Details</SheetTitle>
        </SheetHeader>

        <SheetBody className="flex flex-col gap-6">
          {/* Question */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Question</h3>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{question}</p>
            </div>
          </div>

          {/* Answer */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Your Answer</h3>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{answer}</p>
            </div>
          </div>

          {/* Feedback */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Feedback</h3>
            <div className="ai-output">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {feedback}
              </ReactMarkdown>
            </div>
          </div>

          {/* Question */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Date Submitted</h3>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{date}</p>
            </div>
          </div>
        </SheetBody>
        <SheetFooter className="flex flex-row gap-2 justify-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="contrast" asChild>
            <Link href={`/?submissionId=${id}`}>Retry the Test</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
