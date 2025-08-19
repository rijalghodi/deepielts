import { auth, db } from "@/lib/firebase";

import { Role, User } from "../models";

import { StringifyTimestamp } from "@/types";

/**
 * Get a user by email from Firestore. Returns { id, ...data } or null if not found.
 */
export async function getUserByEmail(email: string): Promise<StringifyTimestamp<User> | null> {
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

export async function createUserWithEmail(email: string): Promise<StringifyTimestamp<User>> {
  const userRecord = await auth.createUser({
    email,
    emailVerified: true,
  });
  const uid = userRecord.uid;

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

export async function getUserById(id: string): Promise<StringifyTimestamp<User> | null> {
  const userDoc = await db.collection("users").doc(id).get();
  if (!userDoc.exists) return null;
  const userData = userDoc.data();
  if (!userData) return null;
  return {
    id: userDoc.id,
    ...userData,
    createdAt: userData.createdAt?.toDate().toISOString(),
    updatedAt: userData.updatedAt?.toDate().toISOString(),
  };
}

export async function getUserByCustomerId(customerId: string): Promise<StringifyTimestamp<User> | null> {
  const userQuery = await db.collection("users").where("customerId", "==", customerId).limit(1).get();
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

export async function updateUser(userId: string, user: Partial<User>): Promise<void> {
  try {
    await db
      .collection("users")
      .doc(userId)
      .update({
        ...user,
        updatedAt: new Date(),
      });
    console.log(`Successfully updated name for user: ${userId}`);
  } catch (error) {
    console.error(`Error updating name for user ${userId}:`, error);
    throw new Error(`Failed to update name: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function deleteUserAccount(userId: string): Promise<void> {
  try {
    await auth.deleteUser(userId);
    await db.collection("users").doc(userId).delete();

    // Delete all user submissions
    const submissionsQuery = await db.collection("submissions").where("userId", "==", userId).get();
    const submissionDeletions = submissionsQuery.docs.map((doc) => doc.ref.delete());
    await Promise.all(submissionDeletions);

    // Delete all user performance records
    const performanceQuery = await db.collection("performance").where("userId", "==", userId).get();
    const performanceDeletions = performanceQuery.docs.map((doc) => doc.ref.delete());
    await Promise.all(performanceDeletions);

    // Delete all user sessions
    const sessionsQuery = await db.collection("sessions").where("userId", "==", userId).get();
    const sessionDeletions = sessionsQuery.docs.map((doc) => doc.ref.delete());
    await Promise.all(sessionDeletions);

    console.log(`Successfully deleted account and all data for user: ${userId}`);
  } catch (error) {
    console.error(`Error deleting account for user ${userId}:`, error);
    throw new Error(`Failed to delete account: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
