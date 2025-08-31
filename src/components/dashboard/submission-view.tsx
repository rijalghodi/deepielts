"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { submissionGeneratePDF, submissionListKey } from "@/lib/api/submission.api";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  answer: string;
  date: string;
  feedback: string;
  pdfUrl?: string;
  id: string;
};

export default function SubmissionView({ isOpen, onClose, question, answer, date, feedback, pdfUrl, id }: Props) {
  const [pdfUrlState, setPdfUrlState] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const { mutateAsync: generatePDF, isPending: isGeneratingPDF } = useMutation({
    mutationFn: submissionGeneratePDF,
    onSuccess: (data) => {
      if (data?.data?.url) {
        queryClient.invalidateQueries({ queryKey: submissionListKey() });
        setPdfUrlState(data.data.url);
        toast.success("PDF generated successfully!");
        window.open(data.data.url, "_blank");
      }
    },
    onError: (error) => {
      toast.error("Failed to generate PDF.", {
        description: (error as any).message,
      });
    },
  });

  // Check if PDF already exists when component mounts
  React.useEffect(() => {
    if (pdfUrl) {
      setPdfUrlState(pdfUrl);
    }
  }, [pdfUrl]);

  const handleGeneratePDF = async () => {
    await generatePDF(id);
  };

  const handleDownloadPDF = () => {
    if (pdfUrlState) {
      window.open(pdfUrlState, "_blank");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Submission Details</SheetTitle>
          <SheetDescription className="sr-only">Submission Details</SheetDescription>
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Feedback</h3>
              {!feedback ? null : pdfUrlState ? (
                <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
                  <FileText className="h-4 w-4" />
                  {isGeneratingPDF ? "Generating..." : "Generate PDF"}
                </Button>
              )}
            </div>
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
          {/* <Button variant="outline" onClick={onClose} className="w-20">
            Close
          </Button> */}
          <Button variant="contrast" asChild>
            <Link href={`/?submissionId=${id}`}>Retry the Test</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
