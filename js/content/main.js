'use strict';


const hasRootDom = (document.getElementById('root') !== undefined);
const hasTitle = (document.querySelectorAll('h1,h2') !== undefined);
const rootDom = document.getElementsByTagName('body')[0];
let extensionNaviDom = document.createElement('div');
let openNaviButton = document.createElement('div');
const extensionId = 'ffnphmbngpjkgonejojhffgcbjnjjgfb';

const initNavi = () => {
  extensionNaviDom = extensionNaviDom === undefined
    ? document.createElement('div')
    : extensionNaviDom;
  extensionNaviDom.setAttribute('id', 'extension-navi');
  extensionNaviDom.setAttribute('class', 'extension-navi');

  openNaviButton = openNaviButton === undefined
    ? document.createElement('div')
    : openNaviButton;
  openNaviButton.setAttribute('id', 'extension-navi-open-btn');
  openNaviButton.setAttribute('class', 'extension-navi-open-btn');
  openNaviButton.setAttribute('title', 'open section list');

  openNaviButton.innerHTML = `<img src="chrome-extension://${extensionId}/icons/arrow_forward-24px.svg"></img>`;

  rootDom.append(extensionNaviDom);
  rootDom.append(openNaviButton);
  extensionNaviDom.innerHTML = '';
};

const setSidebarDomHtml = function(sidebarDomHtml, insertDom) {
  insertDom.innerHTML += `${sidebarDomHtml}`;
};

const setTitle = function(titleDomHtml, insertDom) {
  insertDom.innerHTML += `<h1 class="navi-h1">${titleDomHtml}</h1>`;
};

const setList = function(naviListHtml, insertDom) {
  insertDom.innerHTML += `<ul class="navi-ul">${naviListHtml}</ul>`;
};

const getNaviList = function(titleDom) {
  const naviList = [];
  for (const [key, domValue] of Object.entries(titleDom)) {
    const id = domValue.id;
    const dom = document.getElementById(id);
    const topPos = dom.offsetTop + dom.clientTop;

    const result = {
      no: key,
      tagName: domValue.nodeName,
      content: domValue.innerHTML,
      id: id,
      topPos: topPos,
    };

    naviList.push(result);
  }
  console.log(naviList);

  return naviList;
};

const getNaviListHtml = function (naviList) {
  let naviListHtml = '';
  naviList.forEach(function(item) {
    if (item.tagName === 'H1') {
      naviListHtml +=
        `<li class="navi-li">
            <span class="link-mark">
              <img src="chrome-extension://${extensionId}/icons/keyboard_arrow_right-24px.svg"></img>
            </span>
            <span class="navi-a" href="${item.id}">${item.content}</span>
        </li>`;
    }

    if (item.tagName === 'H2' && item.id !== '') {
      naviListHtml +=
        `<li class="navi-li-sub">
            <span class="navi-a" href="${item.id}">${item.content}</span>
        </li>`;
    }

  });

  return naviListHtml;
};

const initSideBar = function initSideBar() {
  let isOpen = true;
  const sidebarButton = document.getElementById('sidebar-button');

  const closeNavi = function () {
    extensionNaviDom.classList.add('extension-navi-close');
    setTimeout(function() {
      openNaviButton.classList.add('extension-navi-open-btn-open');
    }, 500);
  };

  const openNavi = function () {
    extensionNaviDom.classList.remove('extension-navi-close');
    openNaviButton.classList.remove('extension-navi-open-btn-open');
  };

  sidebarButton.addEventListener('click', function() {
    closeNavi();
    isOpen = !isOpen;
  });

  openNaviButton.addEventListener('click', function() {
    openNavi();
    isOpen = !isOpen;
  });
};

const linkHandle = function(event) {
  const target = event.target;
  const hashId = target.getAttribute('href');
  const targetTitleDom = document.getElementById(hashId);
  targetTitleDom.scrollIntoView();
  // todo 移除 focus
  // todo 重新設定 focus
};

