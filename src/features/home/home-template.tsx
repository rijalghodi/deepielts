import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { AuthDialog } from "../auth/login/auth-dialog";
import { Button } from "@/components/ui/button";
import { useAdvanceNav } from "@/hooks";

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
