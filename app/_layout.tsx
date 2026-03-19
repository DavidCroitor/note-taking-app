import { initKeepalive } from "@/src/api/keepAlive";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { pingServer, waitForServer } from "../src/api/client";
import { Button } from "../src/components/ui";
import { theme } from "../src/constants/theme";

export default function RootLayout() {
  const [isServerReady, setIsServerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initApp = useCallback(() => {
    setError(null);
    setIsServerReady(false);

    waitForServer()
      .then(() => setIsServerReady(true))
      .catch((err) => {
        setError(
          "Could not wake up the server. Check your internet or backend status.",
        );
      });
  }, []);

  useEffect(() => {
    initApp();
    return initKeepalive(pingServer);
  }, [initApp]);

  if (!isServerReady && !error) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.statusText}>Waking up your server...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>🔌</Text>
        <Text style={styles.errorTitle}>Server Offline</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button label="Try Again" onPress={initApp} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bg },
          headerShadowVisible: false,
          headerTintColor: theme.colors.ink,
          headerTitleStyle: {
            fontFamily: theme.fonts.serif,
            fontSize: theme.text.lg,
            color: theme.colors.ink,
          },
          contentStyle: { backgroundColor: theme.colors.bg },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Notes" }} />
        <Stack.Screen
          name="create"
          options={{ title: "New Note", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="folder-picker"
          options={{
            title: "Choose Folder",
            presentation: "modal",
            headerBackTitle: "Cancel",
          }}
        />
        <Stack.Screen
          name="success"
          options={{
            title: "",
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
    padding: 40,
  },
  statusText: {
    marginTop: 10,
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.serif,
  },
  errorEmoji: { fontSize: 40, marginBottom: 10 },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.ink,
    marginBottom: 8,
  },
  errorText: {
    textAlign: "center",
    color: theme.colors.inkMuted,
    lineHeight: 20,
  },
});
