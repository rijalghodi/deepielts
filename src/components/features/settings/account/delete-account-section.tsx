"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deleteUserAccount } from "@/lib/api/auth.api";
import { useAuth } from "@/lib/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SettingItem, SettingItemContent, SettingItemLabel } from "../settings-borad";

export function DeleteAccountSection() {
  const { user, logout } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const deleteAccountMutation = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      toast.success("Account deleted successfully");
      logout();
    },
    onError: () => {
      toast.error("Failed to delete account. Please try again.");
    },
  });

  const handleDeleteAccount = async () => {
    if (!user) return;
    deleteAccountMutation.mutate();
    setShowDeleteDialog(false);
    setDeleteConfirmation("");
  };

  if (!user) {
    return null;
  }

  return (
    <SettingItem className="p-5 border rounded-lg border-destructive/50">
      <SettingItemLabel className="text-destructive font-medium">Delete Account</SettingItemLabel>
      <SettingItemContent>
        <Dialog
          open={showDeleteDialog}
          onOpenChange={(open) => {
            setShowDeleteDialog(open);
            if (!open) setDeleteConfirmation("");
          }}
        >
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <div className="space-y-2 text-sm">
                This action cannot be undone. This will permanently delete your account and remove all your data
                including:
                <ul className="mt-2 space-y-1 text-sm list-disc pl-4">
                  <li>All your submissions and writing history</li>
                  <li>Your account profile and preferences</li>
                  <li>Any saved data and progress</li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="delete-confirmation" className="text-sm font-medium">
                  To confirm, type "delete my account" below:
                </Label>
                <Input
                  id="delete-confirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="delete my account"
                  className="text-sm"
                />
              </div>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteAccountMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isPending || deleteConfirmation !== "delete my account"}
              >
                {deleteAccountMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SettingItemContent>
    </SettingItem>
  );
}
