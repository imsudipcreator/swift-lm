import { Directory, File, Paths } from "expo-file-system";
import {
  initLlama,
  LlamaContext,
  RNLlamaOAICompatibleMessage,
  TokenData,
} from "llama.rn";

const DOWNLOAD_URL =
  "https://huggingface.co/lmstudio-community/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q3_K_L.gguf";
const MODEL_FILENAME = "llama-model.gguf";
const MODEL_DIR = Paths.document.uri + "models/";
const MODEL_PATH = MODEL_DIR + MODEL_FILENAME;

class LlamaService {
  private context: LlamaContext | null = null;

  private async downloadModel() {
    try {
      const modelDir = new Directory(MODEL_DIR);
      if (!modelDir.exists) {
        modelDir.create();
      }

      const file = new File(MODEL_PATH);

      // Already downloaded?
      if (file.exists) {
        console.log("Model already downloaded at:", MODEL_PATH);
        return;
      }

      const output = await File.downloadFileAsync(DOWNLOAD_URL, file);
      console.log("Model downloaded to:", output.uri);
    } catch (err) {
      console.error("Error downloading Model:", err);
    }
  }

  async initialize(model: string) {
    try {

      console.log("Initializing llama model…");
      this.context = await initLlama({
        model: Paths.document.uri + "models/" + model,
        use_mlock: false, // force system to keep model in RAM
        n_ctx: 2048, // max number of tokens
        n_gpu_layers: 1, // > 0: enable Metal on iOS,
      });
    } catch (error) {
      console.error("Error initializing Model:", error);
    }
  }

  async completion(
    messages: RNLlamaOAICompatibleMessage[],
    onPartialCompletion: (data: TokenData) => void
  ) {
    try {
      const res = await this.context?.completion(
        {
          messages,
          n_predict: 2048,
          ignore_eos: false,
          stop: ["<｜end▁of▁sentence｜>"],
        },
        onPartialCompletion
      );
      return res?.text.trim() ?? "No results";
    } catch (err) {
      console.error("Error LLM completion:", err);
      return "No results";
    }
  }

  async generate(messages: RNLlamaOAICompatibleMessage[]) {
    try {
      // no callback → full response is returned at once
      const res = await this.context?.completion(
        {
          messages,
          n_predict: 2048,
          ignore_eos: false,
          stop: ["<｜end▁of▁sentence｜>"],
        },
        undefined // or undefined — no streaming
      );

      return res?.text.trim() ?? "No results";
    } catch (err) {
      console.error("Error LLM generate:", err);
      return "No results";
    }
  }

  async cleanup() {
    try {
      await this.context?.release();
    } catch {}
  }
}

export default new LlamaService();
