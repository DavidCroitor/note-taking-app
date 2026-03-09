import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/ui";
import { theme } from "../src/constants/theme";

export default function SuccessScreen() {
  const router = useRouter();
  const { title, imagesCount, preview } = useLocalSearchParams<{
    fileId: string;
    title: string;
    imagesCount: string;
    preview: string;
  }>();

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>✓</Text>
        </View>

        <Text style={styles.heading}>Note Saved</Text>
        <Text style={styles.sub}>
          <Text style={styles.subBold}>{title}</Text> was saved to Google Drive
          from {imagesCount} image{Number(imagesCount) !== 1 ? "s" : ""}.
        </Text>

        {!!preview && (
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>PREVIEW</Text>
            <Text style={styles.previewText}>{preview}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label="New Note"
          onPress={() => router.replace("/create")}
          fullWidth
        />
        <Button
          label="Back to Home"
          onPress={() => router.replace("/")}
          variant="ghost"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: theme.size.lg,
    paddingTop: theme.size.xxl,
    paddingBottom: theme.size.xl,
    alignItems: "center",
    gap: theme.size.md,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.successLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.size.sm,
  },
  badgeIcon: { fontSize: 32, color: theme.colors.success },
  heading: {
    fontSize: theme.text.xxl,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    textAlign: "center",
  },
  sub: {
    fontSize: theme.text.md,
    color: theme.colors.inkMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  subBold: { color: theme.colors.ink, fontWeight: "600" },
  previewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.size.md,
    width: "100%",
    marginTop: theme.size.sm,
    gap: theme.size.sm,
  },
  previewLabel: {
    fontSize: theme.text.xs,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: theme.colors.inkMuted,
  },
  previewText: {
    fontSize: theme.text.sm,
    color: theme.colors.inkMuted,
    lineHeight: 20,
    fontFamily: "Courier",
  },
  actions: {
    padding: theme.size.lg,
    paddingBottom: theme.size.md,
    gap: theme.size.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
