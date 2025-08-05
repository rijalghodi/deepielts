import { create } from "zustand";

type Store = {
  analysis: string | null;
  setAnalysis: (analysis: string) => void;
  appendAnalysis: (chunk: string) => void;
  clearAnalysis: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  generating: boolean;
  setGenerating: (generating: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

export const useAIAnalysisStore = create<Store>()((set, get) => ({
  analysis: null,
  setAnalysis: (analysis) => set({ analysis }),
  appendAnalysis: (chunk) => {
    const currentAnalysis = get().analysis || "";
    set({ analysis: currentAnalysis + chunk });
  },
  clearAnalysis: () => set({ analysis: null, error: null }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  generating: false,
  setGenerating: (generating) => set({ generating }),
  error: null,
  setError: (error) => set({ error }),
}));
