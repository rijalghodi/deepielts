"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AUTH_ME_QUERY_KEY, updateUser } from "@/lib/api/auth.api";
import { useAuth } from "@/lib/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountFormData {
  name: string;
}

export function ChangeUserForm() {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<AccountFormData>({
    defaultValues: {
      name: user?.name || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user?.name) {
      reset({ name: user.name });
    }
  }, [user?.name, reset]);

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
      reset({ name: newUserData.name });
      queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, newUserData);
      if (user && newUserData) {
        setUser({ ...user, name: newUserData.name });
      }
    },
  });

  const onSubmit = (data: AccountFormData) => {
    if (!user) return;
    updateUserMutate({ name: data.name.trim() });
  };

  const handleReset = () => {
    reset({ name: user?.name || "" });
  };

  if (!user) {
    return <div>Please log in to view account settings.</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter your full name"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" value={user.email || ""} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">
            Email address cannot be changed. Contact support if you need to update it.
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isPending ? "Updating..." : "Update Profile"}
          </Button>

          {isDirty && (
            <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
              Reset
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
