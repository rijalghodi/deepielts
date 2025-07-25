import { Sparkles } from "lucide-react";
import React from "react";

import { APP_NAME } from "@/lib/constants";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Task 1 Academic IELTS Scoring",
    badge: "Academic",
    description:
      "Upload or write your Academic Task 1 essay. Our AI explains your score, highlights strengths and weaknesses, and even helps you describe charts, graphs, and diagrams like a Band 9 candidate.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    details: [
      "Band score breakdown (Task Achievement, Coherence, Lexical Resource, Grammar)",
      "AI-generated sample answers and chart explanations",
      "Personalized tips for improvement",
    ],
  },
  {
    title: "Task 1 General IELTS Scoring",
    badge: "General",
    description:
      "Submit your General Training Task 1 letter. The AI will score your letter, check for tone and format, and suggest ways to make your writing more effective.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    details: [
      "Checks for correct letter format and tone",
      "Band score with actionable feedback",
      "Highlights common mistakes",
    ],
  },
  {
    title: "Task 2 Scoring",
    badge: "Essay",
    description:
      "Get your Task 2 essays scored instantly. The AI analyzes your argument, structure, vocabulary, and grammar, and gives you a Band score with detailed suggestions.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    details: [
      "Band score for each criterion",
      "AI feedback on argument and structure",
      "See how to boost your score with real examples",
    ],
  },
  {
    title: "Unlimited Question Practice",
    badge: "Practice",
    description:
      "Practice as many IELTS questions as you want, across a wide variety of real exam topics. Get instant feedback and never run out of material.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    details: ["Covers all major IELTS writing topics", "No daily or monthly limits", "Practice anytime, anywhere"],
  },
];

export function FeaturesSection() {
  return (
    <div className="flex flex-col gap-16">
      <div className="text-center space-y-4">
        <Badge variant="light" size="lg">
          <Sparkles className="h-3 w-3" />
          Introducing
        </Badge>
        <h2 className="text-4xl md:text-5xl font-semibold leading-normal tracking-tight mb-8">
          {APP_NAME} <br /> A Free <span className="text-primary">IELTS Writing</span> Checker
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-muted-foreground">
          {APP_NAME} is a free IELTS Writing checker powered by AI, trained on over 10,000 real essays. It predicts your
          score and gives feedback similar to real examiners.
        </p>
      </div>

      <div className="flex flex-col gap-24">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`flex flex-col lg:flex-row gap-8 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Content Side */}
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold">{feature.title}</h3>
              <Separator className="w-16 bg-primary" />
              <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {feature.details.map((d, i) => (
                  <li key={i} className="text-base">
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Video Side */}
            <div className="flex-1 w-full">
              <div className="rounded-xl overflow-hidden border border-muted shadow-lg">
                <div className="aspect-video bg-muted">
                  <iframe
                    src={feature.video}
                    title={feature.title + " demo"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesSection;
