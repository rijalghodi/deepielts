import type { Metadata } from "next";

import { ClerkLoginForm } from "@/features/auth/archived/clerk-login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="p-6 min-h-screen flex flex-col gap-3">
      {/* <div className="flex justify-end">
            <Button variant="ghost" size="lg" asChild>
               <Link href="/signup">Signup</Link>
            </Button>
         </div> */}
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full">
        <ClerkLoginForm />
      </div>
    </div>
  );
}
