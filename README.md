# Note-Taking App (Mobile)

A modern, React Native mobile application built with Expo that transforms photos of handwritten notes into structured Markdown using an AI-powered backend.

---

## Features

- **AI Transcription**: Converts images (JPEG, PNG, WebP) of handwriting into clean, structured Markdown.
- **Camera Integration**: Capture notes directly within the app using a custom camera interface.
- **Folder Management**: Organize your notes into folders with a dedicated folder picker (Google Drive integration via backend).
- **Server Health Check**: Automated "Keep-Alive" system to ensure the backend is responsive before performing operations.
- **Themed UI**: A consistent, elegant design system with support for custom fonts and haptic feedback.
- **Cross-Platform**: Built with Expo and React Native, supporting iOS and Android.
- **Image-Croper**: Supports Image Croping

---

## Authentication

All requests to the backend require an API key passed as a header:
X-API-Key: your_secret_key

Make sure to set `EXPO_PUBLIC_API_KEY` in your `.env` file. This value is used automatically for all requests.

---

## Tech Stack

| Layer          | Technology Used                                                        |
| -------------- | ---------------------------------------------------------------------- |
| Framework      | [Expo](https://expo.dev/) (SDK 55) & React Native                      |
| Navigation     | [Expo Router](https://docs.expo.dev/router/introduction/) (File-based) |
| UI & Animation | Reanimated, Expo Haptics, Expo Symbols                                 |
| Hardware       | Expo Camera, Expo Image Picker                                         |
| Language       | TypeScript                                                             |

---

## Project Structure

```text
├── app/                  # Expo Router file-based navigation
│   ├── _layout.tsx       # Root layout with status bar and navigation themes
│   ├── index.tsx         # Dashboard/Notes list view
│   ├── camera.tsx        # Custom camera UI for note capture
│   ├── create.tsx        # Note creation and AI processing flow
│   ├── folder-picker.tsx # Modal for organizing notes into folders
│   └── success.tsx       # Post-upload confirmation screen
├── src/
│   ├── api/              # API client and service definitions
│   │   ├── client.ts     # Core fetch wrapper and server health checks
│   │   ├── notes.ts      # Note creation and OCR endpoints
│   │   └── keepAlive.ts  # Background pinging logic
│   ├── components/       # Shared UI primitives (Button, Card, etc.)
│   └── constants/        # Theme definitions (colors, typography, spacing)
└── assets/               # Static assets (images, fonts)
```

---

## Setup & Installation

### 1. Prerequisites

- Node.js (v18 or newer)
- Expo Go app on your mobile device (for development)
- A running [Note-Taking Server](https://github.com/DavidCroitor/note-taking-server)

### 2. Installation

```bash
git clone <this-repository-url>
cd note-taking-app
npm install
```

### 3. Configuration

Create a `.env` file in the root directory or set environment variables:

| Variable             | Required | Description                                                  |
| -------------------- | -------- | ------------------------------------------------------------ |
| EXPO_PUBLIC_BASE_URL | YES      | The URL of your AI OCR backend (e.g., http://localhost:8000) |
| EXPO_PUBLIC_API_KEY  | YES      | API Key to authorize requests to the backend                 |

### 4. Running the App

```bash
npx expo start
```

Scan the QR code with your phone or press `i` for iOS simulator / `a` for Android emulator.

---

## Backend Connectivity

The app includes a built-in `waitForServer` mechanism in [src/api/client.ts](src/api/client.ts). If your backend is hosted on a platform that scales to zero (like Render), the app will automatically display a "Waking up server" screen while it prepares the environment.

---

## Future Work

- **Multiple User Support**: Add functionality to allow multiple user to login.
- **Google Authentication**: Allow users to connect using personal Google Accounts.
- **Notes retrieval**: Allow users to retrieve saved notes, not only from Google Drive

---

## Example

![Photo 1 | 200](/assets/images/Photo1.jpg)
![Photo 2 | 200](/assets/images/Photo2.jpg)
![Photo 3 | 200](/assets/images/Photo3.jpg)
