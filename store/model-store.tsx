import { ModelState } from "@/types/model-types";
import { create } from "zustand";

export const useModelStore = create<ModelState>((set) => ({
    model: null,
    setModel: (model: string) => set({ model })
}))