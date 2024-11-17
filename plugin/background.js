let shouldOpenPopup = false;
let popupData = '';
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message from content script:', message);

  if (message.type === 'enter_key') {
    console.log(`Processing user input: ${message.value}`);
    
    chrome.action.openPopup();
    popupData = message.value;
    sendResponse({ success: true });
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'popup_data', data: popupData });
      console.log('Sending data to popup');
    }, 500); // Delay 500ms
    
    shouldOpenPopup = true;
  }

  // Return true to keep the Service Worker active if there's asynchronous logic
  return true;
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if (shouldOpenPopup) {
    chrome.action.openPopup();
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'popup_data', data: popupData });
      console.log('Sending data to popup');
    }, 500); // Delay 500ms
    shouldOpenPopup = false;
  }
});
