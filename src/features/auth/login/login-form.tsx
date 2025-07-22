"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { APP_NAME } from "@/lib/constants/brand";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { GoogleButton } from "./google-button";

const registerSchema = z.object({
  email: z.string().email(),
});

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setError(null);
  };

  return (
    <Card className="p-0 md:p-4 max-w-lg w-full border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Hey, let's get you started</CardTitle>
        <CardDescription className="text-center">👋 Welcome to {APP_NAME}, please log in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <GoogleButton size="lg" />

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex-1 border-t" />
            <span className="text-sm">or</span>
            <div className="flex-1 border-t" />
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
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

              <Button variant="default" size="lg" className="w-full" type="submit">
                Continue with Code
              </Button>
            </Form>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
