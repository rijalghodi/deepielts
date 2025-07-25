import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const features = [
  {
    id: 0,
    title: "Unlimited Question Practice",
    badge: "Practice",
    description:
      "Practice as many IELTS questions as you want, across a wide variety of real exam topics. Get instant feedback and never run out of material.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    details: ["Covers all major IELTS writing topics", "No daily or monthly limits", "Practice anytime, anywhere"],
  },
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
];

export function FeaturesSection() {
  return (
    <section className="flex flex-col gap-16 py-10 max-w-screen-lg mx-auto w-full">
      <div className="text-center flex flex-col gap-4">
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Introducing</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">{APP_NAME}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{APP_DESCRIPTION}</p>
      </div>

      <div className="flex flex-col gap-20">
        {features.map((feature, idx) => (
          <div
            key={feature.id}
            className={`flex flex-col lg:flex-row gap-8 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Content Side */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold"
                >
                  {feature.badge}
                </Badge>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">{feature.title}</h3>
              <Separator className="w-16" />
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
    </section>
  );
}

export default FeaturesSection;
