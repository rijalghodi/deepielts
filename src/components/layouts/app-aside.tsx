"use client";

import { Download, XIcon } from "lucide-react";
import React from "react";

import { useAnalysisStore } from "@/lib/zustand/analysis-store";

import { Aside, AsideContent, useAside } from "@/components/ui/aside";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

// Reusable Heading Components
interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

function H1({ children, className = "" }: HeadingProps) {
  return <h1 className={`text-5xl font-bold text-primary ${className}`}>{children}</h1>;
}

function H2({ children, className = "" }: HeadingProps) {
  return <h2 className={`text-2xl font-semibold ${className}`}>{children}</h2>;
}

function H3({ children, className = "" }: HeadingProps) {
  return <h3 className={`text-xl text-primary font-semibold ${className}`}>{children}</h3>;
}

function H4({ children, className = "" }: HeadingProps) {
  return <h4 className={`text-base font-semibold ${className}`}>{children}</h4>;
}

function H5({ children, className = "" }: HeadingProps) {
  return <h5 className={`text-xs italic font-semibold ${className}`}>{children}</h5>;
}

// Header Component
interface AnalysisHeaderProps {
  onClose: () => void;
}

function AnalysisHeader({ onClose }: AnalysisHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <H2>AI Analysis</H2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <XIcon className="w-4 h-4" />
      </Button>
    </header>
  );
}

// Overall Score Component
interface OverallScoreProps {
  score: number;
}

function OverallScore({ score }: OverallScoreProps) {
  return (
    <section className="bg-primary/10 rounded-xl px-4 py-6">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-base font-semibold">Overall Band Score</p>
        <H1>{score}</H1>
        <p className="text-sm text-muted-foreground">(+/- 0.5)</p>
      </div>
    </section>
  );
}

// Criteria Grid Component
interface CriteriaProps {
  tr: number;
  cc: number;
  lr: number;
  gra: number;
}

function CriteriaGrid({ tr, cc, lr, gra }: CriteriaProps) {
  const criteria = [
    { label: "TR", score: tr },
    { label: "CC", score: cc },
    { label: "LR", score: lr },
    { label: "GRA", score: gra },
  ];

  return (
    <section className="grid grid-cols-2 gap-5 px-4">
      {criteria.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2 px-4">
          <p className="text-sm font-semibold">{item.label}</p>
          <p className="text-3xl font-semibold text-primary">{item.score}</p>
        </div>
      ))}
    </section>
  );
}

// Assessment Section Component
interface AssessmentSectionProps {
  title: string;
  description: string;
  items: Array<{ score: number; label: string }>;
}

function AssessmentSection({ title, description, items }: AssessmentSectionProps) {
  return (
    <section className="flex flex-col gap-3 p-4 border border-border rounded-xl">
      <H4>{title}</H4>
      <p className="text-xs text-muted-foreground">{description}</p>
      <ul className="flex flex-col gap-2 text-xs">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="h-5 w-5 text-xs bg-primary/10 font-semibold font-mono text-primary border border-primary rounded-xs flex items-center justify-center">
              {item.score}
            </div>
            <span className="font-semibold">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Paragraph Analysis Component
interface ParagraphAnalysisProps {
  paragraphNumber: number;
  originalText: string;
  comments: string[];
  revisedText: string;
}

function ParagraphAnalysis({ paragraphNumber, originalText, comments, revisedText }: ParagraphAnalysisProps) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold with-dash uppercase">Paragraph {paragraphNumber}</h4>
      <p className="text-xs text-muted-foreground">"{originalText}"</p>
      <H5>Comments</H5>
      {comments.map((comment, index) => (
        <p key={index} className="text-xs text-muted-foreground">
          "{comment}"
        </p>
      ))}
      <H5>Revised Paragraph</H5>
      <p className="text-xs text-muted-foreground">"{revisedText}"</p>
    </section>
  );
}

// Detailed Assessment Component
interface DetailedAssessmentProps {
  paragraphs: Array<{
    number: number;
    original: string;
    comments: string[];
    revised: string;
  }>;
}

function DetailedAssessment({ paragraphs }: DetailedAssessmentProps) {
  return (
    <section className="flex flex-col gap-3 py-3 px-4">
      <H3>Detailed Assessment</H3>
      <section className="flex flex-col gap-2">
        <H4>Improve Each Paragraphs</H4>
        <Separator />
        {paragraphs.map((paragraph) => (
          <React.Fragment key={paragraph.number}>
            <ParagraphAnalysis
              paragraphNumber={paragraph.number}
              originalText={paragraph.original}
              comments={paragraph.comments}
              revisedText={paragraph.revised}
            />
            <Separator />
          </React.Fragment>
        ))}
      </section>
    </section>
  );
}

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

// Main AI Analysis Component
function AIAnalysis() {
  const { analysis } = useAnalysisStore();
  const { setOpen } = useAside();

  console.log(analysis);

  const data = {
    overallScore: analysis?.score.totalScore,
    criteria: {
      tr: analysis?.score.scores.taskResponse.score,
      cc: analysis?.score.scores.coherenceCohesion.score,
      lr: analysis?.score.scores.lexicalResource.score,
      gra: analysis?.score.scores.grammar.score,
    },
    taskResponse: analysis?.score.scores.taskResponse,
  };

  // Default values for props
  const defaultData = {
    overallScore: 0,
    criteria: { tr: 0, cc: 0, lr: 0, gra: 0 },
    taskResponse: {
      title: "Task Response",
      description:
        "Task Response / Task Achievement: LexiBot essay checker will evaluate how well you address the task, follow the required format, and use relevant data and examples in your writing.",
      items: [
        { score: 0, label: "Relevance to prompt" },
        { score: 0, label: "Relevance to prompt" },
      ],
    },
    coherence: {
      title: "Coherence",
      description:
        "Coherence: LexiBot essay checker will evaluate how well you address the task, follow the required format, and use relevant data and examples in your writing.",
      items: [
        { score: 0, label: "Coherence" },
        { score: 0, label: "Coherence" },
      ],
    },
    paragraphs: [
      {
        number: 1,
        original: "Original Paragraph",
        comments: ["Comments", "Comments"],
        revised: "Revised Paragraph",
      },
    ],
  };

  return (
    <article className="flex flex-col p-4 gap-5">
      <AnalysisHeader onClose={() => setOpen(false)} />
      <OverallScore score={defaultData.overallScore} />
      <CriteriaGrid {...defaultData.criteria} />
      <AssessmentSection {...defaultData.taskResponse} />
      <AssessmentSection {...defaultData.coherence} />
      <DetailedAssessment paragraphs={defaultData.paragraphs} />
      <DownloadButton />
    </article>
  );
}

export function AppAside() {
  return (
    <Aside className="shadow-lg">
      <AsideContent>
        <AIAnalysis />
      </AsideContent>
    </Aside>
  );
}
