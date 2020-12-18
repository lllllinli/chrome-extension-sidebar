'use strict';
import { isMatchURLs, ruleHosts } from './utils/urlMatchs.js'

const rootDom = document.getElementsByTagName('body')[0];

const extensionId = 'ffnphmbngpjkgonejojhffgcbjnjjgfb';

const createSideBar = () => {
  const extensionSideBarDom = document.createElement('div');
  extensionSideBarDom.setAttribute('id', 'extension-sidebar');
  extensionSideBarDom.setAttribute('class', 'extension-sidebar');

  const openSideBarBtn = document.createElement('div');
  openSideBarBtn.setAttribute('id', 'extension-sidebar-open-btn');
  openSideBarBtn.setAttribute('class', 'extension-sidebar-open-btn');
  openSideBarBtn.setAttribute('title', 'open section list');

  openSideBarBtn.innerHTML = `<img src="chrome-extension://${extensionId}/icons/arrow_forward-24px.svg"></img>`;

  rootDom.append(extensionSideBarDom);
  rootDom.append(openSideBarBtn);
  extensionSideBarDom.innerHTML = '';
};

const setSidebarButtonHtml = (sidebarDomHtml, insertDom) => {
  insertDom.innerHTML += `${sidebarDomHtml}`;
};

const setTitle = (titleDomHtml, insertDom) => {
  insertDom.innerHTML += `<h1 class="sidebar-h1">${titleDomHtml}</h1>`;
};

const setList = (sideBarListHtml, insertDom) => {
  insertDom.innerHTML += `<ul class="sidebar-ul">${sideBarListHtml}</ul>`;
};

const getSideBarList = (titleDom) => {
  const sideBarList = [];
  for (const [key, domValue] of Object.entries(titleDom)) {
    const id = domValue.id;
    const dom = document.getElementById(id);
    if (id !== undefined && dom !== undefined &&  dom !== null) {
      const topPos = dom.offsetTop + dom.clientTop;
      const result = {
        no: key,
        tagName: domValue.nodeName,
        content: domValue.innerText,
        id: id,
        topPos: topPos,
      };

      sideBarList.push(result);
    }
  }

  return sideBarList;
};

const getSideBarListHtml = (sideBarList) => {
  let sideBarListHtml = '';
  sideBarList.forEach((item) => {
    if (item.tagName === 'H1') {
      sideBarListHtml +=
        `<li class="sidebar-li">
            <span class="link-mark">
              <img src="chrome-extension://${extensionId}/icons/keyboard_arrow_right-24px.svg"></img>
            </span>
            <span class="sidebar-a" data-href="${item.id}">${item.content}</span>
        </li>`;
    }

    if (item.tagName === 'H2' && item.id !== '') {
      sideBarListHtml +=
        `<li class="sidebar-li-sub">
            <span class="link-mark">
              <img src="chrome-extension://${extensionId}/icons/arrow_right-24px.svg"></img>
            </span>
            <span class="sidebar-a" data-href="${item.id}">${item.content}</span>
        </li>`;
    }

  });

  return sideBarListHtml;
};

const initSideBarButton = () => {
  const sidebarButton = document.getElementById('sidebar-button');
  const extensionSideBarDom = document.getElementById('extension-sidebar');
  const openSideBarBtn = document.getElementById('extension-sidebar-open-btn');
  let isOpen = true;

  const closeSideBar =  (extensionSideBarDom, openSideBarBtn) => {
    openSideBarBtn.classList.remove('extension-sidebar-open-btn-close');
    extensionSideBarDom.classList.remove('extension-sidebar-open');
    extensionSideBarDom.classList.add('extension-sidebar-close');
    setTimeout(() => {
      openSideBarBtn.classList.add('extension-sidebar-open-btn-open');
    }, 500);
  };

  const openSideBar = (extensionSideBarDom, openSideBarBtn) => {
    openSideBarBtn.classList.add('extension-sidebar-open-btn-close');
    setTimeout(() => {
      extensionSideBarDom.classList.add('extension-sidebar-open');
    }, 300);
    setTimeout(() => {
      extensionSideBarDom.classList.remove('extension-sidebar-close');
      openSideBarBtn.classList.remove('extension-sidebar-open-btn-open');
    }, 600);
  };

  sidebarButton.addEventListener('click', () => {
    closeSideBar(extensionSideBarDom, openSideBarBtn);
    isOpen = !isOpen;
  });

  openSideBarBtn.addEventListener('click', () => {
    openSideBar(extensionSideBarDom, openSideBarBtn);
    isOpen = !isOpen;
  });
};

const focusLink = (hashId) => {
  const linkList = document.querySelectorAll('.sidebar-li,.sidebar-li-sub');
  const linkDom = document.querySelectorAll('.sidebar-a');
  const targetLink = getTargetLink(linkDom, hashId);
  const parentElement = targetLink !== undefined ? targetLink.parentElement : undefined;


  if (parentElement) {
    removeAllTitleFocusStyle(linkList);
    setTitleFocusStyle(parentElement);
  }
}

