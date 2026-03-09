import * as ImageManipulator from "expo-image-manipulator";

const MAX_DIMENSION = 1800;
const COMPRESS_QUALITY = 0.82;

export interface CompressedImage {
  uri: string;
  filename: string;
  mimeType: string;
}

export async function compressImage(
  uri: string,
  originalFilename?: string,
): Promise<CompressedImage> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_DIMENSION } }],
    {
      compress: COMPRESS_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  const basename = originalFilename
    ? originalFilename.replace(/\.[^.]+$/, "")
    : `note_${Date.now()}`;

  return {
    uri: result.uri,
    filename: `${basename}.jpg`,
    mimeType: "image/jpeg",
  };
}

export async function compressAll(
  uris: { uri: string; filename?: string }[],
): Promise<CompressedImage[]> {
  return Promise.all(uris.map((img) => compressImage(img.uri, img.filename)));
}
