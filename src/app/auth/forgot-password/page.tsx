"use client";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);

    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      // Show success message
      setIsEmailSent(true);
    } catch (_err) {
      setError("Failed to send reset email");
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
          <AuthHeader title="Check your email" description={`We sent a password reset link to ${email}`} />

          <div className="flex flex-col gap-6">
            <p className="text-center text-muted-foreground">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>

            <div className="flex flex-col gap-2">
              <Button variant="default" size="lg" className="w-full" asChild>
                <Link href="/auth/login">Back to Login</Link>
              </Button>

              <Button variant="outline" size="lg" className="w-full" onClick={() => setIsEmailSent(false)}>
                Resend email
              </Button>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Button variant="link" className="px-0 font-normal" onClick={() => setIsEmailSent(false)}>
                try again
              </Button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
        <AuthHeader title="Forgot your password?" />

        <div className="flex flex-col gap-6">
          <p className="text-center text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button variant="default" size="lg" className="w-full" disabled={isLoaded} type="submit">
              {isLoaded ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </div>
              ) : (
                "Send reset link"
              )}
            </Button>

            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