const addLinkListener = function addLinkListener() {
  const links = document.querySelectorAll('.navi-a');
  const linksLength = links.length;

  for (let i = 0; i < linksLength; i++) {
    links[i].addEventListener('click', linkHandle);
  }
};

const pageInit = () => {
  if (hasRootDom && hasTitle) {
    initNavi();
    const titleDom = document
      .getElementsByTagName('article')[0]
      .querySelectorAll('h1,h2');
    const naviList = getNaviList(titleDom);
    const titleDomHtml = titleDom[0].innerHTML;
    const naviListHtml = getNaviListHtml(naviList);
    const sidebarDomHtml = `
    <div class="sidebar" id="sidebar-button">
      <img src="chrome-extension://${extensionId}/icons/arrow_back-24px.svg"></img>
    </div>`;

    setSidebarDomHtml(sidebarDomHtml, extensionNaviDom);
    setTitle(titleDomHtml, extensionNaviDom);
    setList(naviListHtml, extensionNaviDom);
    initSideBar();
    addLinkListener();

  } else {
    extensionNaviDom.remove();
    // todo 移除偵聽
  }
}

pageInit();

// 偵聽 url 發生變化時事件
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});

const onUrlChange = () => {
  pageInit();
}


// 處理滑鼠滾動時，顯示閱讀位置
// Reference: http://www.html5rocks.com/en/tutorials/speed/animations/
let last_known_scroll_position = 0;
let ticking = false;
let lastPos = 0;

const removeAllTitleFocusStyle = function (linkList) {
  for (const entry of Object.entries(linkList)) {
    entry[1].classList.remove('focus');
  }
};

const setTitleFocusStyle = function (naviList) {
  naviList.classList.add('focus');
};

const onScrollDown = function (scrollPos) {
  const titleDom = document
    .getElementsByTagName('article')[0]
    .querySelectorAll('h1,h2');

  const naviList = getNaviList(titleDom);

  const getTargetLink = (linkDom, id) => {
    let result = undefined;
    for (const entry of Object.entries(linkDom)) {
      const href = entry[1].getAttribute('href');
      if (href === id) {
        return entry[1];
      }
    }

    return result;
  };

  const naviListLength = naviList.length;
  const isNextPosHigher = function(naviList, nextCount, scrollPos) {
    let result;
    if (naviList[nextCount] === undefined) {
      result = true;
    } else {
      result = scrollPos < naviList[nextCount].topPos;
    }

    return result;
  };
  const isScrollTarget = function(idx, nextCount, scrollPos, naviList) {
    return scrollPos > naviList[idx].topPos && isNextPosHigher(naviList, nextCount, scrollPos);
  }

  for (let idx = 0; idx < naviListLength; idx++) {
    const nextCount = idx + 1;
    if (isScrollTarget(idx, nextCount, scrollPos, naviList)) {
      const linkList = document.querySelectorAll('.navi-li,.navi-li-sub');
      const linkDom = document.querySelectorAll('.navi-a');
      const targetLink = getTargetLink(linkDom, naviList[idx].id);
      const parentElement = targetLink !== undefined ? targetLink.parentElement : undefined;

      removeAllTitleFocusStyle(linkList);
      if (parentElement) {
        setTitleFocusStyle(parentElement);
      }

    }
  }
};
const onScrollUp = (scrollPos) => {

};

const markLinkScrollPos = (scrollPos) => {
  // Do something with the scroll position
  if (lastPos < scrollPos) {
    // 頁面向下
    onScrollDown(scrollPos);
  } else if (lastPos > scrollPos) {
    // 頁面向上
    onScrollUp(scrollPos);
  }
  lastPos = scrollPos;
}

// 滑鼠滾動事件
(() => {
  window.addEventListener('scroll', () => {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        markLinkScrollPos(last_known_scroll_position);
        ticking = false;
      });

      ticking = true;
    }
  });
})();









