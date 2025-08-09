import admin from "firebase-admin";

import { env } from "../env";

if (!admin.apps.length) {
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
const storage = admin.storage();

export { admin, auth, db, storage };
