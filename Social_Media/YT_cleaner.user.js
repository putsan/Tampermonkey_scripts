// ==UserScript==
// @name                YouTube Clean Tool
// @namespace           https://github.com/putsan
// @author              @putsan.bsky.social
// @version             0.0.1
// @match               https://*.youtube.com/*
// @exclude             *://music.youtube.com/*
// @exclude             *://*.music.youtube.com/*
// @grant               none
// @run-at              document-end
// ==/UserScript==

(function() {
  'use strict';

  const targetNode = document.querySelector('tp-yt-paper-dialog');

  if (!targetNode) {
      console.log('YouTube Clean Tool: No target node found.');
      return;
  }

  const observerOptions = {
      attributes: true, // спостерігати за змінами атрибутів
      attributeFilter: ['aria-hidden'] // конкретний атрибут, за яким слід спостерігати
  };

  const callback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
              const sharePanel = document.querySelector('.ytd-unified-share-panel-renderer');
              if (sharePanel) {
                  const input = sharePanel.querySelector('input');
                  if (input) {
                      const cleanUrl = input.value.split('?')[0];
                      input.value = cleanUrl; // Очищення URL
                      console.log('YouTube Clean Tool: URL cleaned to', cleanUrl);
                  }
              }
          }
      }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, observerOptions);

  console.log('YouTube Clean Tool: Observer initialized.');
})();
