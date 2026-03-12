import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { theme } from "../constants/theme";

// ─── Button ────────────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.btn,
        isPrimary && styles.btnPrimary,
        isGhost && styles.btnGhost,
        isDanger && styles.btnDanger,
        fullWidth && { width: "100%" },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <View style={styles.btnLoading}>
          <ActivityIndicator
            size="small"
            color={isPrimary ? theme.colors.surface : theme.colors.accent}
          />
          <Text>{label}</Text>
        </View>
      ) : (
        <Text
          style={[
            styles.btnText,
            isPrimary && styles.btnTextPrimary,
            isGhost && styles.btnTextGhost,
            isDanger && styles.btnTextDanger,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ─── ErrorBanner ───────────────────────────────────────────────────────────

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  style?: ViewStyle;
}

export function ErrorBanner({ message, onDismiss, style }: ErrorBannerProps) {
  return (
    <View style={[styles.errorBanner, style]}>
      <Text style={styles.errorText} numberOfLines={3}>
        {message}
      </Text>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.errorDismiss}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── SectionLabel ──────────────────────────────────────────────────────────

export function SectionLabel({
  children,
  style,
}: {
  children: string;
  style?: TextStyle;
}) {
  return (
    <Text style={[styles.sectionLabel, style]}>{children.toUpperCase()}</Text>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: theme.size.lg,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  btnPrimary: {
    backgroundColor: theme.colors.accent,
  },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  btnDanger: {
    backgroundColor: theme.colors.errorLight,
    borderWidth: 1.5,
    borderColor: theme.colors.errorBorder,
  },
  btnText: {
    fontSize: theme.text.md,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  btnTextPrimary: {
    color: theme.colors.surface,
  },
  btnTextGhost: {
    color: theme.colors.ink,
  },
  btnTextDanger: {
    color: theme.colors.error,
  },
  btnLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontWeight: "300",
    fontSize: theme.text.sm,
  },
  errorBanner: {
    backgroundColor: theme.colors.errorLight,
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
    borderRadius: theme.radius.md,
    padding: theme.size.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.size.sm,
  },
  errorText: {
    flex: 1,
    color: theme.colors.error,
    fontSize: theme.text.sm,
    lineHeight: 19,
    fontWeight: "500",
  },
  errorDismiss: {
    color: theme.colors.error,
    fontSize: theme.text.sm,
    fontWeight: "700",
  },
  sectionLabel: {
    fontSize: theme.text.xs,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: theme.colors.inkMuted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});
