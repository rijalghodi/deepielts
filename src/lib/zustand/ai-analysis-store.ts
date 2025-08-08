import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  analysis: string | null;
  setAnalysis: (analysis: string) => void;
  appendAnalysis: (chunk: string) => void;
  clearAnalysis: () => void;
  generating: boolean;
  setGenerating: (generating: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  abortController: AbortController | null;
  setAbortController: (controller: AbortController | null) => void;
  stopGeneration: () => void;
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
      generating: false,
      setGenerating: (generating) => set({ generating }),
      error: null,
      setError: (error) => set({ error }),
      abortController: null,
      setAbortController: (controller) => set({ abortController: controller }),
      stopGeneration: () => {
        const { abortController, setGenerating, setError, setAbortController } = get();
        setGenerating(false);
        setError(null);
        if (abortController) {
          abortController.abort();
          setAbortController(null);
        }
      },
    }),
    {
      name: "ai-analysis-store",
      partialize: (state) => ({
        analysis: state.analysis,
        // Only persist analysis; do not persist generating, or error states
      }),
    },
  ),
);
