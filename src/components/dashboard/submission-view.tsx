"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

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
import { submissionGenerateDOCX, submissionGeneratePDF, submissionListKey } from "@/lib/api/submission.api";
import { getDocxFromCache, saveDocxToCache } from "@/lib/storage/docx-cache";

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
  const [docxUrlState, setDocxUrlState] = useState<string | undefined>(undefined);
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

  const { mutateAsync: generateDOCX, isPending: isGeneratingDOCX } = useMutation({
    mutationFn: async () => {
      // First check cache
      const cachedDocx = await getDocxFromCache(id);
      if (cachedDocx) {
        return cachedDocx;
      }

      // If not cached, generate from markdown
      const markdown = `## Question\n\n${question}\n\n## Your Answer\n\n${answer}\n\n## Feedback\n\n${feedback}`;
      const docxBlob = await submissionGenerateDOCX(markdown);

      // Save to cache
      await saveDocxToCache(id, docxBlob);

      return docxBlob;
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      setDocxUrlState(url);
      toast.success("DOCX generated successfully!");
      // Auto-download
      const link = document.createElement("a");
      link.href = url;
      link.download = `feedback-${id}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (error) => {
      toast.error("Failed to generate DOCX.", {
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

  // Check for cached DOCX when component mounts
  React.useEffect(() => {
    const checkCachedDocx = async () => {
      if (feedback && id) {
        const cachedDocx = await getDocxFromCache(id);
        if (cachedDocx) {
          const url = URL.createObjectURL(cachedDocx);
          setDocxUrlState(url);
        }
      }
    };
    checkCachedDocx();
  }, [feedback, id]);

  const handleGeneratePDF = async () => {
    await generatePDF(id);
  };

  const handleDownloadPDF = () => {
    if (pdfUrlState) {
      window.open(pdfUrlState, "_blank");
    }
  };

  const handleGenerateDOCX = async () => {
    await generateDOCX();
  };

  const handleDownloadDOCX = () => {
    if (docxUrlState) {
      const link = document.createElement("a");
      link.href = docxUrlState;
      link.download = `feedback-${id}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">Feedback</h3>
              {!feedback ? null : (
                <div className="flex gap-2">
                  {docxUrlState ? (
                    <Button variant="outline" size="sm" onClick={handleDownloadDOCX} disabled={isGeneratingDOCX}>
                      <Download className="h-4 w-4" />
                      Download DOCX
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleGenerateDOCX} disabled={isGeneratingDOCX}>
                      <FileText className="h-4 w-4" />
                      {isGeneratingDOCX ? "Generating..." : "Generate DOCX"}
                    </Button>
                  )}
                  {pdfUrlState ? (
                    <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
                      <FileText className="h-4 w-4" />
                      {isGeneratingPDF ? "..." : "PDF"}
                    </Button>
                  )}
                </div>
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
