'use strict';


const hasRootDom = (document.getElementById('root') !== undefined);
const hasTitle = (document.querySelectorAll('h1,h2') !== undefined);
const rootDom = document.getElementsByTagName('body')[0];
let extensionSideBarDom = document.createElement('div');
let openSideBarBtn = document.createElement('div');
const extensionId = 'ffnphmbngpjkgonejojhffgcbjnjjgfb';



const createSideBar = () => {
  extensionSideBarDom = extensionSideBarDom === undefined
    ? document.createElement('div')
    : extensionSideBarDom;
  extensionSideBarDom.setAttribute('id', 'extension-navi');
  extensionSideBarDom.setAttribute('class', 'extension-navi');

  openSideBarBtn = openSideBarBtn === undefined
    ? document.createElement('div')
    : openSideBarBtn;
  openSideBarBtn.setAttribute('id', 'extension-navi-open-btn');
  openSideBarBtn.setAttribute('class', 'extension-navi-open-btn');
  openSideBarBtn.setAttribute('title', 'open section list');

  openSideBarBtn.innerHTML = `<img src="chrome-extension://${extensionId}/icons/arrow_forward-24px.svg"></img>`;

  rootDom.append(extensionSideBarDom);
  rootDom.append(openSideBarBtn);
  extensionSideBarDom.innerHTML = '';
};

const setSidebarDomHtml = (sidebarDomHtml, insertDom) => {
  insertDom.innerHTML += `${sidebarDomHtml}`;
};

const setTitle = (titleDomHtml, insertDom) => {
  insertDom.innerHTML += `<h1 class="navi-h1">${titleDomHtml}</h1>`;
};

const setList = (naviListHtml, insertDom) => {
  insertDom.innerHTML += `<ul class="navi-ul">${naviListHtml}</ul>`;
};

const getSideBarList = (titleDom) => {
  const sideBarList = [];
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

    sideBarList.push(result);
  }

  return sideBarList;
};

const getSideBarListHtml =  (sideBarList) => {
  let sideBarListHtml = '';
  sideBarList.forEach((item) => {
    if (item.tagName === 'H1') {
      sideBarListHtml +=
        `<li class="navi-li">
            <span class="link-mark">
              <img src="chrome-extension://${extensionId}/icons/keyboard_arrow_right-24px.svg"></img>
            </span>
            <span class="navi-a" href="${item.id}">${item.content}</span>
        </li>`;
    }

    if (item.tagName === 'H2' && item.id !== '') {
      sideBarListHtml +=
        `<li class="navi-li-sub">
            <span class="navi-a" href="${item.id}">${item.content}</span>
        </li>`;
    }

  });

  return sideBarListHtml;
};

const initSideBar = () => {
  let isOpen = true;
  const sidebarButton = document.getElementById('sidebar-button');

  const closeNavi =  () => {
    extensionSideBarDom.classList.add('extension-navi-close');
    setTimeout(() => {
      openSideBarBtn.classList.add('extension-navi-open-btn-open');
    }, 500);
  };

  const openNavi = () => {
    extensionSideBarDom.classList.remove('extension-navi-close');
    openSideBarBtn.classList.remove('extension-navi-open-btn-open');
  };

  sidebarButton.addEventListener('click', () => {
    closeNavi();
    isOpen = !isOpen;
  });

  openSideBarBtn.addEventListener('click', () => {
    openNavi();
    isOpen = !isOpen;
  });
};

const linkHandle = (event) => {
  const target = event.target;
  const hashId = target.getAttribute('href');
  const targetTitleDom = document.getElementById(hashId);
  targetTitleDom.scrollIntoView();
  // todo 移除 focus
  // todo 重新設定 focus
};

const addLinkListener = () => {
  const links = document.querySelectorAll('.navi-a');
  const linksLength = links.length;

  for (let i = 0; i < linksLength; i++) {
    links[i].addEventListener('click', linkHandle);
  }
};

const pageInit = () => {
  if (hasRootDom && hasTitle) {
    createSideBar();
    const titleDom = document
      .getElementsByTagName('article')[0]
      .querySelectorAll('h1,h2');
    const naviList = getSideBarList(titleDom);
    const titleDomHtml = titleDom[0].innerHTML;
    const naviListHtml = getSideBarListHtml(naviList);
    const sidebarDomHtml = `
    <div class="sidebar" id="sidebar-button">
      <img src="chrome-extension://${extensionId}/icons/arrow_back-24px.svg"></img>
    </div>`;

    setSidebarDomHtml(sidebarDomHtml, extensionSideBarDom);
    setTitle(titleDomHtml, extensionSideBarDom);
    setList(naviListHtml, extensionSideBarDom);
    initSideBar();
    addLinkListener();

  } else {
    extensionSideBarDom.remove();
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

const removeAllTitleFocusStyle = (linkList) => {
  for (const entry of Object.entries(linkList)) {
    entry[1].classList.remove('focus');
  }
};

const setTitleFocusStyle = (naviList) => {
  naviList.classList.add('focus');
};

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

const onFocusHandle = (id) => {
  const linkList = document.querySelectorAll('.navi-li,.navi-li-sub');
  const linkDom = document.querySelectorAll('.navi-a');
  const targetLink = getTargetLink(linkDom, id);
  const parentElement = targetLink !== undefined ? targetLink.parentElement : undefined;

  removeAllTitleFocusStyle(linkList);
  if (parentElement) {
    setTitleFocusStyle(parentElement);
  }
};

const onScroll = (scrollPos) => {
  const titleDom = document
    .getElementsByTagName('article')[0]
    .querySelectorAll('h1,h2');

  const naviList = getSideBarList(titleDom);

  const naviListLength = naviList.length;
  const isNextPosHigher = (naviList, nextCount, scrollPos) => {
    let result;
    if (naviList[nextCount] === undefined) {
      result = true;
    } else {
      result = scrollPos < naviList[nextCount].topPos;
    }

    return result;
  };

  const isScrollToTarget = (idx, nextCount, scrollPos, naviList) => {
    return scrollPos > naviList[idx].topPos && isNextPosHigher(naviList, nextCount, scrollPos);
  }

  for (let idx = 0; idx < naviListLength; idx++) {
    const nextCount = idx + 1;
    if (isScrollToTarget(idx, nextCount, scrollPos, naviList)) {
      onFocusHandle(naviList[idx].id);
    }
  }
};

const markLinkScrollPos = (scrollPos) => {
  // Do something with the scroll position
  if (lastPos < scrollPos) {
    // 頁面向下
    onScroll(scrollPos);
  } else if (lastPos > scrollPos) {
    // 頁面向上
    onScroll(scrollPos);
  }
  lastPos = scrollPos;
}

// 滑鼠滾動事件
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









