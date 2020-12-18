// 目前 extension 的 id

const extensionId = chrome.runtime.id;
console.log(extensionId);

// 取得所有安裝在 chrome 上的 extensions 資訊
// 需要在 manifest.json 中設定 permissions : [ "management" ]
// 無法在 content script 中執行
chrome.management.getAll(result => {
  console.log('> management :', result);
});

const name = 'linli';

chrome.storage.sync.set({ name }, function() {
  console.log('Value is set to ' + name);
});

chrome.storage.sync.get(['name'], function(result) {
  console.log('Value currently is ' + result.name);
});


