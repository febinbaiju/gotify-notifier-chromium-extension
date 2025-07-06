const gotifyUrl = "http://192.168.1.6:8012";
const appToken = ""; // client token
const wsUrl = gotifyUrl.replace(/^http/, "ws") + `/stream?token=${appToken}`;

let socket = null;
let reconnectDelay = 2000;
let reconnectTimer = null;

function connectWebSocket() {
  if (
    socket &&
    socket.readyState !== WebSocket.CLOSED &&
    socket.readyState !== WebSocket.CLOSING
  ) {
    return; // Already connected or connecting
  }

  console.log("Trying to connect to Gotify WebSocket...");

  try {
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected ✅");
      reconnectDelay = 2000; // reset on success
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      chrome.storage.local.set({ lastMessage: data.message });

      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon.png"),
        title: data.title || "Gotify",
        message: data.message || "",
        priority: 1,
      });
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err.message);
      socket.close();
    };

    socket.onclose = () => {
      console.warn(
        `WebSocket closed. Reconnecting in ${reconnectDelay / 1000}s`
      );
      scheduleReconnect();
    };
  } catch (err) {
    console.error("WebSocket init failed:", err);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    reconnectDelay = Math.min(reconnectDelay * 2, 60000); // max 1 min
    connectWebSocket();
  }, reconnectDelay);
}

// Called when Chrome starts
chrome.runtime.onStartup.addListener(() => {
  console.log("Chrome startup — initializing WebSocket");
  connectWebSocket();
});

chrome.notifications.onClicked.addListener(() => {
  const popupUrl = chrome.runtime.getURL("popup.html");

  chrome.tabs.query({}, (tabs) => {
    const existing = tabs.find((tab) => tab.url === popupUrl);
    if (existing) {
      chrome.tabs.update(existing.id, { active: true });
    } else {
      chrome.tabs.create({ url: popupUrl });
    }
  });
});

// Alarm-based keep-alive
chrome.alarms.create("reconnectLoop", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "reconnectLoop") {
    console.log("Alarm fired — checking WebSocket state");
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      connectWebSocket();
    }
  }
});

// Initial connect
connectWebSocket();
