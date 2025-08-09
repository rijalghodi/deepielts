import fs from "fs";
import Mustache from "mustache";
import path from "path";

export function getPrompt(templateName: string, props?: Record<string, any>) {
  const filePath = path.join(process.cwd(), "src", "lib", "prompts", `${templateName}.md`);
  const template = fs.readFileSync(filePath, "utf-8");
  return Mustache.render(template, props);
}

export function getScorePrompt(props: { taskType: string; question: string; answer: string; attachment?: string }) {
  return getPrompt("score", props);
}

export function getScoreParsePrompt(props: { score: string }) {
  return getPrompt("score-parse", props);
}

export function getDetailFeedbackPrompt(props: {
  taskType: string;
  question: string;
  answer: string;
  attachment?: string;
}) {
  return getPrompt("detail-feedback", props);
}

export function getModelEssayPrompt(props: {
  taskType: string;
  question: string;
  answer: string;
  attachment?: string;
}) {
  return getPrompt("model-essay", props);
}

export function getChartDataPrompt() {
  return getPrompt("chart-data");
}
