"use client";

import React from "react";

import { Aside, AsideRail, AsideTrigger } from "@/components/ui/aside";

function AsideContent() {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <h2 className="text-2xl font-semibold text-foreground">Hello</h2>
    </div>
  );
}

export function AppAside() {
  return (
    <Aside>
      <AsideTrigger />
      <AsideContent />
      <AsideRail />
      <AsideContent />
    </Aside>
  );
}
