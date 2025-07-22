import React from "react";

import { Button } from "@/components/ui/button";

import { AuthDialog } from "../auth/login/auth-dialog";

type Props = {};

export function HomeTemplate({}: Props) {
  return (
    <div>
      <h1>HomeTemplate</h1>
      <AuthDialog>
        <Button>Sign up</Button>
      </AuthDialog>
    </div>
  );
}
