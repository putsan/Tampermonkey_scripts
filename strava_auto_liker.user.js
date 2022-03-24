// ==UserScript==
// @name         Strava auto liker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       putsan
// @match        https://www.strava.com/dashboard*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @source       https://gist.github.com/putsan/cb6b9826d5a0052c4ef507e3c63aacb3
// @updateURL    https://gist.github.com/putsan/cb6b9826d5a0052c4ef507e3c63aacb3/raw/3a76117c30da6e55145ba7fa6564054408b75564/Strava_auto_liker.meta.js
// @downloadURL  https://gist.github.com/putsan/cb6b9826d5a0052c4ef507e3c63aacb3/raw/3a76117c30da6e55145ba7fa6564054408b75564/Strava_auto_liker.user.js
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  let nextBlock = document.querySelector(".react-card-container");
  //document.querySelector(".react-card-container").nextElementSibling.firstElementChild.innerHTML;

  for (let i = 0; i < 15; i++) {
      const innterHTML = nextBlock?.firstElementChild.innerHTML;
      const isItUserActivity = innterHTML?.includes('owners-name');

      if (isItUserActivity) {
          const titleData = nextBlock
            ?.firstElementChild
            .firstElementChild
            .firstElementChild
            .firstElementChild
            .firstElementChild
            .firstElementChild
            .nextElementSibling;
          const userName = titleData.firstElementChild.textContent;
          const activityTime = titleData.lastElementChild.textContent;
           console.log(27, userName, activityTime);
      }

      nextBlock = nextBlock?.nextElementSibling;
  }

  console.log('Finish');
})();
