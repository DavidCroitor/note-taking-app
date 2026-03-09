import { apiFetch, TIMEOUT_INTERVALS } from "./client";

export interface PickedImage {
  uri: string;
  filename: string;
  mimeType: string;
}

export interface CreateNoteResponse {
  message: string;
  file_id: string;
  images_processed: number;
  markdown_preview: string;
}

export async function createNoteFromImages(
  images: PickedImage[],
  filename: string,
  folderId?: string,
): Promise<CreateNoteResponse> {
  const form = new FormData();

  for (const image of images) {
    form.append("files", {
      uri: image.uri,
      name: image.filename,
      type: image.mimeType,
    } as unknown as Blob);
  }

  form.append(
    "filename",
    filename.endsWith(".md") ? filename : `${filename}.md`,
  );
  if (folderId) form.append("folder_id", folderId);

  return apiFetch<CreateNoteResponse>(
    "/notes/from-images",
    {
      method: "POST",
      body: form,
    },
    TIMEOUT_INTERVALS.notes,
  );
}
