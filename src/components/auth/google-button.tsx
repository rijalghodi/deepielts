"use client";

import { useMutation } from "@tanstack/react-query";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginByGoogle } from "@/lib/api/auth.api";
import { AUTH_CHANGED_KEY } from "@/lib/constants/brand";
import { useAuth } from "@/lib/contexts/auth-context";
import { clientAuth } from "@/lib/firebase/firebase-client";

import { Button, ButtonProps } from "@/components/ui/button";
import { IconGoogle } from "@/components/ui/icon-google";

type Props = ButtonProps & {
  onSuccess?: () => void;
};

export function GoogleButton(props: Props) {
  const router = useRouter();
  const { loadUser } = useAuth();
  const { isPending, mutateAsync: googleLoginMutate } = useMutation({
    mutationFn: async () => {
      const userCredential = await signInWithPopup(clientAuth, new GoogleAuthProvider());
      const idToken = await userCredential.user.getIdToken();
      await loginByGoogle(idToken);
      return idToken;
    },
    onError: (error) => {
      toast.error("Continue with Google failed", {
        description: error?.message,
      });
    },
    onSuccess: async (idToken) => {
      if (!idToken) return;
      await loadUser();
      localStorage.setItem(AUTH_CHANGED_KEY, Date.now().toString());
      router.refresh();
      props.onSuccess?.();
    },
  });

  return (
    <Button onClick={() => googleLoginMutate()} loading={isPending} {...props}>
      <IconGoogle /> Continue with Google
    </Button>
  );
}
