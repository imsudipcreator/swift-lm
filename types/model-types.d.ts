import { IconSvgElement } from "@hugeicons/react-native";

export interface ModelState {
  model: string | null;
  setModel: (model: string) => void;
  downloadingModel: string | null;
  setDownloadingModel: (model: string) => void;
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
