const bindEnterKeyEvent = () => {
  const elements = document.querySelectorAll('textarea, input');
  elements.forEach((element) => {
    if (!element.dataset.listener) {
      element.dataset.listener = 'true'; // Prevent duplicate binding
      console.log('Binding event to element:', element);

      element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          console.log('User pressed Enter:', element.value);
          chrome.runtime.sendMessage({
            type: 'enter_key',
            value: element.value,
            url: window.location.href,
          });
        }
      });
    }
  });
};

const observer = new MutationObserver(() => {
  bindEnterKeyEvent(); // Attempt to bind events on each DOM change
});

// Initialize binding and start observing
bindEnterKeyEvent();
observer.observe(document.body, { childList: true, subtree: true });
