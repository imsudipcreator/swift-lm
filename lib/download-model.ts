import { useModelStore } from "@/store/model-store";
import { Model } from "@/types/model-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File, Paths } from "expo-file-system";
import { ToastAndroid } from "react-native";

const MODEL_DIR = Paths.document.uri + "models/";

export async function downloadModel(model: Model) {
  const modelStore = useModelStore.getState();
  try {
    const modelDir = new Directory(MODEL_DIR);
    if (!modelDir.exists) {
      modelDir.create();
    }
    
    const model_filename = model.name;
    const download_url = model.url;
    const model_path = MODEL_DIR + model_filename;
    const file = new File(model_path);
    
    // Already downloaded?
    if (file.exists) {
      console.log("Model already downloaded at:", model_path);
      ToastAndroid.show("Model already downloaded", ToastAndroid.SHORT);
      return;
    }

    modelStore.setDownloadingModel(model);
    const output = await File.downloadFileAsync(download_url, file);
    AsyncStorage.setItem("model", model_filename);

    // mount everything on model store
    modelStore.selectedModel = model;
    if (model) modelStore.setDownloadedModels([model]);

    ToastAndroid.show("Model downloaded", ToastAndroid.SHORT);
    console.log("Model downloaded to:", output.uri);
  } catch (err) {
    console.error("Error downloading Model:", err);
  } finally {
    modelStore.setDownloadingModel(null);
  }
}
