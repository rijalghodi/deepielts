"use client";
import { Button } from "@/components/ui/button";
import { IconGoogle } from "@/components/ui/icon-google";
import { Input } from "@/components/ui/input";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AuthHeader } from "./clerk-login-form";

export function ClerkSignUpForm() {
  return (
    <SignUp.Root>
      <SignUp.Step
        name="start"
        title="Create your account"
        className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl"
      >
        <AuthHeader title="Create an account" />
        <div className="flex flex-col gap-6">
          <Clerk.Connection name="google" asChild>
            <Button variant="outline" size="lg" className="w-full">
              <IconGoogle />
              Continue with Google
            </Button>
          </Clerk.Connection>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex-1 border-t" />
            <span className="text-sm">or</span>
            <div className="flex-1 border-t" />
          </div>
          <div className="flex flex-col gap-3">
            <Clerk.Field name="emailAddress" className="flex flex-col gap-1">
              <Clerk.Label>Email</Clerk.Label>
              <Clerk.Input type="email" asChild>
                <Input placeholder="Your email" />
              </Clerk.Input>
              <Clerk.FieldError className="text-destructive text-sm" />
            </Clerk.Field>

            <Clerk.Field name="password" className="flex flex-col gap-1">
              <Clerk.Label>Password</Clerk.Label>
              <Clerk.Input type="password" asChild>
                <Input placeholder="Your password" />
              </Clerk.Input>
              <Clerk.FieldError className="text-destructive text-sm" />
            </Clerk.Field>

            <Clerk.GlobalError className="text-sm text-destructive" />
            <SignUp.Captcha />
            <SignUp.Action submit asChild>
              <Clerk.Loading>
                {(loading) => (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    loading={loading}
                  >
                    Continue <ArrowRight />
                  </Button>
                )}
              </Clerk.Loading>
            </SignUp.Action>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </SignUp.Step>

      <SignUp.Step
        name="verifications"
        className="flex flex-col gap-8 p-6 w-full max-w-[440px]"
      >
        <SignUp.Strategy name="email_code">
          <div className="flex flex-col gap-6">
            <AuthHeader
              title="Verify your email"
              description={<>We sent a code to your email</>}
            />
            <Clerk.Field name="code" className="flex flex-col gap-1">
              <Clerk.Label>Email code</Clerk.Label>
              <Clerk.Input asChild>
                <Input placeholder="Enter code" />
              </Clerk.Input>
              <Clerk.FieldError className="text-destructive text-sm" />
            </Clerk.Field>
            <Clerk.GlobalError className="text-sm text-destructive" />

            <div className="flex flex-col gap-2">
              <SignUp.Action submit asChild>
                <Clerk.Loading>
                  {(loading) => (
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                      loading={loading}
                    >
                      Verify
                    </Button>
                  )}
                </Clerk.Loading>
              </SignUp.Action>
              <SignUp.Action navigate="start" asChild>
                <Button variant="outline" size="lg" className="w-full">
                  Go back
                </Button>
              </SignUp.Action>
            </div>
            <p className="text-sm text-center">
              Didn&apos;t receive a code?{" "}
              <SignUp.Action
                resend
                fallback={({ resendableAfter }) => (
                  <span>
                    Resend after (
                    <span className="tabular-nums">{resendableAfter}</span>)
                  </span>
                )}
                asChild
              >
                <Button variant="link" className="px-0 font-normal">
                  Resend
                </Button>
              </SignUp.Action>
            </p>
          </div>
        </SignUp.Strategy>
      </SignUp.Step>

      <SignUp.Step
        name="continue"
        className="flex flex-col gap-8 p-6 w-full max-w-[440px]"
      >
        <AuthHeader
          title="Complete your profile"
          description="Tell us a bit more about yourself"
        />
        <div className="flex flex-col gap-6">
          <Clerk.Field name="username" className="flex flex-col gap-1">
            <Clerk.Label>Username</Clerk.Label>
            <Clerk.Input type="text" asChild>
              <Input placeholder="Your username" />
            </Clerk.Input>
            <Clerk.FieldError className="text-destructive text-sm" />
          </Clerk.Field>
          <Clerk.GlobalError className="text-sm text-destructive" />
          <SignUp.Action submit asChild>
            <Clerk.Loading>
              {(loading) => (
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                  loading={loading}
                >
                  Complete sign up <ArrowRight />
                </Button>
              )}
            </Clerk.Loading>
          </SignUp.Action>
        </div>
      </SignUp.Step>
    </SignUp.Root>
  );
}
