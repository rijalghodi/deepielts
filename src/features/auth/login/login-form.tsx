"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { requestEmailCode } from "@/lib/api/auth.api";
import { writeCooldown } from "@/hooks/use-resend-cooldown";

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
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const { isPending, mutateAsync: requuestCode } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { email } = values;
      return requestEmailCode(email);
    },
    onError: (error: any) => {
      setError(error?.message || "Failed to send code");
    },
    onSuccess: async (_data, variables) => {
      writeCooldown(variables.email);
      onSuccess?.(variables.email);
    },
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    setError(null);
    await requuestCode(values);
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

        {error && <p className="text-destructive text-sm text-center">{error}</p>}

        <Button
          variant="default"
          className="w-full"
          type="submit"
          disabled={!form.formState.isDirty}
          loading={isPending}
        >
          Continue with Code
        </Button>
      </Form>
    </form>
  );
}
