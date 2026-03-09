import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../src/constants/theme";

export const capturedPhotoRef: { uri: string | null } = { uri: null };

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [capturing, setCapturing] = useState(false);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permText}>
          Camera access is required to take photos.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (photo) {
        capturedPhotoRef.uri = photo.uri;
        router.back();
      }
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {/* Top bar — close button */}
      <SafeAreaView
        edges={["top"]}
        style={styles.topBar}
        pointerEvents="box-none"
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.topBtn}>
          <Text style={styles.topBtnText}>✕</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom bar — shutter + flip */}
      <SafeAreaView
        edges={["bottom"]}
        style={styles.bottomBar}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
          style={styles.flipBtn}
        >
          <Text style={styles.flipBtnText}>⇄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shutter, capturing && styles.shutterDisabled]}
          onPress={handleCapture}
          activeOpacity={0.8}
          disabled={capturing}
        >
          {capturing ? (
            <ActivityIndicator color={theme.colors.accent} />
          ) : (
            <View style={styles.shutterInner} />
          )}
        </TouchableOpacity>

        {/* Spacer to keep shutter centred */}
        <View style={styles.spacer} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  center: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.size.md,
    padding: theme.size.lg,
  },
  permText: {
    color: theme.colors.ink,
    fontSize: theme.text.md,
    textAlign: "center",
  },
  permBtn: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.size.lg,
    paddingVertical: theme.size.sm,
    borderRadius: theme.radius.full,
  },
  permBtnText: { color: "#fff", fontWeight: "700", fontSize: theme.text.md },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: theme.size.md,
    paddingTop: theme.size.sm,
  },
  topBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  topBtnText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.size.xl,
    paddingBottom: theme.size.lg,
  },
  flipBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 50,
    height: 50,
    color: "transparent",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  flipBtnText: { color: "#fff", fontSize: 22, fontWeight: "600" },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterDisabled: { opacity: 0.5 },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
});
