"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "@/components/auth/auth-header";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSignIn } from "@clerk/nextjs";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.password,
        password: data.password,
      });
      if (result?.status === "complete") {
        // Show success message
        setIsSuccess(true);
      } else {
        setError("Failed to reset password");
      }
    } catch (err) {
      setError("Failed to reset password");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
          <AuthHeader title="Password reset successfully!" description="Your password has been updated" />

          <div className="flex flex-col gap-6">
            <p className="text-center text-muted-foreground">You can now sign in with your new password.</p>

            <Button variant="default" size="lg" className="w-full" asChild>
              <Link href="/auth/login">
                Sign in <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
        <AuthHeader title="Reset your password" />

        <div className="flex flex-col gap-6">
          <p className="text-center text-muted-foreground">Enter your new password below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button variant="default" size="lg" className="w-full" disabled={isLoaded} type="submit">
              {isLoaded ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Resetting password...
                </div>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
