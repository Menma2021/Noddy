let popupData = '';

document.getElementById("open_webpage").addEventListener("click", () => {
  // Get the URL of index.html
  const selected_text = document.getElementById("selected_text").value;
  const indexUrl = chrome.runtime.getURL('webpage/index.html?data=' + selected_text);
  // Open index.html in a new tab
  chrome.tabs.create({ url: indexUrl });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'popup_data') {
    console.log('Data received in popup:', message.data);
    popupData = message.data;
    document.getElementById("title").textContent = "Select Key";
    document.getElementById("selected_text").value = popupData;
    // Display data in popup
  }
});