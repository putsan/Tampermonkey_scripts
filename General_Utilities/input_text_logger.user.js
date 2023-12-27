// ==UserScript==
// @name         Input Text Logger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Track continuous text input on websites and save to Tampermonkey's local storage
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    let currentText = '';
    let lastDomain = '';
    let lastTimestamp = '';
    let inactivityTimer;

    // Функція для зберігання даних
function saveData(newText, newDomain, newTimestamp) {
    // Отримання існуючих даних
    let existingData = GM_getValue('savedText', []);
    console.log(23, "до",GM_getValue('savedText'));


    // Додавання нових даних
    existingData.push({text: newText, domain: newDomain, timestamp: newTimestamp});

    // Збереження оновлених даних
    GM_setValue('savedText', existingData);
    console.log(31, "після",GM_getValue('savedText'));
}


    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (currentText.length > 0) {
                saveData(currentText, lastDomain, lastTimestamp);
                currentText = '';
            }
        }, 10000); // 10 секунд неактивності
    }

    document.addEventListener('input', function(event) {
        const target = event.target;
        if (target.tagName === 'INPUT' && target.type !== 'password' || target.tagName === 'TEXTAREA') {
            const domain = window.location.hostname;
            const timestamp = new Date().toISOString();

            if (domain !== lastDomain) {
                if (currentText.length > 0) {
                    saveData(currentText, lastDomain, lastTimestamp);
                }
                currentText = target.value;
                lastDomain = domain;
                lastTimestamp = timestamp;
            } else {
                currentText = target.value;
            }
            resetInactivityTimer();
        }
    });

    // Обробник події натискання клавіші
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const domain = window.location.hostname;
            const timestamp = new Date().toISOString();

            if (currentText.length > 0) {
                saveData(currentText, domain, timestamp);
                currentText = '';
            }
        }
    });

    window.addEventListener('blur', function() {
        if (currentText.length > 0) {
            saveData(currentText, lastDomain, lastTimestamp);
            currentText = '';
        }
    });

    window.addEventListener('beforeunload', function() {
    if (currentText.length > 0) {
        saveData(currentText, lastDomain, lastTimestamp);
    }
});


     // Функція для створення попапа
    function createPopup() {
        const popupHTML = `
    <div id="tmPopup" style="position: fixed; bottom: 500px; right: 10px; z-index: 9999; padding: 10px; background: white; border: 1px solid black;">
        <button id="viewTextBtn">Переглянути текст</button>
        <button id="deleteDataBtn">Очистити дані</button>
    </div>
`;

        document.body.insertAdjacentHTML('beforeend', popupHTML);

        // Обробник для кнопки перегляду тексту
        document.getElementById('viewTextBtn').addEventListener('click', function() {
            const savedData = GM_getValue('savedText', {});
            const dataStr = `Дані: ${JSON.stringify(savedData, null, 2)}`;
            const newTab = window.open();
            newTab.document.body.innerText = dataStr;
        });
        document.getElementById('deleteDataBtn').addEventListener('click', function() {
            GM_setValue('savedText', []);
        });
    }

    // Виклик функції для створення попапа
    createPopup();

    GM_registerMenuCommand("Відкрити TextTracker", openTextTracker);

    function openTextTracker() {
    var popup = document.getElementById('tmPopup');
    if (popup.style.display === 'none') {
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
}


})();
