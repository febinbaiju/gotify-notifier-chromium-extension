# 📥 Gotify Notification Receiver (Chromium Extension)

A Chromium extension that listens for notifications from your self-hosted [Gotify](https://gotify.net) server and displays them directly in your browser — no need to check your phone or web dashboard.

## ✨ Features

- 🖥️ Receive Gotify push notifications in your browser.
- 🔔 Native browser notifications for real-time alerts.
- 📃 Notification content copy to clipboard feature
- ⚙️ Customizable server URL and client token.

## 🔧 How It Works

1. Connects to your Gotify server using your app token.
2. Uses **WebSocket** (for real-time push)
3. Displays a **native browser notification** when a new message is received.
4. Keeps a local log of received notifications in the popup.

## 🚀 Getting Started

### 1. Load the Extension

1. Download or clone this repository.
2. Open `chrome://extensions/` in your browser.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the extension folder.