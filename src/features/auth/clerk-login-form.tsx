"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { APP_NAME } from "@/lib/constants/brand";

import { Button } from "@/components/ui/button";
import { IconGoogle } from "@/components/ui/icon-google";
import { IconLogo } from "@/components/ui/icon-logo";
import { Input } from "@/components/ui/input";

export function ClerkLoginForm() {
  return (
    <SignIn.Root>
      <SignIn.Step
        name="start"
        title="Sign in to your account"
        className="flex flex-col gap-8 p-6 w-full max-w-[440px] border-0 shadow-none rounded-xl"
      >
        <AuthHeader
          title="Welcome back!"
          description="Please sign in to continue"
        />
        <div className="flex flex-col gap-6">
          <Clerk.Connection name="google" asChild>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              type="button"
            >
              <IconGoogle />
              Continue with Google
            </Button>
          </Clerk.Connection>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex-1 border-t" />
            <span className="text-sm">or</span>
            <div className="flex-1 border-t" />
          </div>
          <div className="flex flex-col gap-4">
            <Clerk.Field name="identifier" className="flex flex-col gap-1">
              <Clerk.Label>Email</Clerk.Label>
              <Clerk.Input type="email" asChild>
                <Input placeholder="Your email" />
              </Clerk.Input>
              <Clerk.FieldError className="text-destructive text-sm" />
            </Clerk.Field>
            <Clerk.GlobalError className="text-destructive text-sm" />
            <SignIn.Action submit asChild>
              <Clerk.Loading>
                {(loading) => (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                    //   type="submit"
                  >
                    Continue <ArrowRight />
                  </Button>
                )}
              </Clerk.Loading>
            </SignIn.Action>

            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </SignIn.Step>
      <SignIn.Step
        name="verifications"
        className="flex flex-col gap-8 p-6 w-full max-w-[440px]"
      >
        <SignIn.Strategy name="email_code">
          <div className="flex flex-col gap-6">
            <AuthHeader
              title="Check your email"
              description={
                <>
                  We sent a code to <SignIn.SafeIdentifier />
                </>
              }
            />
            <Clerk.Field name="code" className="flex flex-col gap-1">
              <Clerk.Label>Email code</Clerk.Label>
              <Clerk.Input asChild>
                <Input placeholder="Enter code" />
              </Clerk.Input>
              <Clerk.FieldError className="text-destructive text-sm" />
            </Clerk.Field>
            <Clerk.GlobalError className="text-destructive text-sm" />
            <SignIn.Action submit asChild>
              <Clerk.Loading>
                {(loading) => (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                    type="submit"
                  >
                    Continue <ArrowRight />
                  </Button>
                )}
              </Clerk.Loading>
            </SignIn.Action>
          </div>
        </SignIn.Strategy>

        <SignIn.Strategy name="password">
          <div className="flex flex-col gap-6">
            <AuthHeader title="Enter your password" />
            <Clerk.Field name="password" className="flex flex-col gap-1">
              <Clerk.Label>Password</Clerk.Label>
              <Clerk.Input type="password" asChild>
                <Input placeholder="Your password" />
              </Clerk.Input>
              <Clerk.FieldError className="text-destructive text-sm" />
            </Clerk.Field>
            <SignIn.Action submit asChild>
              <Clerk.Loading>
                {(loading) => (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                  >
                    Continue <ArrowRight />
                  </Button>
                )}
              </Clerk.Loading>
            </SignIn.Action>
            <SignIn.Action
              navigate="forgot-password"
              className="hover:underline underline-offset-4"
            >
              Forgot password?
            </SignIn.Action>
          </div>
        </SignIn.Strategy>

        <SignIn.Strategy name="reset_password_email_code">
          <div className="flex flex-col gap-6">
            <AuthHeader
              title="Check your email"
              description={
                <>
                  We sent a code to <SignIn.SafeIdentifier />.
                </>
              }
            />

            <Clerk.Field name="code" className="flex flex-col gap-1">
              <Clerk.Label>Email code</Clerk.Label>
              <Clerk.Input asChild>
                <Input placeholder="Enter code" />
              </Clerk.Input>
              <Clerk.FieldError className="text-destructive text-sm" />
            </Clerk.Field>

            <Clerk.GlobalError className="text-destructive text-sm" />

            <SignIn.Action submit asChild>
              <Clerk.Loading>
                {(loading) => (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                  >
                    Continue <ArrowRight />
                  </Button>
                )}
              </Clerk.Loading>
            </SignIn.Action>
          </div>
        </SignIn.Strategy>
      </SignIn.Step>

      {/* Add reset password step */}
      <SignIn.Step
        name="forgot-password"
        className="flex flex-col gap-8 p-6 w-full max-w-[440px]"
      >
        <AuthHeader title="Forgot your password?" />
        <div className="flex flex-col gap-6">
          <SignIn.SupportedStrategy name="reset_password_email_code" asChild>
            <Button variant="default" size="lg" className="w-full">
              Reset password via email
            </Button>
          </SignIn.SupportedStrategy>

          <SignIn.Action navigate="previous" asChild>
            <Button variant="outline" size="lg" className="w-full">
              Go back
            </Button>
          </SignIn.Action>
        </div>
      </SignIn.Step>

      <SignIn.Step
        name="reset-password"
        className="flex flex-col gap-8 p-6 w-full max-w-[440px]"
      >
        <AuthHeader title="Reset your password" />
        <div className="flex flex-col gap-6">
          <Clerk.Field name="password" className="flex flex-col gap-1">
            <Clerk.Label>New password</Clerk.Label>
            <Clerk.Input type="password" asChild>
              <Input type="password" placeholder="Enter new password" />
            </Clerk.Input>
            <Clerk.FieldError className="text-destructive text-sm" />
          </Clerk.Field>
          <Clerk.Field name="confirmPassword" className="flex flex-col gap-1">
            <Clerk.Label>Confirm password</Clerk.Label>
            <Clerk.Input type="password" asChild>
              <Input type="password" placeholder="Enter new password" />
            </Clerk.Input>
            <Clerk.FieldError className="text-destructive text-sm" />
          </Clerk.Field>
          <SignIn.Action submit>Reset password</SignIn.Action>
        </div>
      </SignIn.Step>
    </SignIn.Root>
  );
}

export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description?: string | React.ReactNode;
}) {
  return (
    <div className="text-center flex flex-col gap-3 items-center">
      <Link
        href="/"
        className="flex md:hidden items-center gap-y-1 gap-x-1 mx-auto"
      >
        <IconLogo size={20} />
        <span className="font-semibold text-base">{APP_NAME}</span>
      </Link>
      <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-lg">{description}</p>
      )}
    </div>
  );
}
