export interface DriveFolder {
  id: string;
  name: string;
}

export interface SelectedImage {
  originalUri: string;
  filename: string;
  mimeType: string;
}

export interface LevelEntry {
  folder: DriveFolder | null; // null = root
  children: DriveFolder[];
}
