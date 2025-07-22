"use client";

import { useMutation } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { auth, googleProvider } from "@/lib/firebase/firebase";

import { Button, ButtonProps } from "@/components/ui/button";
import { IconGoogle } from "@/components/ui/icon-google";

import { createSession } from "@/services/firebase/session-service";

type Props = ButtonProps;

export function GoogleButton(props: Props) {
  const router = useRouter();

  const { isPending, mutateAsync: googleLoginMutate } = useMutation({
    mutationFn: async () => {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);
      return idToken;
    },
    onError: (error) => {
      toast.error("Continue with Google failed", {
        description: error?.message,
      });
    },
    onSuccess: async (idToken) => {
      if (!idToken) return;
      router.push("/");
    },
  });

  return (
    <Button variant="default" onClick={() => googleLoginMutate()} loading={isPending} {...props}>
      <IconGoogle size={16} className="w-4 h-4 mr-2" /> Continue with Google
    </Button>
  );
}
