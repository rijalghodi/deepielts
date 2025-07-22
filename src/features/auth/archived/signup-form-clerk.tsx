"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IconGoogle } from "@/components/ui/icon-google";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";

const signupSchema = z
  .object({
    email_address: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email_address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);

    try {
      const signUpAttempt = await signUp?.create({
        emailAddress: data.email_address,
        password: data.password,
      });

      console.log("signUpAttempt", signUpAttempt);

      if (signUpAttempt?.status === "complete") {
        await setActive?.({ session: signUpAttempt.createdSessionId });
        router.push("/");
        return;
      }

      // 👉 Handle captcha or email verification redirect
      if (signUpAttempt?.status === "missing_requirements") {
        console.log("signUpAttempt", signUpAttempt);
        // const { externalVerificationRedirectURL } = signUpAttempt;
        // if (externalVerificationRedirectURL) {
        //   window.location.href = externalVerificationRedirectURL;
        //   return;
        // }
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error("Error:", JSON.stringify(err, null, 2));

      const errors = err.errors;

      console.log("errors", errors);

      const emailError = errors.find((error: any) => error.meta.paramName === "email")?.longMessage;
      form.setError("email_address", { message: emailError || "something went wrong" });
      const passwordError = errors.find((error: any) => error.meta.paramName === "password")?.longMessage;
      form.setError("password", { message: passwordError || "something went wrong", type: "manual" });
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

  return (
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <Form {...form}>
            <FormField
              name="email_address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword placeholder="Your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <InputPassword placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CAPTCHA Widget */}
            <div id="clerk-captcha" />

            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            <Button variant="default" size="lg" className="w-full" type="submit">
              Continue <ArrowRight />
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </Form>
        </form>
      </div>
    </div>
  );
}
