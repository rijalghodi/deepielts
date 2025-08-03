import { create } from "zustand";

import { IELTSAnalysis } from "@/server/models/submission";

type Store = {
  analysis: IELTSAnalysis | null;
  setAnalysis: (analysis: IELTSAnalysis) => void;
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
