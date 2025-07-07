const gotifyUrl = "http://<SERVER>:<PORT>"; // Gotify Server URL
const appToken = ""; // Gotify Client Token
const wsUrl = gotifyUrl.replace(/^http/, "ws") + `/stream?token=${appToken}`;

let socket = null;
let reconnectDelay = 2000;

function connectWebSocket() {
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    reconnectDelay = 2000;
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    chrome.runtime.sendMessage({
      type: "gotify-message",
      title: data.title,
      message: data.message,
    });
  };

  socket.onerror = () => socket.close();

  socket.onclose = () => {
    setTimeout(connectWebSocket, reconnectDelay);
  };
}

connectWebSocket();
