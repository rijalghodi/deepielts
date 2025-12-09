"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GET_CURRENT_USER_QUERY_KEY } from "@/lib/api/auth.api";
import { updateUserSettings } from "@/lib/api/settings.api";
import { TARGET_BAND_SCORE } from "@/lib/constants/band-scores";
import { useAuth } from "@/lib/contexts/auth-context";

import { SettingItem, SettingItemContent, SettingItemLabel, SettingSelectableText } from "../settings-borad";

export function SettingPreferences() {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (updatedSettings) => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: GET_CURRENT_USER_QUERY_KEY });
      setUser({ ...user, settings: updatedSettings } as any);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update settings. Please try again.");
    },
  });

  const handleBandScoreChange = (value: string) => {
    updateSettingsMutation.mutate({ targetBandScore: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-semibold">Preferences</p>

      <SettingItem>
        <SettingItemLabel>Target Score</SettingItemLabel>
        <SettingItemContent>
          <SettingSelectableText
            options={TARGET_BAND_SCORE}
            value={user?.settings?.targetBandScore || ""}
            onChange={handleBandScoreChange}
            loading={updateSettingsMutation.isPending}
          />
        </SettingItemContent>
      </SettingItem>
      <SettingItem>
        <SettingItemLabel>App Theme</SettingItemLabel>
        <SettingItemContent>
          <ThemeToggle variant="dropdown" />
        </SettingItemContent>
      </SettingItem>
    </div>
  );
}
