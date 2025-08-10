import { Query } from "firebase-admin/firestore";

import { HTTP_CODE } from "@/lib/constants";
import { db } from "@/lib/firebase/firebase-admin";

import { QuestionType } from "@/server/models/submission";

import { GetPerformanceResult, PerformanceScore } from "../dto/performance.dto";

import { AppError } from "@/types/global";

export async function getPerformance({
  userId,
  questionType,
}: {
  userId: string;
  questionType?: QuestionType;
}): Promise<GetPerformanceResult> {
  try {
    const submissionsRef = db.collection("users").doc(userId).collection("submissions");

    let query = submissionsRef as Query;

    if (questionType) {
      query = query.where("questionType", "==", questionType);
    }

    // Ascending so newest per day will overwrite
    query = query.select("createdAt", "score", "questionType").orderBy("createdAt", "asc");

    const snapshot = await query.get();

    const zeroScore: PerformanceScore = {
      date: null,
      OVR: 0,
      TR: 0,
      CC: 0,
      LR: 0,
      GRA: 0,
    };

    let highest = { ...zeroScore };
    const mapByDate = new Map<string, PerformanceScore>();

    snapshot.forEach((doc) => {
      const { score, createdAt } = doc.data() as any;
      if (!score || !createdAt) return;

      const dateObj = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      const date = new Date(
        Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()),
      ).toISOString();

      const entry: PerformanceScore = {
        date,
        OVR: +score.OVR || 0,
        TR: +score.TR || 0,
        CC: +score.CC || 0,
        LR: +score.LR || 0,
        GRA: +score.GRA || 0,
      };

      // Overwrite ensures latest score in the day stays
      mapByDate.set(date, entry);

      highest = entry.OVR > highest.OVR ? entry : highest;
    });

    const scoreTimeline = Array.from(mapByDate.values());

    return {
      count: snapshot.size,
      lastScore: scoreTimeline.at(-1) || zeroScore,
      highestScore: highest,
      scoreTimeline, // already in chronological order
    };
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      code: HTTP_CODE.INTERNAL_SERVER_ERROR,
    });
  }
}
