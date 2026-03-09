import { getLastFolder } from "@/src/api/storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { friendlyError } from "../src/api/client";
import type { DriveFolder } from "../src/api/folders";
import { compressAll, CompressedImage } from "../src/api/images";
import { createNoteFromImages } from "../src/api/notes";
import { Button, ErrorBanner, SectionLabel } from "../src/components/ui";
import { theme } from "../src/constants/theme";
import { capturedPhotoRef } from "./camera";
import { selectedFolderRef } from "./folder-picker";

const MAX_IMAGES = 15;

interface SelectedImage {
  originalUri: string;
  filename: string;
}

export default function CreateScreen() {
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
      if (capturedPhotoRef.uri !== null) {
        const uri = capturedPhotoRef.uri;
        capturedPhotoRef.uri = null;
        setImages((prev) =>
          [
            ...prev,
            { originalUri: uri, filename: `photo_${Date.now()}.jpg` },
          ].slice(0, MAX_IMAGES),
        );
        clearError();
      }
    }, []),
  );

  const remaining = MAX_IMAGES - images.length;

  // ─── Image picking ────────────────────────────────────────────────────────

  const pickFromLibrary = useCallback(async () => {
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images per note.`);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 1,
    });
    if (!result.canceled) {
      const added: SelectedImage[] = result.assets.map((a, i) => ({
        originalUri: a.uri,
        filename: a.fileName ?? `photo_${Date.now()}_${i}.jpg`,
      }));
      setImages((prev) => [...prev, ...added].slice(0, MAX_IMAGES));
      clearError();
    }
  }, [remaining]);

  const takePhoto = useCallback(async () => {
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images per note.`);
      return;
    }
    router.push("/camera");
  }, [remaining, router]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ─── Submit ───────────────────────────────────────────────────────────────

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
      setCompressing(true);
      const compressed: CompressedImage[] = await compressAll(
        images.map((img) => ({ uri: img.originalUri, filename: img.filename })),
      );
      setCompressing(false);
      setLoading(true);

      const result = await createNoteFromImages(
        compressed,
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

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Error */}
          {error && (
            <ErrorBanner
              message={error}
              onDismiss={clearError}
              style={styles.errorBanner}
            />
          )}

          {/* Title */}
          <View style={styles.section}>
            <SectionLabel>Title</SectionLabel>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                clearError();
              }}
              placeholder="My lecture notes..."
              placeholderTextColor={theme.colors.inkFaint}
              maxLength={120}
              returnKeyType="done"
              autoCorrect
            />
          </View>

          {/* Folder */}
          <View style={styles.section}>
            <SectionLabel>Save to Folder</SectionLabel>
            <TouchableOpacity
              style={styles.folderPicker}
              onPress={() =>
                router.push({
                  pathname: "/folder-picker",
                  params: { selectedId: folder?.id ?? "" },
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.folderIcon}>
                <Text style={styles.folderEmoji}>📁</Text>
              </View>
              <Text
                style={[styles.folderName, !folder && styles.folderPlaceholder]}
              >
                {folder ? folder.name : "Default folder"}
              </Text>
              <Text style={styles.folderChevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Photos */}
          <View style={styles.section}>
            <View style={styles.photoHeader}>
              <SectionLabel>Photos</SectionLabel>
              <Text
                style={[
                  styles.photoCount,
                  remaining === 0 && styles.photoCountFull,
                ]}
              >
                {images.length} / {MAX_IMAGES}
              </Text>
            </View>

            <View style={styles.photoGrid}>
              {images.map((img, index) => (
                <View key={img.originalUri + index} style={styles.photoCell}>
                  <Image
                    source={{ uri: img.originalUri }}
                    style={styles.photoThumb}
                  />
                  <TouchableOpacity
                    style={styles.photoRemove}
                    onPress={() => removeImage(index)}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  >
                    <Text style={styles.photoRemoveIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {remaining > 0 && (
                <TouchableOpacity
                  style={styles.photoAdd}
                  onPress={pickFromLibrary}
                  activeOpacity={0.7}
                >
                  <Text style={styles.photoAddIcon}>＋</Text>
                  <Text style={styles.photoAddLabel}>Library</Text>
                </TouchableOpacity>
              )}
            </View>

            {remaining > 0 && (
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <Text style={styles.cameraBtnText}>📷 Take Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Submit */}
        <View style={styles.submitBar}>
          <Button
            label={
              compressing
                ? "Compressing images…"
                : loading
                  ? "Transcribing handwriting…"
                  : "Save Note"
            }
            onPress={handleSubmit}
            fullWidth
            disabled={!isIdle}
            loading={loading || compressing}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const THUMB_SIZE = 96;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { flex: 1 },
  content: {
    padding: theme.size.lg,
    gap: theme.size.md,
    paddingBottom: theme.size.xl,
  },
  errorBanner: { marginBottom: theme.size.sm },
  section: { gap: theme.size.sm },
  titleInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.size.md,
    paddingVertical: 14,
    fontSize: theme.text.lg,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    lineHeight: 24,
  },

  // Folder
  folderPicker: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.size.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.size.sm,
  },
  folderIcon: { width: 28, alignItems: "center" },
  folderEmoji: { fontSize: 18 },
  folderName: {
    flex: 1,
    fontSize: theme.text.md,
    color: theme.colors.ink,
    fontWeight: "500",
  },
  folderPlaceholder: { color: theme.colors.inkMuted },
  folderChevron: {
    fontSize: 22,
    color: theme.colors.inkFaint,
    lineHeight: 24,
  },

  // Photos
  photoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  photoCount: {
    fontSize: theme.text.xs,
    fontWeight: "700",
    color: theme.colors.inkMuted,
    letterSpacing: 0.5,
  },
  photoCountFull: {
    color: theme.colors.error,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.size.sm,
  },
  photoCell: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  photoThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: theme.colors.surfaceAlt,
  },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(28,24,20,0.65)",
    borderRadius: theme.radius.full,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  photoRemoveIcon: { color: "#fff", fontSize: 10, fontWeight: "700" },
  photoAdd: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  photoAddIcon: { fontSize: 22, color: theme.colors.inkMuted },
  photoAddLabel: {
    fontSize: theme.text.xs,
    color: theme.colors.inkMuted,
    fontWeight: "600",
  },
  cameraBtn: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingVertical: 13,
    alignItems: "center",
  },
  cameraBtnText: {
    fontSize: theme.text.md,
    color: theme.colors.ink,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // Bottom bar
  submitBar: {
    paddingHorizontal: theme.size.lg,
    paddingVertical: theme.size.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
    gap: theme.size.sm,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.size.sm,
  },
  progressText: {
    fontSize: theme.text.sm,
    color: theme.colors.inkMuted,
    fontStyle: "italic",
  },
});
