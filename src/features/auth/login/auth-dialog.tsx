"use client";

import React from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { LoginForm } from "./login-form";

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  type: "signup" | "login" | "forgot-password" | "reset-password" | "verify-email";
};

export function AuthDialog({ open, onOpenChange, children, type }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogTitle className="hidden">Sign in to your account</DialogTitle>
        <DialogDescription className="hidden">Enter your email below to sign in to your account</DialogDescription>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
