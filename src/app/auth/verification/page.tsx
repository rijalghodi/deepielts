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
import { useSignUp } from "@clerk/nextjs";
// import { useAuth } from "@/lib/contexts/auth-context";

const verificationSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function VerificationPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const onSubmit = async (data: VerificationFormData) => {
    setError(null);

    try {
      await signUp?.attemptEmailAddressVerification({
        code: data.code,
      });
      // Show success message
      setIsSuccess(true);
    } catch (err) {
      setError("Invalid verification code");
    }
  };

  const handleResendCode = async () => {
    setError(null);

    try {
      // TODO: Resend verification code
      console.log("Resending verification code");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError("Failed to resend code");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
          <AuthHeader title="Email verified successfully!" description="Your account has been verified" />

          <div className="flex flex-col gap-6">
            <p className="text-center text-muted-foreground">You can now access all features of the platform.</p>

            <Button variant="default" size="lg" className="w-full" asChild>
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/auth/login">Sign in to existing account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
        <AuthHeader title="Verify your email" description="We sent a verification code to your email" />

        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                placeholder="Enter verification code"
                {...register("code")}
                className={errors.code ? "border-destructive" : ""}
              />
              {errors.code && <p className="text-destructive text-sm">{errors.code.message}</p>}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button variant="default" size="lg" className="w-full" disabled={isLoaded} type="submit">
              {isLoaded ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Verifying...
                </div>
              ) : (
                "Verify email"
              )}
            </Button>
          </form>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-center text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              {resendCooldown > 0 ? (
                <span className="text-muted-foreground">Resend after {resendCooldown}s</span>
              ) : (
                <Button variant="link" className="px-0 font-normal" onClick={handleResendCode} disabled={isLoaded}>
                  Resend
                </Button>
              )}
            </p>

            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
