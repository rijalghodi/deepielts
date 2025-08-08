"use client";

import { AlertCircle, Bot, Download, FileText, Loader, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { useAIAnalysisStore } from "@/lib/zustand/ai-analysis-store";

import { Aside, AsideContent, AsideFooter, AsideHeader, AsideTrigger } from "@/components/ui/aside";

import { Button } from "../ui/button";

// Download Button (currently unused)
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

function ThinkingState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 py-12">
      <Bot className="w-8 h-8 text-primary" />
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-base font-semibold text-center">AI is Thinking...</p>
        <p className="text-base text-muted-foreground text-center">This may take a while, please wait a moment</p>
      </div>
      <Loader className="w-5 h-5 text-primary animate-spin" />
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
      <AlertCircle className="w-5 h-5 text-destructive" />
      <p className="text-base font-semibold text-destructive text-center mt-2">Error occurred</p>
      <p className="text-base text-muted-foreground text-center">{error}</p>
    </div>
  );
}

function AIOutput() {
  const { analysis, generating, error } = useAIAnalysisStore();

  if (error) return <ErrorState error={error} />;

  if (!analysis) {
    if (generating) return <ThinkingState />;

    return (
      <div className="relative ai-output">
        <NoAnalysis />
      </div>
    );
  }

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
  const contentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when generating and new analysis arrives
  useEffect(() => {
    if (autoScroll && generating && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [analysis, autoScroll, generating]);

  // Track scroll position to enable/disable auto-scroll
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    let lastScrollTop = container.scrollTop;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      console.log("scroll!!!", currentScrollTop, lastScrollTop);
      const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      setAutoScroll(atBottom);
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
        <AIOutput />
        <div className="flex-none h-20 w-full" ref={messagesEndRef} />
      </AsideContent>
      {analysis && !generating && !error && <AsideFooter>{/* <DownloadButton /> */}</AsideFooter>}
    </Aside>
  );
}
