"use client";

import { Download, FileText, XIcon } from "lucide-react";
import React from "react";

import { useAnalysisStore } from "@/lib/zustand/analysis-store";

import { Aside, AsideContent, AsideFooter, AsideHeader, AsideTrigger } from "@/components/ui/aside";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

// Reusable Heading Components
interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

function H2({ children, className = "" }: HeadingProps) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

function H3({ children, className = "" }: HeadingProps) {
  return <h3 className={`text-lg text-primary font-semibold ${className}`}>{children}</h3>;
}

function H4({ children, className = "" }: HeadingProps) {
  return <h4 className={`text-base font-semibold ${className}`}>{children}</h4>;
}

function H5({ children, className = "" }: HeadingProps) {
  return <h5 className={`text-xs italic font-semibold ${className}`}>{children}</h5>;
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
        <p className="text-5xl font-semibold text-primary">{score}</p>
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

function NoAnalysis() {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <OverallScore score={0} />
      <CriteriaGrid tr={0} cc={0} lr={0} gra={0} />
      <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
        <FileText className="w-5 h-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center mt-2">No analysis data available</p>
        <p className="text-sm text-muted-foreground text-center">Please insert your essay to get started</p>
      </div>
    </div>
  );
}

// Main AI Analysis Component
function AIAnalysis() {
  const { analysis } = useAnalysisStore();

  // If no analysis data, show loading or empty state
  if (!analysis) {
    return (
      <article className="flex flex-col gap-5">
        <OverallScore score={0} />
        <CriteriaGrid tr={0} cc={0} lr={0} gra={0} />
        <p className="text-sm text-muted-foreground text-center">No analysis data available</p>
        <p className="text-sm text-muted-foreground text-center">Please insert your essay to get started</p>
      </article>
    );
  }

  // Map analysis data to component props
  const overallScore = analysis.score.totalScore;

  const criteria = {
    tr: analysis.score.scores.tr.score,
    cc: analysis.score.scores.cc.score,
    lr: analysis.score.scores.lr.score,
    gra: analysis.score.scores.gra.score,
  };

  // Map criteria scores to assessment sections
  const taskResponseSection = {
    title: "Task Response",
    description: analysis.score.scores.tr.comment,
    items: Object.entries(analysis.score.scores.tr.subCriteria).map(([key, score]) => ({
      score,
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
    })),
  };

  const coherenceSection = {
    title: "Coherence & Cohesion",
    description: analysis.score.scores.cc.comment,
    items: Object.entries(analysis.score.scores.cc.subCriteria).map(([key, score]) => ({
      score,
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
    })),
  };

  const lexicalSection = {
    title: "Lexical Resource",
    description: analysis.score.scores.lr.comment,
    items: Object.entries(analysis.score.scores.lr.subCriteria).map(([key, score]) => ({
      score,
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
    })),
  };

  const grammarSection = {
    title: "Grammar",
    description: analysis.score.scores.gra.comment,
    items: Object.entries(analysis.score.scores.gra.subCriteria).map(([key, score]) => ({
      score,
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
    })),
  };

  // Map feedback to paragraphs
  const paragraphs = analysis.feedback.map((entry, index) => ({
    number: index + 1,
    original: entry.original,
    comments: [entry.comments.tr, entry.comments.cc, entry.comments.lr, entry.comments.gra].filter(
      (comment) => comment && comment.trim() !== "",
    ),
    revised: entry.rewrite,
  }));

  return (
    <article className="flex flex-col gap-5">
      <OverallScore score={overallScore} />
      <CriteriaGrid {...criteria} />
      <AssessmentSection {...taskResponseSection} />
      <AssessmentSection {...coherenceSection} />
      <AssessmentSection {...lexicalSection} />
      <AssessmentSection {...grammarSection} />
      <DetailedAssessment paragraphs={paragraphs} />
    </article>
  );
}

export function AppAside() {
  const { analysis } = useAnalysisStore();
  return (
    <Aside className="shadow-lg">
      <AsideHeader>
        <header className="flex items-center justify-between">
          <H2>AI Analysis</H2>
          <AsideTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <XIcon className="w-4 h-4" />
            </Button>
          </AsideTrigger>
        </header>
      </AsideHeader>
      <AsideContent>{!analysis ? <NoAnalysis /> : <AIAnalysis />}</AsideContent>
      {analysis && (
        <AsideFooter>
          <DownloadButton />
        </AsideFooter>
      )}
    </Aside>
  );
}
