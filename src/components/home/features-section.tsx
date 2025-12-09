import { BarChart, FileText, Mail, Sparkles, TrendingUp } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const features = [
  {
    title: "Task 1 Academic IELTS Scoring",
    badge: "Academic",
    description:
      "Upload or write your Academic Task 1 essay. Our AI explains your score, highlights strengths and weaknesses, and helps you describe diagrams like a Band 9 candidate.",
    video: "https://www.youtube.com/embed/dc4OBUMeMTs",
    details: [
      "Band score breakdown (Task Achievement, Coherence, Lexical Resource, Grammar)",
      "AI-generated sample answers and chart explanations",
      "Personalized tips for improvement",
    ],
    icon: BarChart,
  },
  {
    title: "Task 1 General IELTS Scoring",
    badge: "General",
    description:
      "Submit your General Training Task 1 letter. The AI will score your letter, check for tone and format, and suggest ways to make your writing more effective.",
    video: "https://www.youtube.com/embed/dihifQMlCDc",
    details: [
      "Checks for correct letter format and tone",
      "Band score with actionable feedback",
      "Highlights common mistakes",
    ],
    icon: Mail,
  },
  {
    title: "Task 2 Scoring",
    badge: "Essay",
    description:
      "Get your Task 2 essays scored instantly. The AI analyzes your argument, structure, vocabulary, and grammar, and gives you a Band score with detailed suggestions.",
    video: "https://www.youtube.com/embed/cKUkRfN2nPM",
    details: [
      "Band score for each criterion",
      "AI feedback on argument and structure",
      "See how to boost your score with real examples",
    ],
    icon: FileText,
  },
  {
    title: "Progress Tracking",
    badge: "Progress",
    description:
      "Review your progress over time. See how your scores have improved and identify areas for improvement.",
    video: "https://www.youtube.com/embed/Z0bjuKkUpb8",
    details: ["See how your scores have improved", "Identify areas for improvement", "Track your progress over time"],
    icon: TrendingUp,
  },
];

const demoVideo = "https://www.youtube.com/embed/dc4OBUMeMTs";

export function FeaturesSection() {
  return (
    <div className="flex flex-col gap-16">
      <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-6">
        <Badge variant="light" size="lg">
          <Sparkles className="h-3 w-3" />
          Introducing
        </Badge>
        <h2 className="section-title">
          {APP_NAME} <br /> A Free <span className="text-primary">IELTS Writing</span> Checker
        </h2>
        <p className="section-desc">{APP_DESCRIPTION}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Single Big Video at Bottom */}
      <div className="w-full">
        <div className="rounded-xl overflow-hidden border border-muted shadow-lg">
          <div className="aspect-video bg-muted">
            <iframe
              src={demoVideo}
              title="Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
