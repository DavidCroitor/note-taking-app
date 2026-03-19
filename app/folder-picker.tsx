import { saveLastFolder } from "@/src/utils/storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { friendlyError } from "../src/api/client";
import { getRootFolders, getSubfolders } from "../src/api/folders";
import { Button, ErrorBanner } from "../src/components/ui";
import { theme } from "../src/constants/theme";
import type { DriveFolder, LevelEntry } from "../src/types/models";

export default function FolderPickerScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { selectedId } = useLocalSearchParams<{ selectedId?: string }>();

  const [stack, setStack] = useState<LevelEntry[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLevel = stack[stack.length - 1] ?? null;
  const isAtRoot = stack.length <= 1;

  useEffect(() => {
    let cancelled = false;
    getRootFolders()
      .then((data) => {
        if (cancelled) return;
        setStack([{ folder: null, children: data }]);
      })
      .catch((err) => {
        if (!cancelled) setError(friendlyError(err));
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBack = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: currentLevel?.folder ? currentLevel.folder.name : "Choose Folder",
      headerLeft: isAtRoot
        ? undefined
        : () => (
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.headerBack}
            >
              <Text style={styles.headerBackText}>‹ Back</Text>
            </TouchableOpacity>
          ),
    });
  }, [stack]);

  const handleEnterFolder = useCallback(async (folder: DriveFolder) => {
    setLoadingId(folder.id);
    try {
      const children = await getSubfolders(folder.id);
      setStack((prev) => [...prev, { folder, children }]);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoadingId(null);
    }
  }, []);

  const handleSelect = useCallback(
    (folder: DriveFolder) => {
      selectedFolderRef.folder = folder;
      saveLastFolder(folder);
      router.back();
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: DriveFolder }) => {
      const isSelected = item.id === selectedId;
      const isNavigating = loadingId === item.id;

      return (
        <TouchableOpacity
          style={[styles.row, isSelected && styles.rowSelected]}
          onPress={() => handleEnterFolder(item)}
          activeOpacity={0.7}
          disabled={loadingId !== null}
        >
          <Text style={styles.folderEmoji}>📁</Text>
          <Text
            style={[styles.folderName, isSelected && styles.folderNameSelected]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {isNavigating ? (
            <ActivityIndicator size="small" color={theme.colors.accent} />
          ) : (
            <Text style={styles.chevron}>›</Text>
          )}
        </TouchableOpacity>
      );
    },
    [handleEnterFolder, selectedId, loadingId],
  );

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading folders…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
          style={styles.errorBanner}
        />
      )}

      <FlatList
        data={currentLevel?.children ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          isAtRoot ? (
            <>
              <TouchableOpacity
                style={[styles.row, styles.defaultRow]}
                onPress={() => handleSelect({ id: "", name: "Default folder" })}
                activeOpacity={0.7}
              >
                <Text style={styles.folderEmoji}>📂</Text>
                <Text style={styles.folderName}>Default folder</Text>
                {!selectedId && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          ) : null
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No subfolders</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {!isAtRoot && currentLevel?.folder && (
        <View style={styles.footer}>
          <Button
            label={`Choose "${currentLevel.folder.name}"`}
            onPress={() => handleSelect(currentLevel.folder!)}
            fullWidth
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export const selectedFolderRef: { folder: DriveFolder | null } = {
  folder: null,
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  center: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.size.md,
  },
  loadingText: { color: theme.colors.inkMuted, fontSize: theme.text.md },
  errorBanner: { margin: theme.size.md },
  list: { paddingBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: theme.size.lg,
    gap: theme.size.sm,
    backgroundColor: theme.colors.bg,
  },
  rowSelected: { backgroundColor: theme.colors.accentLight },
  defaultRow: {},
  folderEmoji: { fontSize: 18 },
  folderName: {
    flex: 1,
    fontSize: theme.text.md,
    color: theme.colors.ink,
    fontWeight: "500",
  },
  folderNameSelected: { color: theme.colors.accent, fontWeight: "700" },
  checkmark: {
    fontSize: theme.text.md,
    color: theme.colors.accent,
    fontWeight: "700",
  },
  chevron: { fontSize: 20, color: theme.colors.inkFaint },
  divider: { height: 1, backgroundColor: theme.colors.border },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 52,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.inkMuted,
    fontSize: theme.text.md,
    paddingTop: theme.size.xl,
  },
  footer: {
    padding: theme.size.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  headerBack: { paddingHorizontal: 8 },
  headerBackText: { color: theme.colors.accent, fontSize: theme.text.md },
});
