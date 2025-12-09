"use client";

import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { create } from "zustand";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { GoogleButton } from "./google-button";
import { LoginForm } from "./login-form";
import { VerifyCodeForm } from "./verify-code-form";

type State = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useAuthDialog = create<State>((set) => ({
  open: false,
  onOpenChange: (open) => set({ open }),
}));

export function AuthDialog() {
  const { open, onOpenChange } = useAuthDialog();
  const [email, setEmail] = useState<string>("");

  const [step, setStep] = useState<"login" | "code">("login");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onOpenChange?.(false);
      setStep("login");
    } else {
      onOpenChange?.(true);
    }
  };

  function LoginSection() {
    return (
      <>
        <DialogHeader>
          <DialogTitle> Welcome to {APP_NAME}</DialogTitle>
          <DialogDescription>Please log in to continue</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <GoogleButton
            variant="accent"
            onSuccess={() => {
              onOpenChange?.(false);
              setStep("login");
            }}
          />

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
        <div className="flex flex-col gap-4 items-stretch mt-6">
          <VerifyCodeForm email={email} />

          <div className="flex justify-center">
            <button
              onClick={() => {
                setStep("login");
              }}
              className="text-sm flex items-center gap-2 hover:underline underline-offset-4"
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
