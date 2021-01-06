'use strict';
import { isMatchURLs, ruleHosts } from './utils/urlMatchs.js';
import App from './app.js';
import DetectURLChange from './modules/detectURLChange.js';
import { addScrollListener, scrollHandle } from './modules/detectScrollPos.js';

const appDelayTime = 300;

setTimeout(() => {
  // TODO 1. Add Loading - get h1 h2
  // TODO 2. Handle No H1 H2 status
  if (isMatchURLs(ruleHosts)) {
    debugger;
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
    // 偵聽 scroll 事件
    addScrollListener(scrollHandle);
  }, 0);
}, appDelayTime);