const linkHandle = (event) => {
  event.stopPropagation();
  event.preventDefault();
  const target = event.target;
  const hashId = (event.target.tagName === 'STRONG')
    ? target.parentElement.dataset.href
    : target.dataset.href;
  const targetTitleDom = document.getElementById(hashId);
  window.scrollTo(0, targetTitleDom.offsetTop + targetTitleDom.clientTop);
  setTimeout(() => {
    focusLink(hashId);
  }, 0)

};

const addLinkListener = () => {
  const links = document.querySelectorAll('.sidebar-a');
  const linksLength = links.length;

  for (let i = 0; i < linksLength; i++) {
    links[i].addEventListener('click', linkHandle);
  }
};

const pageInit = () => {
  const hasRootDom = () => (document.getElementById('root') !== undefined);
  const hasTitle = () => (document.querySelectorAll('h1') !== undefined);

  if (hasRootDom() && hasTitle()) {
    createSideBar();
    const extensionSideBarDom = document.getElementById('extension-sidebar');
    const titleDom = document
      .querySelectorAll('h1,h2');
    const sidebarList = getSideBarList(titleDom);
    const titleDomHtml = document.getElementsByTagName('h1')[0].innerText;
    const sidebarListHtml = getSideBarListHtml(sidebarList);
    const sidebarDomHtml = `
    <div class="sidebar" id="sidebar-button">
      <img src="chrome-extension://${extensionId}/icons/arrow_back-24px.svg"></img>
    </div>`;

    setSidebarButtonHtml(sidebarDomHtml, extensionSideBarDom);
    setTitle(titleDomHtml, extensionSideBarDom);
    setList(sidebarListHtml, extensionSideBarDom);
    addLinkListener();
    initSideBarButton();

  } else {
    // TODO 移除偵聽
    // TODO 移除 添加 dom element
    document.getElementById('extension-sidebar').remove();
    document.getElementById('extension-sidebar-open-btn').remove();
  }
}
if (isMatchURLs(ruleHosts)) {
  pageInit();
}

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
  if (isMatchURLs(ruleHosts)) {
    pageInit();
  }
}

const removeAllTitleFocusStyle = (linkList) => {
  for (const entry of Object.entries(linkList)) {
    entry[1].classList.remove('focus');
  }
};

const setTitleFocusStyle = (sidebarList) => {
  sidebarList.classList.add('focus');
};

const getTargetLink = (linkDom, id) => {
  let result = undefined;
  for (const entry of Object.entries(linkDom)) {
    const href = entry[1].dataset.href;
    if (href === id) {
      return entry[1];
    }
  }

  return result;
};

const onFocusHandle = (id) => {
  const linkList = document.querySelectorAll('.sidebar-li,.sidebar-li-sub');
  const linkDom = document.querySelectorAll('.sidebar-a');
  const targetLink = getTargetLink(linkDom, id);
  const parentElement = targetLink !== undefined ? targetLink.parentElement : undefined;

  removeAllTitleFocusStyle(linkList);
  if (parentElement) {
    setTitleFocusStyle(parentElement);
  }
};

const onScroll = (scrollPos) => {
  const titleDom = document
    .querySelectorAll('h1,h2');

  const sidebarList = getSideBarList(titleDom);

  const sidebarListLength = sidebarList.length;
  const isNextPosHigher = (sidebarList, nextCount, scrollPos) => {
    let result;
    if (sidebarList[nextCount] === undefined) {
      result = true;
    } else {
      result = scrollPos < sidebarList[nextCount].topPos;
    }

    return result;
  };

  const isScrollToTarget = (idx, nextCount, scrollPos, sidebarList) => {
    return scrollPos > sidebarList[idx].topPos && isNextPosHigher(sidebarList, nextCount, scrollPos);
  }

  for (let idx = 0; idx < sidebarListLength; idx++) {
    const nextCount = idx + 1;
    if (isScrollToTarget(idx, nextCount, scrollPos, sidebarList)) {
      onFocusHandle(sidebarList[idx].id);
    }
  }
};

const markLinkScrollPos = (scrollPos) => {
  if (lastPos < scrollPos && scrollPos !== undefined) {
    onScroll(scrollPos);
  } else if (lastPos > scrollPos && scrollPos !== undefined) {
    onScroll(scrollPos);
  }
  lastPos = scrollPos;
}

// 處理滑鼠滾動時，顯示閱讀位置
let lastKnownScrollPosition = 0;
let ticking = false;
let lastPos = 0;

const scrollHandle = () => {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      markLinkScrollPos(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }
}

const addScrollListener = (scrollHandle) => {
  // 滑鼠滾動事件
  window.addEventListener('scroll', scrollHandle);
}

// const removeScrollListener = (scrollHandle) => {
//   window.removeEventListener('scroll', scrollHandle)
// }

addScrollListener(scrollHandle);
// removeScrollListener(scrollHandle);









