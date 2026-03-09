import { AppState, AppStateStatus } from "react-native";

const INTERVAL_MS = 5 * 60 * 1000;

let intervalId: ReturnType<typeof setInterval> | null = null;

function start(pingFn: () => void): void {
  if (intervalId !== null) return;
  pingFn();
  intervalId = setInterval(pingFn, INTERVAL_MS);
}

function stop(): void {
  if (intervalId === null) return;
  clearInterval(intervalId);
  intervalId = null;
}

export function initKeepalive(pingFn: () => void): () => void {
  start(pingFn);

  const subscription = AppState.addEventListener(
    "change",
    (state: AppStateStatus) => {
      if (state === "active") start(pingFn);
      else stop();
    },
  );

  return () => {
    stop();
    subscription.remove();
  };
}
