import { Check, ChevronDown, Loader2, Settings, User } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SettingAccount } from "./account/setting-account";
import { SettingPreferences } from "./preferences/setting-preferences";

export function SettingsBoard({ defaultTab = "account" }: { defaultTab?: "account" | "personalization" }) {
  const isMobile = useIsMobile();

  // return (
  //   <div className="flex flex-col gap-8">
  //     <SettingAccount />
  //     <SettingPreferences />
  //   </div>
  // );
  return (
    <Tabs defaultValue={defaultTab} orientation={isMobile ? "horizontal" : "vertical"}>
      <TabsList>
        <TabsTrigger value="account">
          <User className="w-4 h-4" />
          Account
        </TabsTrigger>
        <TabsTrigger value="personalization">
          <Settings className="w-4 h-4" />
          Preferences
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="h-[440px] overflow-auto">
        <SettingAccount />
      </TabsContent>
      <TabsContent value="personalization" className="h-[440px] overflow-auto">
        <SettingPreferences />
      </TabsContent>
    </Tabs>
  );
}

export function SettingItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex gap-1.5 justify-between items-center w-full", className)}>{children}</div>;
}

export function SettingItemLabel({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("text-sm flex-1 font-medium", className)}>
      {children}
    </label>
  );
}

export function SettingItemContent({ children }: { children: React.ReactNode }) {
  return <div className="text-right text-sm">{children}</div>;
}

export function SettingEditableText({
  className,
  onSave,
  value,
  loading,
}: {
  className?: string;
  onSave: (text: string) => void;
  value: string;
  loading?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  if (isEditing) {
    return (
      <Input
        value={text}
        autoFocus
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          console.log("onBlur", text, value);
          setIsEditing(false);
          if (text.trim() !== "" && text !== value) {
            onSave(text);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsEditing(false);
            if (text.trim() !== "" && text !== value) {
              onSave(text);
            }
          }
        }}
      />
    );
  }
  return (
    <button
      type="button"
      className={cn("text-sm font-normal flex items-center gap-2 hover:bg-muted rounded-md px-3 py-2", className)}
      onClick={() => setIsEditing(true)}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : value}
    </button>
  );
}

export function SettingSelectableText({
  options,
  value,
  onChange,
  loading,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex justify-end gap-2 text-sm font-normal">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            options.find((option) => option.value === value)?.label
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => onChange(option.value)}>
            {value === option.value ? <Check /> : ""} {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
