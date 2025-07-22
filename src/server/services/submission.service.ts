// using example from other file
// create a submission functionailtiy below:

// TODO: Create submission

import { Timestamp } from "firebase-admin/firestore";

import { HTTP_CODE } from "@/lib/constants";
import { db } from "@/lib/firebase/firebase-admin";

import { CreateSubmissionBody, GetSubmissionResult } from "@/server/dto/submission.dto";
import { Submission } from "@/server/models/submission";

import { AppError } from "@/types/global";

/**
 * Create a new submission.
 */
export async function createSubmission(
  data: CreateSubmissionBody,
  userId: string,
  practiceId: string,
): Promise<Submission> {
  try {
    const submissionRef = db.collection("submissions").doc();

    const newSubmission: Submission = {
      ...data,
      id: submissionRef.id,
      userId,
      practiceId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await submissionRef.set(newSubmission);
    return newSubmission;
  } catch (error) {
    throw new AppError({ message: (error as any).message, code: HTTP_CODE.INTERNAL_SERVER_ERROR });
  }
}

/**
 * Get submission by user ID and practice ID.
 */
export async function getSubmission(submissionId: string): Promise<GetSubmissionResult | null> {
  try {
    const snapshot = await db.collection("submissions").doc(submissionId).get();

    if (!snapshot.exists) {
      throw new AppError({ message: "Submission not found", code: HTTP_CODE.NOT_FOUND });
    }

    const doc = snapshot.data() as Submission;

    // Get practice
    if (doc.practiceId) {
      const practice = await db.collection("practices").doc(doc.practiceId).get();
      if (!practice.exists) {
        throw new AppError({ message: "Practice not found", code: HTTP_CODE.NOT_FOUND });
      }

      return {
        ...doc,
        createdAt: doc.createdAt?.toDate().toISOString(),
        updatedAt: doc.updatedAt?.toDate().toISOString(),
      };
    }

    return {
      ...doc,
      createdAt: doc.createdAt?.toDate().toISOString(),
      updatedAt: doc.updatedAt?.toDate().toISOString(),
    };
  } catch (error) {
    throw new AppError({ message: (error as any).message, code: HTTP_CODE.INTERNAL_SERVER_ERROR });
  }
}

/**
 * List all submissions. Filter by practice ID and user ID.
 */
export async function listSubmissions(practiceId?: string, userId?: string): Promise<GetSubmissionResult[]> {
  try {
    let query: any = db.collection("submissions");

    if (practiceId) {
      query = query.where("practiceId", "==", practiceId);
    }

    if (userId) {
      query = query.where("userId", "==", userId);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
      updatedAt: doc.data().updatedAt.toDate().toISOString(),
    })) as GetSubmissionResult[];
  } catch (error) {
    throw new AppError({ message: (error as any).message, code: HTTP_CODE.INTERNAL_SERVER_ERROR });
  }
}
