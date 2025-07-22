// In-memory storage for demo purposes (in production, use Redis or database)
export const emailCodes = new Map<string, { code: string; expiresAt: number }>();

export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeCode = (email: string, code: string, expiresInMinutes: number = 10) => {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  emailCodes.set(email, { code, expiresAt });
};

export const getCode = (email: string) => {
  return emailCodes.get(email);
};

export const removeCode = (email: string) => {
  emailCodes.delete(email);
};

export const isCodeValid = (email: string, code: string): boolean => {
  const storedCodeData = emailCodes.get(email);
  if (!storedCodeData) return false;

  if (Date.now() > storedCodeData.expiresAt) {
    emailCodes.delete(email);
    return false;
  }

  return storedCodeData.code === code;
};
