"use client";

import { Download, FileText } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { submissionGeneratePDF } from "@/lib/api/submission.api";

import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfUrlState, setPdfUrlState] = useState<string | undefined>(undefined);

  // Check if PDF already exists when component mounts
  React.useEffect(() => {
    if (pdfUrl) {
      setPdfUrlState(pdfUrl);
    }
  }, [pdfUrl]);

  const handleGeneratePDF = async () => {
    if (!feedback) {
      toast.error("No feedback available to generate PDF");
      return;
    }

    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const response = await submissionGeneratePDF(id);

      if (response?.data?.url) {
        // Open the PDF in a new tab
        window.open(response.data.url, "_blank");

        setPdfUrlState(response.data.url);
        toast.success("PDF generated successfully!");
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:w-[600px]">
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Feedback</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF || !feedback}
                className="flex items-center gap-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <FileText className="h-4 w-4 animate-pulse" />
                    Generating...
                  </>
                ) : pdfUrlState ? (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Generate PDF
                  </>
                )}
              </Button>
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
