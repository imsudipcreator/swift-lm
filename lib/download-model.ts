import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from "expo-file-system";

const MODEL_DIR = Paths.document.uri + "models/";

export async function downloadModel(download_url: string, model_filename: string) {
  try {
    const modelDir = new Directory(MODEL_DIR);
    if (!modelDir.exists) {
      modelDir.create();
    }

    const model_path = MODEL_DIR + model_filename
    const file = new File(model_path);

    // Already downloaded?
    if (file.exists) {
      console.log("Model already downloaded at:", model_path);
      return;
    }

    const output = await File.downloadFileAsync(download_url, file);
    AsyncStorage.setItem('model_path', model_path)
    console.log("Model downloaded to:", output.uri);
  } catch (err) {
    console.error("Error downloading Model:", err);
  }
}
