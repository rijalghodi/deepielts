"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VerticalTabs = React.forwardRef<React.ElementRef<typeof Tabs>, React.ComponentPropsWithoutRef<typeof Tabs>>(
  ({ className, ...props }, ref) => (
    <Tabs ref={ref} orientation="vertical" className={cn("flex items-start gap-6 h-fit", className)} {...props} />
  ),
);
VerticalTabs.displayName = "VerticalTabs";

const VerticalTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, ...props }, ref) => (
  <TabsList
    ref={ref}
    className={cn(
      "flex-col h-full justify-start items-start border-l border-border rounded-none bg-transparent p-0",
      className,
    )}
    {...props}
  />
));
VerticalTabsList.displayName = "VerticalTabsList";

const VerticalTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof TabsTrigger>
>(({ className, children, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={cn(
      "relative py-3 pl-4 flex justify-start rounded-none after:absolute after:top-1/2 after:-translate-y-1/2 after:start-0 after:w-1 after:h-6 hover:bg-transparent data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-foreground text-left whitespace-normal",
      className,
    )}
    {...props}
  >
    <span className="line-clamp-1">{children}</span>
  </TabsTrigger>
));
VerticalTabsTrigger.displayName = "VerticalTabsTrigger";

const VerticalTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsContent>,
  React.ComponentPropsWithoutRef<typeof TabsContent>
>(({ className, ...props }, ref) => <TabsContent ref={ref} className={cn("grow", className)} {...props} />);
VerticalTabsContent.displayName = "VerticalTabsContent";

export { VerticalTabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger };
