import AsyncStorage from "@react-native-async-storage/async-storage";
import { DriveFolder } from "./folders";

const FOLDER_KEY = "last_selected_folder";

export async function saveLastFolder(folder: DriveFolder) {
  try {
    await AsyncStorage.setItem(FOLDER_KEY, JSON.stringify(folder));
  } catch (e) {
    console.error("Failed to save folder", e);
  }
}

export async function getLastFolder(): Promise<DriveFolder | null> {
  try {
    const val = await AsyncStorage.getItem(FOLDER_KEY);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    return null;
  }
}
