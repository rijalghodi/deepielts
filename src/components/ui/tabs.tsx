"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

type TabsOrientation = "vertical" | "horizontal";

interface TabsContextValue {
  orientation: TabsOrientation;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
}

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & { orientation?: TabsOrientation }) {
  return (
    <TabsContext.Provider value={{ orientation }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-4", orientation === "vertical" && "flex-row gap-4", className)}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { orientation } = useTabsContext();

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-accent inline-flex h-10 w-fit items-center justify-center rounded-sm p-[3px]",
        orientation === "vertical" && "flex-col gap-1.5 justify-start items-start rounded-none bg-transparent p-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { orientation } = useTabsContext();

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xs border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        orientation === "vertical" &&
          "w-full relative py-3 px-3 flex justify-start rounded-md text-foreground hover:bg-muted data-[state=active]:text-foreground data-[state=active]:bg-accent data-[state=active]:shadow-none text-left whitespace-normal data-[state=active]:hover:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger, useTabsContext };
