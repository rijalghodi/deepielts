import { Query, Timestamp } from "firebase-admin/firestore";

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
 * List user submissions with filtering, sorting, pagination and total count.
 */
export async function listUserSubmissions(params: {
  userId: string;
  page: number;
  limit: number;
  questionType?: QuestionType;
  sortBy: "createdAt" | "analysis.score";
  sortDir: "asc" | "desc";
  withCount?: boolean;
}): Promise<{ submissions: GetSubmissionResult[]; totalCount: number }> {
  try {
    const { userId, page, limit, questionType, sortBy, sortDir, withCount = true } = params;

    const offset = (page - 1) * limit;

    // Build the query
    const submissionsRef = db.collection("users").doc(userId).collection("submissions");
    let query: Query = submissionsRef as unknown as Query;

    if (questionType) {
      query = (query as any).where("questionType", "==", questionType);
    }

    if (sortBy === "analysis.score") {
      query = (query as any).orderBy("analysis.score.totalScore", sortDir);
    } else {
      query = (query as any).orderBy("createdAt", sortDir);
    }

    query = (query as any).offset(offset).limit(limit);

    const submissionsSnapshot = await (query as any).get();

    let totalCount = 0;
    if (withCount) {
      const countQuery = db
        .collection("users")
        .doc(userId)
        .collection("submissions")
        .select("id", "question", "answer", "score", "questionType");
      const countSnapshot = questionType
        ? await countQuery.where("questionType", "==", questionType).get()
        : await countQuery.get();
      totalCount = countSnapshot.size;
    }

    const submissions = submissionsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      } as GetSubmissionResult;
    });

    return { submissions, totalCount };
  } catch (error) {
    throw new AppError({ message: (error as any).message, code: HTTP_CODE.INTERNAL_SERVER_ERROR });
  }
}
