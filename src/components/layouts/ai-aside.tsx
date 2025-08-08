"use client";

import { AlertCircle, Download, FileText, Loader2, XIcon } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAIAnalysisStore } from "@/lib/zustand/ai-analysis-store";

import { Aside, AsideContent, AsideFooter, AsideHeader, AsideTrigger } from "@/components/ui/aside";

import { Button } from "../ui/button";
import rehypeRaw from "rehype-raw";

// Download Button Component
function DownloadButton() {
  return (
    <div className="flex items-center justify-center">
      <Button variant="outline" size="sm">
        <Download />
        Download PDF
      </Button>
    </div>
  );
}

function NoAnalysis() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
      <FileText className="w-5 h-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground text-center mt-2">No analysis data available</p>
      <p className="text-sm text-muted-foreground text-center">Please insert your essay to get started</p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
      <AlertCircle className="w-5 h-5 text-destructive" />
      <p className="text-sm text-destructive text-center mt-2">Error occurred</p>
      <p className="text-sm text-muted-foreground text-center">{error}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
      <p className="text-sm text-muted-foreground text-center mt-2">Generating analysis...</p>
      <p className="text-sm text-muted-foreground text-center">This may take a few moments</p>
    </div>
  );
}

// Main AI Analysis Component
function AIOutput() {
  const { analysis, generating, error } = useAIAnalysisStore();

  if (error) {
    return <ErrorState error={error} />;
  }

  // If no analysis data, show empty state
  if (!analysis) {
    return <NoAnalysis />;
  }

  console.log(analysis);

  return (
    <div className="relative ai-output">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {analysis}
      </ReactMarkdown>
    </div>
  );
}

export function AIAside() {
  const { analysis, generating, error } = useAIAnalysisStore();

  return (
    <Aside variant="floating" className="shadow-lg">
      <AsideHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            AI Analysis
            {generating && <span className="ml-2 text-sm text-muted-foreground">(Generating...)</span>}
          </h2>
          <AsideTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <XIcon className="w-4 h-4" />
            </Button>
          </AsideTrigger>
        </div>
      </AsideHeader>
      <AsideContent>
        <AIOutput />
      </AsideContent>
      {analysis && !generating && !error && (
        <AsideFooter>
          <DownloadButton />
        </AsideFooter>
      )}
    </Aside>
  );
}
