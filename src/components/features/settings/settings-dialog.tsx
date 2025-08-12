"use client";

import { create } from "zustand";

import { Dialog, DialogContent } from "@/components/ui/dialog";

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
      <DialogContent className="sm:max-w-3xl px-0">
        <SettingsBoard />
      </DialogContent>
    </Dialog>
  );
}
