import { DriveFolder } from "../types/models";
import { apiFetch, TIMEOUT_INTERVALS } from "./client";

interface FoldersResponse {
  folders: DriveFolder[];
}

export async function getRootFolders(): Promise<DriveFolder[]> {
  const data = await apiFetch<FoldersResponse>(
    "/folders",
    {},
    TIMEOUT_INTERVALS.folders,
  );
  return data.folders;
}

export async function getSubfolders(folderId: string): Promise<DriveFolder[]> {
  const data = await apiFetch<{ subfolders: DriveFolder[] }>(
    `/folders/${folderId}/subfolders`,
    {},
    TIMEOUT_INTERVALS.folders,
  );
  return data.subfolders;
}
