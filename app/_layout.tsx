import { initKeepalive } from "@/src/api/keepAlive";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { pingServer } from "../src/api/client";
import { theme } from "../src/constants/theme";

export default function RootLayout() {
  useEffect(() => {
    return initKeepalive(pingServer);
  }, []);

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
          name="camera"
          options={{
            title: "",
            presentation: "fullScreenModal",
            headerShown: false,
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
