"use client";

import { useAuth } from "@/lib/contexts/auth-context";

import { ChangeUserForm } from "./change-user-form";
import { DeleteAccountSection } from "./delete-account-section";

export function SettingAccount() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view account settings.</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold">Account Settings</p>
      <ChangeUserForm />
      <DeleteAccountSection />
    </div>
  );
}
