"use client";

import { CreditCard } from "lucide-react";
import { create } from "zustand";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";

type State = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const usePaymentDialog = create<State>((set) => ({
  open: false,
  onOpenChange: (open) => set({ open }),
}));

export function PaymentDialog() {
  const { open, onOpenChange } = usePaymentDialog();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* <DialogHeader></DialogHeader> */}
        <DialogTitle className="flex flex-col items-center gap-4">
          <CreditCard className="h-5 w-5 text-primary" />
          Pro Plan Coming Soon
        </DialogTitle>

        <div className="flex flex-col space-y-4">
          <div className="space-y-3">
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 space-y-2 text-sm">
              <p>Our Pro plan is currently under development.</p>
              <p>While we work on it, you can:</p>
              <ul className="list-disc list-inside">
                <li>Practice with our free features</li>
                <li>Come back later (we&apos;re almost there!)</li>
                <li>Get excited for what&apos;s coming!</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-center sm:justify-center gap-2">
          <Button variant="outline" onClick={close}>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
