"use client";

import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { GoogleButton } from "./google-button";
import { LoginForm } from "./login-form";
import { VerifyCodeForm } from "./verify-code-form";

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

export function AuthDialog({ open: openProp, onOpenChange, children }: Props) {
  const [email, setEmail] = useState<string>("");

  const open = openProp;
  const [step, setStep] = useState<"login" | "code">("code");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onOpenChange?.(false);
    } else {
      setStep("login");
      onOpenChange?.(true);
    }
  };

  function LoginSection() {
    return (
      <>
        <DialogHeader className="">
          <DialogTitle> Welcome to {APP_NAME}</DialogTitle>
          <DialogDescription>Please log in to continue</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <GoogleButton variant="accent" />

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex-1 border-t" />
            <span className="text-sm">or</span>
            <div className="flex-1 border-t" />
          </div>

          <LoginForm
            onSuccess={(email) => {
              setEmail(email);
              setStep("code");
            }}
          />
        </div>
      </>
    );
  }

  function VerifyCodeSection() {
    return (
      <>
        <DialogHeader className="text-center">
          <DialogTitle>Check your email</DialogTitle>
          <DialogDescription>
            We send a verification code to <span className="font-medium text-foreground">{email}</span>. Bear in mind
            that the code is valid for 5 minutes
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-stretch">
          <VerifyCodeForm email={email} />

          <div className="flex justify-center">
            <button
              onClick={() => {
                setStep("login");
              }}
              className="text-muted-foreground text-xs flex items-center gap-2 hover:underline underline-offset-4"
            >
              <ArrowLeft className="size-3" /> Back to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <div className={cn("hidden", step === "login" && "block")}>
          <LoginSection />
        </div>
        <div className={cn("hidden", step === "code" && "block")}>
          <VerifyCodeSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}
