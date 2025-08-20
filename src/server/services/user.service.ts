import { auth, db } from "@/lib/firebase";
import logger from "@/lib/logger";

import { getSubscriptionByUserId } from "./subscription.repo";
import { Role, User } from "../models";
import { Subscription } from "../models/subscription";

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

export async function getUserById(
  id: string,
): Promise<StringifyTimestamp<User & { subscription: Subscription | null }> | null> {
  const userDoc = await db.collection("users").doc(id).get();
  if (!userDoc.exists) return null;
  const userData = userDoc.data();
  if (!userData) return null;

  const subscription = await getSubscriptionByUserId(userDoc.id);

  return {
    id: userDoc.id,
    ...userData,
    subscription,
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
  } catch (error: any) {
    logger.error(error, `Failed to update name for user: ${userId}`);
    throw error;
  }
}

export async function deleteUserAccount(userId: string): Promise<void> {
  try {
    await auth.deleteUser(userId);
    await db.collection("users").doc(userId).set(
      {
        email: null,
        name: null,
        updatedAt: new Date(),
      },
      { merge: true },
    );

    // Delete all user submissions
    // const submissionsQuery = await db.collection("submissions").where("userId", "==", userId).get();
    // const submissionDeletions = submissionsQuery.docs.map((doc) => doc.ref.delete());
    // await Promise.all(submissionDeletions);

    // // Delete all user performance records
    // const performanceQuery = await db.collection("performance").where("userId", "==", userId).get();
    // const performanceDeletions = performanceQuery.docs.map((doc) => doc.ref.delete());
    // await Promise.all(performanceDeletions);

    // // Delete all user sessions
    // const sessionsQuery = await db.collection("sessions").where("userId", "==", userId).get();
    // const sessionDeletions = sessionsQuery.docs.map((doc) => doc.ref.delete());
    // await Promise.all(sessionDeletions);

    // // Delete all user subscriptions
    // const subscriptionQuery = await db.collection("subscriptions").where("userId", "==", userId).get();
    // const subscriptionDeletions = subscriptionQuery.docs.map((doc) => doc.ref.delete());
    // await Promise.all(subscriptionDeletions);
  } catch (error: any) {
    logger.error(error, `Failed to delete user account: ${userId}`);
    throw error;
  }
}
