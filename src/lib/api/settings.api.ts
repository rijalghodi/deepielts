import { UserSettings } from "@/server/models/user";
import { ApiResponse } from "@/types/global";

import { apiPut } from "./utils";

export interface UpdateSettingsRequest {
  targetBandScore?: string;
  testDate?: string;
  language?: string;
}

/**
 * Update user settings
 */
export async function updateUserSettings(settings: UpdateSettingsRequest): Promise<UserSettings | undefined> {
  const response = await apiPut<ApiResponse<UserSettings>>({
    endpoint: "/users/settings",
    data: settings,
  });
  return response?.data;
}
