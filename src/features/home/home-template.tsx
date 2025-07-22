"use client";

import React from "react";

import { logout } from "@/lib/api/auth.api";
import { useAuth } from "@/lib/contexts/auth-context";

import { Button } from "@/components/ui/button";

import { AuthDialog } from "../auth/login/auth-dialog";

export function HomeTemplate() {
  const { user, loading, loadUser } = useAuth();

  return (
    <div>
      <h1>HomeTemplate</h1>
      {loading ? <p>Loading...</p> : user?.email}

      {user ? (
        <Button
          onClick={async () => {
            await logout();
            await loadUser();
          }}
        >
          Sign out
        </Button>
      ) : (
        <AuthDialog>
          <Button>Sign up</Button>
        </AuthDialog>
      )}
    </div>
  );
}
