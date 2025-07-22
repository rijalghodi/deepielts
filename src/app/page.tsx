"use client";

import { Button } from "@/components/ui/button";

import { AuthDialog } from "@/features/auth/login/auth-dialog";

export default function Home() {
  return (
    <div>
      <AuthDialog type="signup">
        <Button>Sign up</Button>
      </AuthDialog>
    </div>
  );
}
