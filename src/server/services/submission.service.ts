// using example from other file
// create a submission functionailtiy below:

// TODO: Create submission

import { Timestamp } from "firebase-admin/firestore";

import { HTTP_CODE } from "@/lib/constants";
import { db } from "@/lib/firebase/firebase-admin";

import { CreateSubmissionBody, GetSubmissionResult } from "@/server/dto/submission.dto";
import { QuestionType, Submission } from "@/server/models/submission";

import { AppError } from "@/types/global";

/**
 * Create a new submission under user subcollection: users/{userId}/submissions/{submissionId}
 */
export async function createSubmission(
  params: Omit<CreateSubmissionBody, "questionType"> & {
    questionType: QuestionType;
    userId: string;
    score?: Submission["score"];
    feedback?: string;
  },
): Promise<Submission> {
  try {
    const { userId, question, answer, attachment, questionType, score, feedback } = params;

    const submissionRef = db.collection("users").doc(userId).collection("submissions").doc();

    const newSubmission: Submission = {
      id: submissionRef.id,
      userId,
      question,
      answer,
      attachment,
      questionType,
      score,
      feedback,
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
 * Get submission by submission ID and user ID.
 */
export async function getSubmission(userId: string, submissionId: string): Promise<GetSubmissionResult | null> {
  try {
    const snapshot = await db.collection("users").doc(userId).collection("submissions").doc(submissionId).get();

    if (!snapshot.exists) {
      throw new AppError({ message: "Submission not found", code: HTTP_CODE.NOT_FOUND });
    }

    const doc = snapshot.data() as Submission;

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
 * List submissions for a user, with optional filtering by start date, end date, limit, and page.
 * If userId is provided, fetches from user's submissions subcollection.
 * Otherwise, fetches from the top-level "submissions" collection.
 */
type ListSubmissionsOptions = {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  page?: number;
};

export async function listSubmissions(options: ListSubmissionsOptions): Promise<GetSubmissionResult[]> {
  try {
    const { userId, startDate, endDate, limit = 10, page = 1 } = options;

    let query: any = db.collection("users").doc(userId).collection("submissions");

    if (startDate) {
      query = query.where("createdAt", ">=", Timestamp.fromDate(startDate));
    }
    if (endDate) {
      query = query.where("createdAt", "<=", Timestamp.fromDate(endDate));
    }

    // Pagination: Firestore paginates with cursors, but for simple offset-based pagination:
    const offset = (page - 1) * limit;
    query = query.orderBy("createdAt", "desc").offset(offset).limit(limit);

    const snapshot = await query.get();

    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      };
    }) as GetSubmissionResult[];
  } catch (error) {
    throw new AppError({ message: (error as any).message, code: HTTP_CODE.INTERNAL_SERVER_ERROR });
  }
}
