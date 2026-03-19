import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import { theme } from "../../constants/theme";

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

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: theme.text.xs,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: theme.colors.inkMuted,
  },
});
