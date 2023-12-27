// ==UserScript==
// @name         Input Text Logger
// @namespace    https://github.com/putsan
// @author       @putsan.bsky.social
// @version      0.1.2
// @description  Track continuous text input on websites and save to Tampermonkey's local storage
// @icon         https://github.com/putsan/Tampermonkey_scripts/blob/1b111563ad358762c1611a7e1c48544cd4fcf833/resources/icons/image_2023-12-27_22-31-58.png?raw=true
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL  https://github.com/putsan/Tampermonkey_scripts/raw/main/General_Utilities/input_text_logger.user.js
// @updateURL    https://github.com/putsan/Tampermonkey_scripts/raw/main/General_Utilities/input_text_logger.user.js
// ==/UserScript==

(function () {
  "use strict";

  let currentText = "";
  let lastDomain = "";
  let lastTimestamp = "";
  let inactivityTimer;

  // STYLES
  const popupStyle = `
      position: fixed;
      bottom: 100px;
      right: 10px;

      display: none;
      flex-direction: column;
      gap: 10px;
      width: 200px;
      padding: 10px;

      background: white;
      border: 1px solid black;
  `;

  // Функція для зберігання даних
  function saveData(newText, newDomain, newTimestamp) {
    // Отримання існуючих даних
    let existingData = GM_getValue("savedText", []);
    console.log(23, "до", GM_getValue("savedText"));

    // Додавання нових даних
    existingData.unshift({
      text: newText,
      domain: newDomain,
      timestamp: newTimestamp,
    });

    // Збереження оновлених даних
    GM_setValue("savedText", existingData);
    console.log(31, "після", GM_getValue("savedText"));
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (currentText.length > 0) {
        saveData(currentText, lastDomain, lastTimestamp);
        currentText = "";
      }
    }, 10000); // 10 секунд неактивності
  }

  document.addEventListener("input", function (event) {
    const target = event.target;
    if (
      (target.tagName === "INPUT" && target.type !== "password") ||
      target.tagName === "TEXTAREA"
    ) {
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
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const domain = window.location.hostname;
      const timestamp = new Date().toISOString();

      if (currentText.length > 0) {
        saveData(currentText, domain, timestamp);
        currentText = "";
      }
    }
  });

  window.addEventListener("blur", function () {
    if (currentText.length > 0) {
      saveData(currentText, lastDomain, lastTimestamp);
      currentText = "";
    }
  });

  window.addEventListener("beforeunload", function () {
    if (currentText.length > 0) {
      saveData(currentText, lastDomain, lastTimestamp);
    }
  });

  // Функція для створення попапа
  function createPopup() {
    const popupHTML = `
      <div id="tmPopup" class="pure-u-1-3" style="${popupStyle}">
          <button id="viewTextBtn" class="pure-button pure-button-primary">Переглянути текст</button>
          <button id="deleteDataBtn" class="button-warning pure-button">Очистити дані</button>
      </div>
  `;

    document.body.insertAdjacentHTML("beforeend", popupHTML);

    // Обробник для кнопки перегляду тексту
    document
      .getElementById("viewTextBtn")
      .addEventListener("click", function () {
        const savedData = GM_getValue("savedText", {});
        const dataStr = `Дані: ${JSON.stringify(savedData, null, 2)}`;
        const newTab = window.open();
        newTab.document.body.innerText = dataStr;
      });
    document
      .getElementById("deleteDataBtn")
      .addEventListener("click", function () {
        GM_setValue("savedText", []);
      });
  }

  // Виклик функції для створення попапа
  createPopup();

  // Створення круглої кнопки
  const circleBtnHTML = `
<div id="circleBtn" style="width: 35px; height: 35px; border-radius: 50%; background-color: green; position: fixed; bottom: 100px; right: 10px; z-index: 9999;">
<img src="https://github.com/putsan/Tampermonkey_scripts/blob/1b111563ad358762c1611a7e1c48544cd4fcf833/resources/icons/image_2023-12-27_22-31-58.png?raw=true" style="width: 35px; height: 35px; border-radius: 50%;">
</div>
`;

  document.body.insertAdjacentHTML("beforeend", circleBtnHTML);

  const circleBtn = document.getElementById("circleBtn");
  const tmPopup = document.getElementById("tmPopup");

  // Функція для розкриття попапа
  function togglePopup() {
    if (tmPopup.style.display === "none") {
      tmPopup.style.display = "flex";
      circleBtn.style.display = "none";
    }
  }

  // Функція для закриття попапа
  function closePopup() {
    tmPopup.style.display = "none";
    circleBtn.style.display = "block";
  }

  // Додавання обробника подій
  circleBtn.addEventListener("click", togglePopup);
  window.addEventListener("click", function (event) {
    // Перевірка, чи клік був зроблений поза `circleBtn` та `tmPopup`
    if (!circleBtn.contains(event.target) && !tmPopup.contains(event.target)) {
        closePopup();
    }
  });
})();
