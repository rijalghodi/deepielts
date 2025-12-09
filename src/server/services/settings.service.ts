import { Timestamp } from "firebase-admin/firestore";

import { db } from "@/lib/firebase/firebase-admin";
import { AppError } from "@/types/global";

import { DEFAULT_SETTINGS, User, UserSettings } from "../models";

/**
 * Update specific setting fields
 */
export async function updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
  try {
    const userRef = db!.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new AppError({ message: "User not found", code: 404 });
    }

    const userData = userDoc.data() as User;
    const currentSettings = userData.settings || DEFAULT_SETTINGS;

    await userRef.update({
      settings: {
        ...currentSettings,
        ...updates,
      },
      updatedAt: Timestamp.now(),
    });

    return {
      ...currentSettings,
      ...updates,
    };
  } catch (error) {
    throw new AppError({
      message: error instanceof Error ? error.message : "Unknown error",
      code: 500,
    });
  }
}

/**
 * Delete user settings
 */
export async function deleteUserSettings(userId: string): Promise<void> {
  try {
    const userRef = db!.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new AppError({ message: "User not found", code: 404 });
    }

    await userRef.update({
      settings: DEFAULT_SETTINGS,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw new AppError({
      message: error instanceof Error ? error.message : "Unknown error",
      code: 500,
    });
  }
}
