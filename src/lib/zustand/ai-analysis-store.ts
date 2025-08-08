import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useAIAnalysisStore = create<Store>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "ai-analysis-store",
      partialize: (state) => ({
        analysis: state.analysis,
        // Only persist analysis; do not persist loading, generating, or error states
      }),
    },
  ),
);
