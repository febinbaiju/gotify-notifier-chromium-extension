# 📅 Gotify Notification Receiver (Chromium Extension)

A Chromium extension that listens for notifications from your self-hosted [Gotify](https://gotify.net) server and displays them directly in your browser — no need to check your phone or web dashboard.

## ✨ Features

* 🖥️ Receive Gotify push notifications in your browser.
* 🔔 Native browser notifications for real-time alerts.
* 📃 Notification content copy-to-clipboard feature.
* ⚙️ Customizable server URL and client token.

## 🔧 How It Works

1. Connects to your Gotify server using your app token.
2. Uses **WebSocket** (for real-time push).
3. Displays a **native browser notification** when a new message is received.
4. Keeps a local log of received notifications in the popup.

## 🚀 Getting Started

### 1. Add Your Gotify Details

Before loading the extension, you must set your **Gotify server URL** and **Client Token**:

1. Open the `offscreen.js` file in a code editor.

2. Locate the following lines:

   ```js
   const gotifyUrl = "http://your-gotify-server:port"; // e.g., http://192.168.1.6:8012
   const appToken = ""; // Add your client token here
   ```

3. Replace them with your actual server URL and client token.

---

### 2. Load the Extension

1. Open `chrome://extensions/` in your Chromium-based browser.
2. Enable **Developer Mode** (toggle in the top-right).
3. Click **Load unpacked** and select the extension folder.