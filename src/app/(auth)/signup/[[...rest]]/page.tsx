import type { Metadata } from "next";

import { ClerkSignUpForm } from "@/features/auth/archived/clerk-signup-form";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create an account",
};

export default function SignupPage() {
  return (
    <div className="p-6 min-h-screen flex flex-col gap-3">
      {/* <div className="flex justify-end">
            <Button variant="ghost" size="lg" asChild>
               <Link href="/login">Login</Link>
            </Button>
         </div> */}
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full">
        <ClerkSignUpForm />
      </div>
    </div>
  );
}
