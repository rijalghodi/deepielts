import { db } from "@/lib/firebase";
import logger from "@/lib/logger";

export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeCode = async (email: string, code: string, expiresInMinutes: number = 10) => {
  try {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    await db.collection("verifyCodes").doc(email).set({
      email,
      code,
      expiredAt: expiresAt,
    });
  } catch (error) {
    logger.error(error, "storeCode");
    throw error;
  }
};

export const getCode = async (email: string) => {
  try {
    const doc = await db.collection("verifyCodes").doc(email).get();
    if (!doc.exists) return null;
    return doc.data();
  } catch (error) {
    logger.error(error, "getCode");
    throw error;
  }
};

export const removeCode = async (email: string) => {
  try {
    await db.collection("verifyCodes").doc(email).delete();
  } catch (error) {
    logger.error(error, "removeCode");
    throw error;
  }
};

export const isCodeValid = async (email: string, code: string): Promise<boolean> => {
  try {
    const doc = await db.collection("verifyCodes").doc(email).get();
    if (!doc.exists) return false;
    const data = doc.data();
    if (!data) return false;

    if (Date.now() > data.expiredAt) {
      await db.collection("verifyCodes").doc(email).delete();
      return false;
    }

    return data.code === code;
  } catch (error) {
    logger.error(error, "isCodeValid");
    throw error;
  }
};
