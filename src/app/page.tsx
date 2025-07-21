"use client";


import { Button } from "@/components/ui/button";

import { AuthDialog } from "@/features/auth/auth-dialog";

export default function Home() {
  return (
    <div>
      <AuthDialog type="signup">
        <Button>Sign up</Button>
      </AuthDialog>
    </div>
  );
}
