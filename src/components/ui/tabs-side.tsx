"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TabsSide = React.forwardRef<React.ElementRef<typeof Tabs>, React.ComponentPropsWithoutRef<typeof Tabs>>(
  ({ className, ...props }, ref) => (
    <Tabs
      ref={ref}
      orientation="vertical"
      className={cn("flex flex-row items-start h-full w-full", className)}
      {...props}
    />
  ),
);
TabsSide.displayName = "TabsSide";

const TabsSideList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, ...props }, ref) => (
  <TabsList
    ref={ref}
    className={cn("flex-col justify-start items-start rounded-none bg-transparent p-0", className)}
    {...props}
  />
));
TabsSideList.displayName = "TabsSideList";

const TabsSideTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof TabsTrigger>
>(({ className, children, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={cn(
      "w-full relative py-3 pl-4 flex justify-start rounded-md hover:bg-muted data-[state=active]:text-foreground data-[state=active]:bg-muted data-[state=active]:shadow-none text-left whitespace-normal",
      "data-[state=active]:hover:bg-accent",
      className,
    )}
    {...props}
  >
    <span className="line-clamp-1">{children}</span>
  </TabsTrigger>
));
TabsSideTrigger.displayName = "TabsSideTrigger";

const TabsSideContent = React.forwardRef<
  React.ElementRef<typeof TabsContent>,
  React.ComponentPropsWithoutRef<typeof TabsContent>
>(({ className, ...props }, ref) => <TabsContent ref={ref} className={cn("grow", className)} {...props} />);
TabsSideContent.displayName = "TabsSideContent";

export { TabsSide, TabsSideContent, TabsSideList, TabsSideTrigger };
