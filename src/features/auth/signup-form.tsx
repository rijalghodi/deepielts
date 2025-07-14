"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IconGoogle } from "@/components/ui/icon-google";
import { IconLogo } from "@/components/ui/icon-logo";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(8),
});

// @deprecated
export function SignupForm() {
   const { isLoaded, signUp } = useSignUp();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (values: z.infer<typeof loginSchema>) => {
      if (!isLoaded) return;

      try {
         setLoading(true);
         // Create the sign-up
         await signUp.create({
            emailAddress: values.email,
            password: values.password,
         });

         await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

         // You can redirect to a verification page here
         router.push("/verify-email");
      } catch (err: any) {
         setError(err.errors?.[0]?.message || "Sign up failed");
         console.error(err.errors || err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Card className="sm:p-6 w-full max-w-lg border-0 shadow-none rounded-xl">
         <CardHeader className="text-center">
            <Link href="/" className="flex items-center gap-y-1 gap-x-1 mx-auto mb-4">
               <IconLogo size={20} />
               <span className="font-semibold tracking-tight text-base">{APP_NAME}</span>
            </Link>
            <CardTitle className="text-2xl">Create an account</CardTitle>
         </CardHeader>

         <CardContent className="flex flex-col gap-4">
            <Button asChild variant="outline" size="lg" className="w-full">
               <Link href="/sign-up">
                  <IconGoogle />
                  Continue with Google
               </Link>
            </Button>

            <div className="flex items-center gap-4 text-muted-foreground">
               <div className="flex-1 border-t" />
               <span className="text-sm">or</span>
               <div className="flex-1 border-t" />
            </div>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
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
                     <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                 <Input type="password" placeholder="Your password" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <p className="text-destructive text-sm">{error}</p>
                  <Button type="submit" size="lg" disabled={loading} className="w-full">
                     Sign Up
                  </Button>
                  <div id="clerk-captcha" className="mt-2 w-full" />
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
