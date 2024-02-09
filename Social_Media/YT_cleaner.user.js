// ==UserScript==
// @name                YouTube Clean Tool
// @namespace           https://github.com/putsan
// @author              @putsan.bsky.social
// @version             0.0.1
// @match               https://*.youtube.com/*
// @exclude             *://music.youtube.com/*
// @exclude             *://*.music.youtube.com/*
// @grant               none
// @run-at               document-end
// ==/UserScript==

// Функція для очищення URL для поширення відео
(function cleanShareUrl() {
  const sharePanel = document.querySelector('.ytd-unified-share-panel-renderer');
  if (sharePanel) {
    const input = sharePanel.querySelector('input');
    if (input && input.value) {
      input.value = input.value.split('?')[0];
      console.log('input.value: ', input.value);
    }
  }
}

// Створення спостерігача для відслідковування змін у DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation => {
    if (mutation.addedNodes.length) {
      cleanShareUrl();
    }
  }))
});

// Параметри конфігурації спостерігача
const config = { childList: true, subtree: true };

// Початок спостереження
observer.observe(document.body, config);
)();
