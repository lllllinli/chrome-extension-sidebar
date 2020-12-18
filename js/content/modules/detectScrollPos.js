import { getTargetLink } from '../utils/getTargetLink.js';
import { removeAllTitleFocusStyle } from '../utils/removeAllTitleFocusStyle.js';
import { setTitleFocusStyle } from '../utils/setTitleFocusStyle.js';
import App from '../app.js';

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

  const sidebarList = App.getSideBarList(titleDom);

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

export const scrollHandle = () => {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      markLinkScrollPos(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }
}

export const addScrollListener = (scrollHandle) => {
  // 滑鼠滾動事件
  window.addEventListener('scroll', scrollHandle);
}

export const removeScrollListener = (scrollHandle) => {
  window.removeEventListener('scroll', scrollHandle)
}

export default {
  addScrollListener,
  removeScrollListener,
  scrollHandle
}