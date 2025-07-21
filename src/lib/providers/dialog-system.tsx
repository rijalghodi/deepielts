"use client";

import React, { createContext, ReactNode,useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DialogSystemProps = {
   message: string | React.ReactNode;
   title: string;
   confirmText?: string;
   confirmColor?: "primary" | "destructive";
};

type DialogSystemContextType = {
   open: (props: DialogSystemProps) => Promise<boolean>;
   close: () => void;
};

const DialogSystemContext = createContext<DialogSystemContextType | undefined>(undefined);

export const useDialogSystem = () => {
   const ctx = useContext(DialogSystemContext);
   if (!ctx) throw new Error("useDialogSystem must be used within DialogSystemProvider");
   return ctx;
};

export const DialogSystemProvider = ({ children }: { children: ReactNode }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [dialogProps, setDialogProps] = useState<DialogSystemProps>({
      message: "",
      title: "",
      confirmText: "Confirm",
      confirmColor: "primary",
   });
   const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>();

   const open = (props: DialogSystemProps): Promise<boolean> => {
      setDialogProps({
         message: props.message,
         title: props.title,
         confirmText: props.confirmText ?? "OK",
         confirmColor: props.confirmColor ?? "primary",
      });
      setIsOpen(true);
      return new Promise<boolean>((resolve) => setResolvePromise(() => resolve));
   };

   const close = () => {
      resolvePromise?.(true);
      setIsOpen(false);
   };

   return (
      <DialogSystemContext.Provider value={{ open, close }}>
         {children}
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>{dialogProps.title}</DialogTitle>
               </DialogHeader>
               <div>
                  <p className="text-sm text-muted-foreground">{dialogProps.message}</p>
               </div>
               <DialogFooter>
                  <Button onClick={close} color={dialogProps.confirmColor}>
                     {dialogProps.confirmText}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </DialogSystemContext.Provider>
   );
};
