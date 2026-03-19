import { MAX_IMAGES } from "@/src/constants/config";
import { useCreateNote } from "@/src/hooks/useCreateNote";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ErrorBanner, SectionLabel } from "../src/components/ui";
import { theme } from "../src/constants/theme";

export default function CreateScreen() {
  const {
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
  } = useCreateNote();

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
          {error && (
            <ErrorBanner
              message={error}
              onDismiss={clearError}
              style={styles.errorBanner}
            />
          )}

          <View style={styles.section}>
            <SectionLabel>Title</SectionLabel>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                clearError();
              }}
              placeholder="Random thoughts..."
              placeholderTextColor={theme.colors.inkFaint}
              maxLength={120}
              returnKeyType="done"
              autoCorrect
            />
          </View>

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
                <TouchableOpacity
                  key={img.originalUri + index}
                  style={styles.photoCell}
                  onPress={() => {
                    openCropper(img.originalUri, index);
                  }}
                >
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
                </TouchableOpacity>
              ))}

              {remaining > 0 && (
                <TouchableOpacity
                  style={styles.photoAdd}
                  onPress={pickAndCompressImage}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.size.lg,
  },
  modalCard: {
    width: "100%",
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: 320,
    backgroundColor: theme.colors.surfaceAlt,
  },
  modalActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  modalBtnDanger: {
    borderRightWidth: 0,
  },
  modalBtnText: {
    fontSize: theme.text.md,
    fontWeight: "600",
    color: theme.colors.ink,
  },
  modalBtnTextDanger: {
    color: theme.colors.error,
  },
  modalClose: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(28,24,20,0.55)",
    borderRadius: theme.radius.full,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
