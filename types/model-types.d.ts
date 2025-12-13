import { IconSvgElement } from "@hugeicons/react-native";

export interface ModelState {
  selectedModel: Model | null;
  setSelectedModel: (model: Model) => void;
  downloadingModel: Model | null;
  setDownloadingModel: (model: Model | null) => void;
  downloadedModels: Model[];
  setDownloadedModels: (models: Model[]) => void;
}

export type Model = {
  name: string;
  url: string;
  attributes: {
    name: string;
    value: string;
    icon: IconSvgElement;
  }[];
};
