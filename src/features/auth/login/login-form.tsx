"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { sendEmailCode } from "@/lib/api/auth.api";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email(),
});

type Props = {
  onSuccess?: (email: string) => void;
};

export function LoginForm({ onSuccess }: Props) {
  const [_error, _setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const { isPending: _isPending, mutateAsync: sendCodeMutate } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { email } = values;
      return sendEmailCode(email);
    },
    onError: (error: any) => {
      toast.error("Failed to send code", {
        description: error?.message || "Please try again",
      });
    },
    onSuccess: (_data, variables) => {
      toast.success("Code sent!", {
        description: "Check your email for the verification code",
      });
      onSuccess?.(variables.email);
    },
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    await sendCodeMutate(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-3.5">
      <Form {...form}>
        <FormField
          name="email"
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

        {_error && <p className="text-destructive text-sm text-center">{_error}</p>}

        <Button variant="default" className="w-full" type="submit">
          Continue with Code
        </Button>
      </Form>
    </form>
  );
}
