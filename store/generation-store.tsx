import { create } from "zustand";

type ConfigType = {
    name: string;
    temperature: number;
    customPrompt: string;
}

interface GenerationState {
    config: ConfigType;
    setConfig: (config: ConfigType) => void;
    setName: (name: string) => void;
    setTemperature: (temperature: number) => void;
    setCustomPrompt: (customPrompt: string) => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
    config: {
        name: "",
        temperature: 0.7,
        customPrompt: ""
    },
    setConfig: (config: ConfigType) => set({ config }),
    setName: (name: string) =>
        set((state) => ({
            config: { ...state.config, name },
        })),

    setTemperature: (temperature: number) =>
        set((state) => ({
            config: { ...state.config, temperature },
        })),

    setCustomPrompt: (customPrompt: string) =>
        set((state) => ({
            config: { ...state.config, customPrompt },
        })),
}));