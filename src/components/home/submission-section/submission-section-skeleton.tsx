import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export function SubmissionSectionSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-40" />
      <Skeleton className="w-full h-10" />
    </div>
  );
}
