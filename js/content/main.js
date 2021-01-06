'use strict';
import { isMatchURLs, ruleHosts } from './utils/urlMatchs.js';
import App from './app.js';
import DetectURLChange from './modules/detectURLChange.js';
import { addScrollListener, scrollHandle } from './modules/detectScrollPos.js';

setTimeout(() => {
  // TODO 1. Add Loading - get h1 h2
  // TODO 2. Handle No H1 H2 status
  if (isMatchURLs(ruleHosts)) {
    App.pageInit();
  }

  const onUrlChange = () => {
    App.clearExtensionDom();
    if (isMatchURLs(ruleHosts)) {
      setTimeout(() => {
        App.pageInit();
      }, 100)
    }
  }

  const detectURLChange = new DetectURLChange(onUrlChange);
  detectURLChange.init();


  setTimeout(() => {
    addScrollListener(scrollHandle);
  }, 0);
}, 100);






