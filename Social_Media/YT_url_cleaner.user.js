// ==UserScript==
// @name                YouTube Share URL Clean Tool
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

    const observerOptions = {
        childList: true,
        subtree: true,
        attributes: false // Спочатку не спостерігаємо за атрибутами
    };

    // Функція для очищення URL
    function cleanShareUrl() {
        const input = document.querySelector('.ytd-unified-share-panel-renderer input');
        if (input && input.value) {
            input.value = input.value.split('?')[0];
            console.log('YouTube Clean Tool: URL cleaned to', input.value);
        }
    }

    // Callback для спостереження за додаванням вікна поширення
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if(mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if(node.querySelector && node.querySelector('.ytd-unified-share-panel-renderer')) {
                        console.log('YouTube Clean Tool: Share panel detected.');
                        cleanShareUrl(); // Очистити URL відразу після з'явлення панелі

                        // Починаємо спостерігати за змінами атрибутів, щоб виявити, коли панель стає видимою
                        observer.disconnect(); // Перестаємо спостерігати за додаванням нових вузлів
                        observer.observe(document.body, {attributes: true, subtree: true, childList: false, attributeFilter: ['style', 'aria-hidden']});
                    }
                });
            }
            // Також перевіряємо зміни атрибутів для вже знайденого елемента
            if(mutation.type === 'attributes' && (mutation.target.style.display !== 'none' || mutation.target.getAttribute('aria-hidden') === null)) {
                cleanShareUrl(); // Чистимо URL, якщо панель стала видимою
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, observerOptions);
})();
