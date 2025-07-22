"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useAdvanceNav() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushAdvanced = (path: string, newParams: Record<string, string | null | undefined> = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${path}?${params.toString()}`);
  };

  const addSearchParams = (newParams: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`);
  };

  const removeSearchParams = (keys: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    keys.forEach((key) => {
      params.delete(key);
    });
    router.push(`?${params.toString()}`);
  };

  return { addSearchParams, searchParams, router, pushAdvanced, removeSearchParams };
}
