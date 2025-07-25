import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

import { env } from "../env";

dotenv.config(); // Ensure env is loaded

if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_ADMIN_PATH;

  if (!serviceAccountPath) {
    throw new Error("FIREBASE_ADMIN_PATH not set in .env");
  }

  const fullPath = path.resolve(serviceAccountPath);
  const serviceAccount = JSON.parse(readFileSync(fullPath, "utf8")) as admin.ServiceAccount;

  admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    credential: admin.credential.cert({
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }),
  });
}

const auth = admin.auth();
const db = admin.firestore();

export { admin, auth, db };
