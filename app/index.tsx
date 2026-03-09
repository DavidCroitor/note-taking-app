import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../src/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>HANDWRITTEN</Text>
          <Text style={styles.heroTitle}>Notes</Text>
          <Text style={styles.heroSub}>
            Photograph your notes.{"\n"}We'll handle the rest.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.step}>
              <Text style={styles.stepNum}>01</Text>
              <Text style={styles.stepText}>Pick or shoot up to 15 photos</Text>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.step}>
              <Text style={styles.stepNum}>02</Text>
              <Text style={styles.stepText}>Choose a title and folder</Text>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.step}>
              <Text style={styles.stepNum}>03</Text>
              <Text style={styles.stepText}>Saved as Markdown to Drive</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push("/create")}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>New Note</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Powered by your own server</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.size.lg,
    paddingTop: theme.size.xl,
    paddingBottom: theme.size.md,
    justifyContent: "space-between",
  },
  hero: {
    gap: 6,
  },
  heroLabel: {
    fontSize: theme.text.xs,
    fontWeight: "700",
    letterSpacing: 2.5,
    color: theme.colors.accent,
  },
  heroTitle: {
    fontSize: 56,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    lineHeight: 60,
    letterSpacing: -1,
  },
  heroSub: {
    fontSize: theme.text.md,
    color: theme.colors.inkMuted,
    lineHeight: 23,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.size.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardRow: {
    gap: theme.size.md,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.size.md,
  },
  stepNum: {
    fontSize: theme.text.lg,
    fontFamily: theme.fonts.serif,
    color: theme.colors.accent,
    width: 28,
  },
  stepText: {
    flex: 1,
    fontSize: theme.text.md,
    color: theme.colors.ink,
    lineHeight: 21,
  },
  stepDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 44,
  },
  cta: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.md,
    paddingVertical: 18,
    paddingHorizontal: theme.size.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaText: {
    color: theme.colors.surface,
    fontSize: theme.text.lg,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  ctaArrow: {
    color: theme.colors.accent,
    fontSize: theme.text.xl,
  },
  footer: {
    textAlign: "center",
    fontSize: theme.text.xs,
    color: theme.colors.inkFaint,
    letterSpacing: 0.5,
  },
});
