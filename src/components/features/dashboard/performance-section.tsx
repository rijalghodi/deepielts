"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { performanceGet, performanceGetKey } from "@/lib/api/performance.api";
import { cn } from "@/lib/utils";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { State } from "@/components/ui/states";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { GetPerformanceResult } from "@/server/dto/performance.dto";
import { QuestionType } from "@/server/models";

type Props = {
  className?: string;
  questionType?: string;
};

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-primary">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

function ScoresCard({
  label,
  OVR,
  TR,
  CC,
  LR,
  GRA,
  date,
}: {
  label: string;
  OVR: number;
  TR: number;
  CC: number;
  LR: number;
  GRA: number;
  date: string | null;
}) {
  const scoreItem = (abbr: string, value: number) => (
    <div className="flex items-center gap-1.5">
      <span className="text-sm text-muted-foreground">{abbr}</span>
      <span className="text-sm font-semibold tabular-nums">{Number.isFinite(value) ? value.toFixed(1) : "0.0"}</span>
    </div>
  );

  return (
    <Card className="flex flex-col gap-3">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-primary">
          {Number.isFinite(OVR) ? OVR.toFixed(1) : "0.0"}
        </CardTitle>
        {date && (
          <CardAction className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex-col items-start gap-1.5 text-sm">
        <div className="flex justify-between w-full flex-wrap gap-2">
          {scoreItem("TR", TR)}
          {scoreItem("CC", CC)}
          {scoreItem("LR", LR)}
          {scoreItem("GRA", GRA)}
        </div>
      </CardContent>
    </Card>
  );
}

const chartConfig: ChartConfig = {
  OVR: { label: "Overall", color: "var(--color-chart-1)" },
  TR: { label: "TR", color: "var(--color-chart-2)" },
  CC: { label: "CC", color: "var(--color-chart-3)" },
  LR: { label: "LR", color: "var(--color-chart-4)" },
  GRA: { label: "GRA", color: "var(--color-chart-5)" },
};

const stateClasses: Record<string, string> = {
  OVR: "data-[state=on]:bg-chart-1/5 data-[state=on]:text-chart-1 data-[state=on]:border-chart-1/50 data-[state=on]:hover:bg-chart-1/20",
  TR: "data-[state=on]:bg-chart-2/5 data-[state=on]:text-chart-2 data-[state=on]:border-chart-2/50 data-[state=on]:hover:bg-chart-2/20",
  CC: "data-[state=on]:bg-chart-3/5 data-[state=on]:text-chart-3 data-[state=on]:border-chart-3/50 data-[state=on]:hover:bg-chart-3/20",
  LR: "data-[state=on]:bg-chart-4/5 data-[state=on]:text-chart-4 data-[state=on]:border-chart-4/50 data-[state=on]:hover:bg-chart-4/20",
  GRA: "data-[state=on]:bg-chart-5/5 data-[state=on]:text-chart-5 data-[state=on]:border-chart-5/50 data-[state=on]:hover:bg-chart-5/20",
};

function ScoreTrend({ data }: { data: GetPerformanceResult["scoreTimeline"] }) {
  const [criteria, setCriteria] = useState<string[]>(["OVR"]);

  const [timeRange, setTimeRange] = useState("1h");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Trend</CardTitle>
        <div className="flex flex-row justify-between mt-2 gap-4 flex-wrap">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1h" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="all" className="rounded-lg">
                All time
              </SelectItem>
            </SelectContent>
          </Select>
          <ToggleGroup
            type="multiple"
            value={criteria}
            onValueChange={setCriteria}
            variant="pill"
            size="sm"
            className="*:data-[slot=toggle-group-item]:!px-3"
          >
            {Object.entries(chartConfig).map(([key, value]) => (
              <ToggleGroupItem key={key} value={key} className={stateClasses[key] || ""}>
                {value.label || key}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {criteria.includes("OVR") && (
              <Line dataKey="OVR" type="monotone" stroke="var(--color-chart-1)" strokeWidth={1.5} dot={false} />
            )}
            {criteria.includes("TR") && (
              <Line dataKey="TR" type="monotone" stroke="var(--color-chart-2)" strokeWidth={1.5} dot={false} />
            )}
            {criteria.includes("CC") && (
              <Line dataKey="CC" type="monotone" stroke="var(--color-chart-3)" strokeWidth={1.5} dot={false} />
            )}
            {criteria.includes("LR") && (
              <Line dataKey="LR" type="monotone" stroke="var(--color-chart-4)" strokeWidth={1.5} dot={false} />
            )}
            {criteria.includes("GRA") && (
              <Line dataKey="GRA" type="monotone" stroke="var(--color-chart-5)" strokeWidth={1.5} dot={false} />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function PerformanceSectionContent({ questionType }: { questionType: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: performanceGetKey(questionType ? { questionType: questionType as any } : undefined),
    queryFn: () => performanceGet(questionType ? { questionType: questionType as any } : undefined),
  });

  const perf = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  if (isError) {
    return <State title="Failed to load your progress" icon="error" />;
  }

  if (!perf) {
    return <State title="No progress data" icon="empty" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <ScoresCard label="Latest Scores" {...perf.lastScore} />
        <ScoresCard label="Highest Scores" {...perf.highestScore} />
        <StatBox label="Total Submissions" value={perf.count ?? 0} />
      </div>
      <ScoreTrend data={perf.scoreTimeline} />
    </div>
  );
}

export default function PerformanceSection({ className }: Props) {
  const [questionType, setQuestionType] = useState<string>(QuestionType.TASK_2);
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Tabs defaultValue={questionType} onValueChange={setQuestionType}>
        <TabsList>
          <TabsTrigger value={QuestionType.TASK_2}>Task 2</TabsTrigger>
          <TabsTrigger value={QuestionType.TASK_1_ACADEMIC}>Task 1 (Academic)</TabsTrigger>
          <TabsTrigger value={QuestionType.TASK_1_GENERAL}>Task 1 (General)</TabsTrigger>
        </TabsList>
      </Tabs>

      <PerformanceSectionContent questionType={questionType} />
    </div>
  );
}
