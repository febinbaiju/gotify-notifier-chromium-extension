async function ensureOffscreen() {
  const has = await chrome.offscreen.hasDocument();
  if (!has) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["IFRAME_SCRIPTING"],
      justification:
        "Keep Gotify WebSocket connection alive to receive notifications",
    });
  }
}

chrome.runtime.onInstalled.addListener(ensureOffscreen);
chrome.runtime.onStartup.addListener(ensureOffscreen);
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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "gotify-message") {
    chrome.storage.local.set({ lastMessage: msg.message });
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icon.png"),
      title: msg.title || "Gotify",
      message: msg.message || "",
      priority: 1,
    });
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (tab.id && tab.url?.startsWith("http")) {
          chrome.tabs.sendMessage(tab.id, msg).catch((err) => {
            console.warn("Tab message failed:", err.message);
          });
        }
      }
    });
    sendResponse({ status: "done" });
    return true;
  }
});
