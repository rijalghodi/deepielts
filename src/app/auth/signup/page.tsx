"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { IconGoogle } from "@/components/ui/icon-google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useAuth } from "@/lib/contexts/auth-context";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  //   const { signup, verifyEmail, isLoading } = useAuth();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"start" | "verification" | "complete">("start");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);

    try {
      const signUpAttempt = await signUp?.create({
        emailAddress: data.email,
        password: data.password,
      });

      if (signUpAttempt?.status === "complete") {
        await setActive?.({ session: signUpAttempt?.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
      // Move to verification step
      setStep("verification");
    } catch (err) {
      setError("Failed to create account");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // TODO: Implement Google OAuth
      console.log("Google signup");
    } catch (err) {
      setError("Google signup failed");
    }
  };

  const handleVerification = async (formData: FormData) => {
    setError(null);

    try {
      const code = formData.get("code") as string;
      await signUp?.attemptEmailAddressVerification({
        code,
      });
      // Move to complete step
      setStep("complete");
    } catch (err) {
      setError("Invalid verification code");
    }
  };

  const handleResendCode = async () => {
    try {
      // TODO: Resend verification code
      console.log("Resending code");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError("Failed to resend code");
    }
  };

  if (step === "verification") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
          <AuthHeader title="Verify your email" description="We sent a code to your email" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleVerification(formData);
            }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="code">Email code</Label>
              <Input id="code" name="code" placeholder="Enter code" required />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="flex flex-col gap-2">
              <Button variant="default" size="lg" className="w-full" disabled={isLoaded} type="submit">
                {isLoaded ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Verifying...
                  </div>
                ) : (
                  "Verify"
                )}
              </Button>

              <Button variant="outline" size="lg" className="w-full" type="button" onClick={() => setStep("start")}>
                Go back
              </Button>
            </div>

            <p className="text-sm text-center">
              Didn&apos;t receive a code?{" "}
              <Button variant="link" className="px-0 font-normal" onClick={handleResendCode} disabled={isLoaded}>
                Resend
              </Button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
          <AuthHeader title="Account created successfully!" description="Welcome to IELTS Writing AI" />

          <div className="flex flex-col gap-6">
            <p className="text-center text-muted-foreground">
              Your account has been created and verified. You can now start using the platform.
            </p>

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
        <AuthHeader title="Create an account" />

        <div className="flex flex-col gap-6">
          <Button variant="outline" size="lg" className="w-full" onClick={handleGoogleSignup}>
            <IconGoogle />
            Continue with Google
          </Button>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex-1 border-t" />
            <span className="text-sm">or</span>
            <div className="flex-1 border-t" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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

            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button variant="default" size="lg" className="w-full" type="submit">
              Continue <ArrowRight />
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
