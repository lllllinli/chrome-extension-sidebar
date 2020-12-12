'use strict';
const extensionId = 'ffnphmbngpjkgonejojhffgcbjnjjgfb';

const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.extension.getURL(`js/content/main.js`));
const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);
