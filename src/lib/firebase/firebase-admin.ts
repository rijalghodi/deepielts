import admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";

import { env } from "../env";

let db: Firestore;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }),
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
} else {
  db = admin.firestore();
}

const auth = admin.auth();
const storage = admin.storage();

export { auth, db, storage };
