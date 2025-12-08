import { Directory, Paths } from "expo-file-system";

export function removeModel(model_name: string) {
    try {
        const path = Paths.document.uri + "models/" + model_name;
        const directory = new Directory(path);;
        if (directory.exists) {
            directory.delete();
        } else {
            console.log("Model not found at:", path);
        }
    } catch (err) {
        console.error("Error removing Model:", err);
    }
}