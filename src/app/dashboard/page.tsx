"use client";

import HistorySection from "@/components/dashboard/history-section";
import PerformanceSection from "@/components/dashboard/performance-section";

export default function DashboardPage() {
  return (
    <div className="relative mx-auto max-w-screen-lg px-5 pt-5 pb-10 flex flex-col gap-12">
      <div className="mb-5" id="progress">
        <h2 className="text-2xl font-semibold mb-5">Your Progress</h2>
        <PerformanceSection />
      </div>
      <div className="" id="history min-h-[500px] h-full">
        <h2 className="text-2xl font-semibold mb-5">Your History</h2>
        <HistorySection />
      </div>
    </div>
  );
}
