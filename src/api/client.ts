const API_BASE_URL =
  process.env.EXPO_PUBLIC_BASE_URL ?? "http://localhost:8000";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? "";

export const TIMEOUT_INTERVALS = {
  healthz: 30_000,
  notes: 120_000,
  folders: 10_000,
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  timeoutMs = 10_000,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "x-API-Key": API_KEY,
        ...(options.headers ?? {}),
      },
    });

    if (!response.ok) {
      const body = await response
        .json()
        .catch(() => ({ detail: "An unexpected error occurred." }));
      throw new ApiError(
        response.status,
        body.detail ?? `Request failed with status ${response.status}`,
      );
    }

    return (await response.json().catch(() => {
      throw new ApiError(200, "Server returned an unreadable response.");
    })) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function pingServer(): Promise<void> {
  try {
    await apiFetch("/healthz", { method: "GET" }, TIMEOUT_INTERVALS.healthz);
    console.log("Server wake-up successful.");
  } catch (err) {
    console.log("Server wake-up ping failed (expected if idling):", err);
  }
}

export function friendlyError(
  err: unknown,
  context?: "ocr" | "folders",
): string {
  if (err instanceof Error && err.name === "AbortError") {
    if (context === "ocr") {
      return "The handwriting recognition service is taking too long to respond. This can happen with large or complex images.";
    }
    return "The request timed out. Check your connection and try again.";
  }
  if (!(err instanceof ApiError)) {
    return "Could not reach the server. Check your connection.";
  }
  switch (err.status) {
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 400:
      if (err.message.toLowerCase().includes("files"))
        return "Too many images selected. Maximum is 15.";
      if (
        err.message.toLowerCase().includes("size") ||
        err.message.toLowerCase().includes("large")
      )
        return "One or more images are too large. Try fewer or smaller photos.";
      return err.message;
    case 413:
      return "Images are too large to upload. Please select fewer or lower-quality photos.";
    case 500:
      if (
        err.message.toLowerCase().includes("transcri") ||
        err.message.toLowerCase().includes("gemini") ||
        err.message.toLowerCase().includes("ocr")
      )
        return "The handwriting recognition service failed. Please try again.";
      return "Something went wrong on the server. Please try again.";
    default:
      return err.message;
  }
}
