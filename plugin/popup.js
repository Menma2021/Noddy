let popupData = '';

document.getElementById("changeColor").addEventListener("click", () => {
  // Get the URL of index.html
  const indexUrl = chrome.runtime.getURL('webpage/index.html?data=' + popupData);
  // Open index.html in a new tab
  chrome.tabs.create({ url: indexUrl });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'popup_data') {
    console.log('Data received in popup:', message.data);
    popupData = message.data;
    // Display data in popup
    
  }
});