import { admin, db } from "@/lib/firebase";

import { Role, User } from "../models";

/**
 * Get a user by email from Firestore. Returns { id, ...data } or null if not found.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const userQuery = await db.collection("users").where("email", "==", email).limit(1).get();
  if (userQuery.empty) return null;
  const userDoc = userQuery.docs[0];
  const userData = userDoc.data();
  return {
    id: userDoc.id,
    ...userData,
    createdAt: userDoc.createTime?.toDate().toISOString(),
    updatedAt: userDoc.updateTime?.toDate().toISOString(),
  };
}

/**
 * Create a new user in Firebase Auth and Firestore, returns { id, ...data }.
 */
export async function createUserWithEmail(email: string): Promise<User> {
  // Create user in Firebase Auth
  const userRecord = await admin.auth().createUser({
    email,
    emailVerified: true,
  });
  const uid = userRecord.uid;
  // Create user document in Firestore
  const newUser = {
    email,
    name: email.split("@")[0], // Use email prefix as default name
    role: "user",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.collection("users").doc(uid).set(newUser);
  return {
    id: uid,
    ...newUser,
    role: newUser.role as Role,
    createdAt: newUser.createdAt.toISOString(),
    updatedAt: newUser.updatedAt.toISOString(),
  };
}

/**
 * Get a user by Firestore document ID. Returns { id, ...data } or null if not found.
 */
export async function getUserById(id: string): Promise<User | null> {
  const userDoc = await db.collection("users").doc(id).get();
  if (!userDoc.exists) return null;
  const userData = userDoc.data();
  if (!userData) return null;
  return {
    id: userDoc.id,
    ...userData,
    createdAt: userData.createdAt?.toISOString?.() || userData.createdAt,
    updatedAt: userData.updatedAt?.toISOString?.() || userData.updatedAt,
  };
}
