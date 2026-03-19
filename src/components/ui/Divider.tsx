import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { theme } from "../../constants/theme";

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});
