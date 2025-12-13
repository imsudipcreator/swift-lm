import { Model, ModelState } from "@/types/model-types";
import { create } from "zustand";

export const useModelStore = create<ModelState>((set) => ({
    selectedModel: null,
    setSelectedModel: (model: Model) => set({ selectedModel: model }),
    downloadingModel: null,
    setDownloadingModel: (model: Model | null) => set({ downloadingModel: model }),
    downloadedModels: [],
    setDownloadedModels: (models: Model[]) =>
        set((state) => ({
            downloadedModels: [...state.downloadedModels, ...models],
        }))
}))