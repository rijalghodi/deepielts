"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { verifyEmailCode } from "@/lib/api/auth.api";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const schema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type Props = {
  email: string;
  onSuccess?: () => void;
};

export function VerifyCodeForm({ email, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      toast.error("Verification failed", {
        description: error?.message || "Please check your code and try again",
      });
    },
    onSuccess: (_data) => {
      toast.success("Login successful!", {
        description: "Welcome back!",
      });
      router.push("/");
      onSuccess?.();
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setError(null);
    await verifyCodeMutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-3.5">
      <Form {...form}>
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} className="w-full" onChange={field.onChange} value={field.value}>
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
    </form>
  );
}
