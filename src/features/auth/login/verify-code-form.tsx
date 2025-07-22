"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { APP_NAME } from "@/lib/constants/brand";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { GoogleButton } from "./google-button";

const v = z.object({
  code: z.string().min(6),
});

export function VerifyCodeForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof v>>({
    resolver: zodResolver(v),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof v>) => {
    setError(null);
    console.log(data);
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

        <Button variant="default" className="w-full" type="submit">
          Continue with Code
        </Button>
      </Form>
    </form>
  );
}
