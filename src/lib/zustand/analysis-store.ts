import { create } from "zustand";

import { IELTSAnalysis } from "@/server/models/submission";

type Store = {
  analysis: IELTSAnalysis | null;
  setAnalysis: (analysis: IELTSAnalysis | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  generating: boolean;
  setGenerating: (generating: boolean) => void;
};

export const useAnalysisStore = create<Store>()((set) => ({
  analysis: null,
  setAnalysis: (analysis) => set({ analysis }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  generating: false,
  setGenerating: (generating) => set({ generating }),
}));

// const emptyIELTSAnalysis: IELTSAnalysis = {
//   feedback: [],
//   score: {
//     totalScore: 0,
//     scores: {
//       taskResponse: {
//         score: 0,
//         comment:
//           "Evaluate how well you address the task, follow the required format, and use relevant data and examples in your writing. ",
//         subCriteria: {
//           relevanceToPrompt: 0,
//           taskCompletion: 0,
//           argumentDevelopment: 0,
//         },
//       },
//       coherenceCohesion: {
//         score: 0,
//         comment:
//           "Check the logical flow of your ideas, how well your paragraphs are organized, and your use of linking words and cohesive devices.",
//         subCriteria: {
//           logicalFlow: 0,
//           paragraphStructure: 0,
//           cohesiveDevices: 0,
//         },
//       },
//       lexicalResource: {
//         score: 0,
//         comment:
//           "Assess the variety of sentence structures, grammatical accuracy, and correct punctuation in your writing.",
//         subCriteria: {
//           vocabularyRange: 0,
//           wordChoice: 0,
//           collocation: 0,
//         },
//       },
//       grammar: {
//         score: 0,
//         comment: "Evaluate the range and accuracy of the vocabulary you use in the context of your essay. ",
//         subCriteria: {
//           grammaticalAccuracy: 0,
//           sentenceStructure: 0,
//           punctuation: 0,
//         },
//       },
//     },
//   },
// };
