"use client";

import PerformanceSection from "@/components/features/dashboard/performance-section";

export default function DashboardPage() {
  return (
    <div className="relative mx-auto max-w-screen-lg px-5 pt-5 pb-10">
      <div className="flex flex-col gap-2 mb-5">
        <h2 className="text-2xl font-semibold">Your Progress</h2>
      </div>
      <PerformanceSection />
    </div>
  );
}
