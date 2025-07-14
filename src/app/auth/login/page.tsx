"use client";

import { Button } from "@/components/ui/button";
import { IconGoogle } from "@/components/ui/icon-google";
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

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      setLoading(true);
      await signIn?.create({
        identifier: data.email,
        password: data.password,
      });
      // TODO: Redirect to dashboard
      // router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement Google OAuth
      console.log("Google login");
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl">
        <AuthHeader title="Welcome back!" description="Please sign in to continue" />

        <div className="flex flex-col gap-6">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoaded}
          >
            <IconGoogle />
            Continue with Google
          </Button>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex-1 border-t" />
            <span className="text-sm">or</span>
            <div className="flex-1 border-t" />
          </div>

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

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button variant="default" size="lg" className="w-full" loading={loading} type="submit">
              Continue <ArrowRight />
            </Button>

            <div className="flex flex-col gap-2">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary hover:underline text-center"
              >
                Forgot password?
              </Link>

              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
