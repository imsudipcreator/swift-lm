import { ModelState } from "@/types/model-types";
import { create } from "zustand";

export const useModelStore = create<ModelState>((set) => ({
    model: "SmolLM2-135M-Instruct-GGUF",
    setModel: (model: string) => set({ model }),
    downloadingModel: null,
    setDownloadingModel: (model: string | null) => set({ downloadingModel: model }),
}))