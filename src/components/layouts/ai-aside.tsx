"use client";

import { AlertCircle, Download, FileText, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { useAIAnalysisStore } from "@/lib/zustand/ai-analysis-store";

import { Aside, AsideContent, AsideFooter, AsideHeader, AsideTrigger } from "@/components/ui/aside";

import { Button } from "../ui/button";
import { ShimmeringBackground } from "../ui/shimering-bg";

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
    <div className="ai-output">
      <blockquote data-section="overall-score">
        <p>Est. Overall Band Score</p>
        <p>0</p>
        <p>(+/- 0.5)</p>
      </blockquote>
      <blockquote data-section="criteria-score">
        <table>
          <thead>
            <tr>
              <th>TR</th>
              <th>CC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>LR</th>
              <th>GRA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </blockquote>
      <div className="text-sm text-muted-foreground text-center py-12">
        <FileText className="w-5 h-5 text-muted-foreground mx-auto" />
        <p>No analysis data available</p>
        <p>Please insert your essay to get started</p>
      </div>
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

// Main AI Analysis Component
function AIOutput() {
  const { analysis, error } = useAIAnalysisStore();

  if (error) {
    return <ErrorState error={error} />;
  }

  // If no analysis data, show empty state
  if (!analysis) {
    return <NoAnalysis />;
  }

  return (
    <div className="ai-output">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {analysis}
      </ReactMarkdown>
    </div>
  );
}

export function AIAside() {
  const { analysis, generating, error } = useAIAnalysisStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && generating) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [analysis]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    let lastScrollTop = container.scrollTop;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;

      const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 32;

      setAutoScroll(atBottom || currentScrollTop < lastScrollTop);

      lastScrollTop = currentScrollTop;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Aside variant="floating" className="shadow-lg">
      <AsideHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Analysis</h2>
          <AsideTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <XIcon className="w-4 h-4" />
            </Button>
          </AsideTrigger>
        </div>
      </AsideHeader>
      <AsideContent ref={contentRef}>
        {generating && <ShimmeringBackground />}
        <AIOutput />
        <div ref={messagesEndRef} />
      </AsideContent>
      {analysis && !generating && !error && <AsideFooter>{/* <DownloadButton /> */}</AsideFooter>}
    </Aside>
  );
}
