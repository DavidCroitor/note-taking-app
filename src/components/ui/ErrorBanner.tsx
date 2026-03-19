import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { theme } from "../../constants/theme";

export interface ErrorBannerProps {
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

const styles = StyleSheet.create({
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
});
