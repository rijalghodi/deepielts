// "use client";

// import { SignInButton, useSignIn } from "@clerk/nextjs";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";

// import { APP_NAME } from "@/lib/constants/brand";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { IconGoogle } from "@/components/ui/icon-google";
// import { IconLogo } from "@/components/ui/icon-logo";
// import { Input } from "@/components/ui/input";

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

// // @deprecated
// // This component is deprecated in favor of the SignInButton from Clerk
// // It is kept for reference and can be removed in the future
// export function LoginForm() {
//   const { isLoaded, signIn, setActive } = useSignIn();
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const form = useForm<z.infer<typeof loginSchema>>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof loginSchema>) => {
//     if (!isLoaded) return;

//     try {
//       setLoading(true);
//       const result = await signIn.create({
//         identifier: values.email,
//         password: values.password,
//       });

//       if (result.status === "complete") {
//         await setActive({ session: result.createdSessionId });
//         router.push("/");
//       } else {
//         console.log(result); // handle multifactor, etc.
//       }
//     } catch (err: any) {
//       toast.error(err.errors?.[0]?.message ?? "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="sm:p-6 w-full max-w-lg border-0 shadow-none rounded-xl">
//       <CardHeader className="text-center">
//         <Link href="/" className="flex items-center gap-y-1 gap-x-1 mx-auto mb-4">
//           <IconLogo size={20} />
//           <span className="font-semibold tracking-tight text-base">{APP_NAME}</span>
//         </Link>

//         <CardTitle className="text-2xl">Login to your account</CardTitle>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-4">
//         <SignInButton mode="redirect">
//           <Button variant="outline" size="lg" className="w-full">
//             <IconGoogle />
//             Continue with Google
//           </Button>
//         </SignInButton>

//         <div className="flex items-center gap-4 text-muted-foreground">
//           <div className="flex-1 border-t" />
//           <span className="text-sm">or</span>
//           <div className="flex-1 border-t" />
//         </div>

//         {/* Login by email */}

//         <form onSubmit={onSubmit && form.handleSubmit(onSubmit)} className="grid gap-4">
//           <Form {...form}>
//             <div className="flex flex-col gap-3">
//               <FormField
//                 name="email"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Your email" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 name="password"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Your password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </Form>
//           <div className="flex justify-end">
//             <Link href="/forgot-password" className="text-primary hover:underline text-sm">
//               Forgot password
//             </Link>
//           </div>
//           <Button type="submit" size="lg" className="w-full" disabled={loading}>
//             Login
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
