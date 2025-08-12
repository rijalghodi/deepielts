"use client";

import { create } from "zustand";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import { SettingsBoard } from "./settings-borad";

type State = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useSettingsDialog = create<State>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export function SettingsDialog() {
  const { isOpen, close } = useSettingsDialog();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogTitle className="sr-only">Settings</DialogTitle>
      <DialogDescription className="sr-only">Manage your account settings and preferences.</DialogDescription>

      <DialogContent className="sm:max-w-3xl px-0">
        <SettingsBoard />
      </DialogContent>
    </Dialog>
  );
}
