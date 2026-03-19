import { selectedFolderRef } from "@/app/folder-picker";
import { friendlyError } from "@/src/api/client";
import { createNoteFromImages } from "@/src/api/notes";
import { MAX_IMAGES } from "@/src/constants/config";
import type { DriveFolder, SelectedImage } from "@/src/types/models";
import { getLastFolder } from "@/src/utils/storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import ImagePicker from "react-native-image-crop-picker";

export function useCreateNote() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [folder, setFolder] = useState<DriveFolder | null>(null);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    getLastFolder().then((savedFolder) => {
      if (savedFolder && !folder) {
        setFolder(savedFolder);
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedFolderRef.folder !== null) {
        if (selectedFolderRef.folder.id === "") {
          setFolder(null);
        } else {
          setFolder(selectedFolderRef.folder);
        }
        selectedFolderRef.folder = null;
      }
    }, []),
  );

  const remaining = MAX_IMAGES - images.length;

  const pickAndCompressImage = async () => {
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images per note.`);
      return;
    }

    try {
      const pickedImages = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: remaining,
        mediaType: "photo",
        compressImageMaxWidth: 1600,
        compressImageMaxHeight: 1600,
        compressImageQuality: 0.8,
      });

      const newImages = pickedImages.map((image) => ({
        originalUri: image.path,
        filename: image.filename || `photo_${Date.now()}.jpg`,
        mimeType: image.mime || "image/jpeg",
      }));

      setImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
      clearError();
    } catch (err) {
      setError("Failed to pick images. Please try again.");
    }
  };

  const takePhoto = async () => {
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images per note.`);
      return;
    }

    try {
      const resultImage = await ImagePicker.openCamera({
        mediaType: "photo",
        compressImageMaxWidth: 1600,
        compressImageMaxHeight: 1600,
        compressImageQuality: 0.8,
        cropping: true,
        freeStyleCropEnabled: true,
        hideBottomControls: true,
      });

      setImages((prev) =>
        [
          ...prev,
          {
            originalUri: resultImage.path,
            filename: `photo_${Date.now()}.jpg`,
            mimeType: resultImage.mime,
          },
        ].slice(0, MAX_IMAGES),
      );

      clearError();
    } catch (err) {
      console.log("Cancelled taking photo");
    }
  };

  const openCropper = async (imagePath: string, index: number) => {
    try {
      const resultCropped = await ImagePicker.openCropper({
        path: imagePath,
        mediaType: "photo",
        freeStyleCropEnabled: true,
        hideBottomControls: true,
      });

      setImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, originalUri: resultCropped.path } : img,
        ),
      );
    } catch (err) {
      console.log("Cancelled cropping image");
    }
  };

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Please enter a title for your note.");
      return;
    }
    if (images.length === 0) {
      setError("Add at least one photo of your note.");
      return;
    }

    setError(null);

    try {
      setLoading(true);

      const imagesForUpload = images.map((img) => ({
        uri: img.originalUri,
        filename: img.filename,
        mimeType: img.mimeType,
      }));

      const result = await createNoteFromImages(
        imagesForUpload,
        trimmedTitle,
        folder?.id,
      );

      router.replace({
        pathname: "/success",
        params: {
          fileId: result.file_id,
          title: trimmedTitle,
          imagesCount: String(result.images_processed),
          preview: result.markdown_preview,
        },
      });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
      setCompressing(false);
    }
  }, [title, images, folder, router]);

  const isIdle = !loading && !compressing;

  return {
    title,
    setTitle,
    images,
    folder,
    loading,
    compressing,
    error,
    clearError,
    remaining,
    pickAndCompressImage,
    takePhoto,
    openCropper,
    removeImage,
    handleSubmit,
    isIdle,
    router,
  };
}
