// 偵聽 url 發生變化時事件
let lastUrl = location.href;

class DetectURLChange {
  mutationObserver;

  constructor(callback) {
    this.mutationObserver = new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        callback();
      }
    })
  }

  init() {
    this.mutationObserver.observe(document, {
      subtree: true,
      childList: true
    });
  }
}


export default DetectURLChange;