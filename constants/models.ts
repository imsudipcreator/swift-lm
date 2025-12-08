import { Model } from "@/types/model-types";

export const Models: Model[] = [
  {
    name: "DeepSeek-R1-Distill-Qwen-1.5B-GGUF",
    url: "https://huggingface.co/lmstudio-community/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q3_K_L.gguf",
    size: 0.913,
    params: 1.5,
  },
  {
    name: "Qwen2.5-0.5B-Instruct-GGUF",
    url: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q6_k.gguf",
    size: 0.65,
    params: 0.5,
  },
  {
    name: "SmolLM2-135M-Instruct-GGUF",
    url: "https://huggingface.co/bartowski/SmolLM2-135M-Instruct-GGUF/resolve/main/SmolLM2-135M-Instruct-f16.gguf",
    size: 0.271,
    params: 0.135,
  },
];
