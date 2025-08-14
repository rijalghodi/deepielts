"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AUTH_ME_QUERY_KEY, updateUser } from "@/lib/api/auth.api";
import { useAuth } from "@/lib/contexts/auth-context";

import { SettingEditableText, SettingItem, SettingItemContent, SettingItemLabel } from "../settings-borad";

export function ChangeUserForm() {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: updateUserMutate, isPending } = useMutation({
    mutationFn: async (user: { name: string }) => {
      updateUser(user);
      return user;
    },

    onError: (error) => {
      toast.error("Failed to update profile", {
        description: error.message,
      });
    },
    onSuccess: (newUserData) => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, newUserData);
      if (user && newUserData) {
        setUser({ ...user, name: newUserData.name });
      }
    },
  });

  if (!user) {
    return <div>Please log in to view account settings.</div>;
  }

  return (
    <div className="space-y-4">
      <SettingItem className="space-y-2">
        <SettingItemLabel htmlFor="name">Full Name</SettingItemLabel>
        <SettingItemContent>
          <SettingEditableText
            onSave={(text) => {
              updateUserMutate({ name: text });
            }}
            value={user.name}
            loading={isPending}
          />
        </SettingItemContent>
      </SettingItem>

      <SettingItem className="space-y-2">
        <SettingItemLabel htmlFor="email">Email Address</SettingItemLabel>
        <SettingItemContent>{user.email}</SettingItemContent>
      </SettingItem>
    </div>
  );
}
