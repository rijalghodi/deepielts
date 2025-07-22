"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { requestEmailCode, verifyEmailCode } from "@/lib/api/auth.api";
import { AUTH_CHANGED_KEY } from "@/lib/constants/brand";
import { useAuth } from "@/lib/contexts/auth-context";
import { useResendCooldown } from "@/hooks";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";

const schema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type Props = {
  email: string;
  onSuccess?: () => void;
};

export function VerifyCodeForm({ email, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);

  const { loadUser } = useAuth();
  const { countdown, isActive, startCooldown, formatTime } = useResendCooldown(email);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });

  const { isPending, mutateAsync: verifyCodeMutate } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { code } = values;
      return verifyEmailCode(email, code);
    },
    onError: (error: any) => {
      setError(error?.message || "Please check your code and try again");
    },
    onSuccess: async (_data) => {
      await loadUser();
      localStorage.setItem(AUTH_CHANGED_KEY, Date.now().toString());
      toast.success("Login successful!");
      onSuccess?.();
    },
  });

  const { isPending: isResending, mutateAsync: resendCode } = useMutation({
    mutationFn: async () => {
      return requestEmailCode(email);
    },
    onError: (error: any) => {
      setError(error?.message || "Please try again");
    },
    onSuccess: () => {
      startCooldown();
      toast.success("Code resent successfully!");
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setError(null);
    await verifyCodeMutate(data);
  };

  const handleResend = () => {
    if (isActive) return;
    resendCode();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      <Form {...form}>
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter 6 digits code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-destructive text-sm text-center">{error}</p>}

        <Button variant="default" className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Verifying..." : "Verify Code"}
        </Button>
      </Form>

      <p className="text-xs text-muted-foreground text-center">
        Didn't receive the code?{" "}
        <button
          type="button"
          className={`p-0 font-medium ${
            isActive ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline"
          }`}
          onClick={handleResend}
          disabled={isActive || isResending}
        >
          {isActive ? `Resend in ${formatTime(countdown)}` : isResending ? "Sending..." : "Resend code"}
        </button>
      </p>
    </form>
  );
}
