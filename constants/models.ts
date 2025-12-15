import { Model } from "@/types/model-types";
import { AiChipIcon, File01Icon } from "@hugeicons/core-free-icons";

export const Models: Model[] = [
  {
    name: "Deepseek R1",
    url: "https://huggingface.co/lmstudio-community/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q3_K_L.gguf",
    attributes: [
      {
        name: "Size",
        value: "0.91 GB",
        icon: File01Icon,
      },
      {
        name: "Parameters",
        value: "1.5 B",
        icon: AiChipIcon,
      },
    ],
  },
  {
    name: "Qwen 2.5",
    url: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q6_k.gguf",
    attributes: [
      {
        name: "Size",
        value: "650 MB",
        icon: File01Icon,
      },
      {
        name: "Parameters",
        value: "0.5 B",
        icon: AiChipIcon,
      },
    ],
  },
  {
    name: "Qwen 3",
    url: "https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-UD-Q8_K_XL.gguf",
    attributes: [
      {
        name: "Size",
        value: "844 MB",
        icon: File01Icon,
      },
      {
        name: "Parameters",
        value: "0.6 B",
        icon: AiChipIcon,
      },
    ],
  },
  {
    name: "SmolLM 2",
    url: "https://huggingface.co/bartowski/SmolLM2-135M-Instruct-GGUF/resolve/main/SmolLM2-135M-Instruct-f16.gguf",
    attributes: [
      {
        name: "Size",
        value: "270 MB",
        icon: File01Icon,
      },
      {
        name: "Parameters",
        value: "135 M",
        icon: AiChipIcon,
      },
    ],
  },
  {
    name: "Gemma 3",
    url: "https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/main/gemma-3-270m-it-UD-Q8_K_XL.gguf",
    attributes: [
      {
        name: "Size",
        value: "471 MB",
        icon: File01Icon,
      },
      {
        name: "Parameters",
        value: "270 M",
        icon: AiChipIcon,
      },
    ]
  }
];
