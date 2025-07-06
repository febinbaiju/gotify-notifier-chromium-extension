const msgDiv = document.getElementById('msg');
const copyBtn = document.getElementById('copyBtn');

chrome.storage.local.get('lastMessage', data => {
  const message = data.lastMessage || 'No messages yet.';
  msgDiv.textContent = message;

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(message).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => copyBtn.textContent = "Copy to Clipboard", 2000);
    });
  };
});