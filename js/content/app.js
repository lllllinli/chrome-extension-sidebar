import { extensionId } from './config.js';
import { getTargetLink } from './utils/getTargetLink.js';
import { removeAllTitleFocusStyle } from './utils/removeAllTitleFocusStyle.js';
import { setTitleFocusStyle } from './utils/setTitleFocusStyle.js';

const createSideBar = () => {
  const rootDom = document.getElementsByTagName('body')[0];
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

const innerSidebarButtonHtml = (sidebarDomHtml, insertDom) => {
  insertDom.innerHTML += `${sidebarDomHtml}`;
};

const innerTitle = (titleDomHtml, insertDom) => {
  insertDom.innerHTML += `<h1 class="sidebar-h1">${titleDomHtml}</h1>`;
};

const innerList = (sideBarListHtml, insertDom) => {
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

const initSideBarAccordion = () => {
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
    debugger;
    const titleDomHtml = document.getElementsByTagName('h1')[0].innerText;
    const sidebarListHtml = getSideBarListHtml(sidebarList);
    const sidebarDomHtml = `
    <div class="sidebar" id="sidebar-button">
      <img src="chrome-extension://${extensionId}/icons/arrow_back-24px.svg"></img>
    </div>`;

    innerSidebarButtonHtml(sidebarDomHtml, extensionSideBarDom);
    innerTitle(titleDomHtml, extensionSideBarDom);
    innerList(sidebarListHtml, extensionSideBarDom);
    addLinkListener();
    initSideBarAccordion();

  } else {
    // TODO 移除偵聽
    // TODO 移除 添加 dom element
    document.getElementById('extension-sidebar').remove();
    document.getElementById('extension-sidebar-open-btn').remove();
  }
}

const clearExtensionDom = () => {
  // TODO 移除偵聽
  // TODO 移除 添加 dom element
  if (document.getElementById('extension-sidebar') || document.getElementById('extension-sidebar-open-btn')) {
    document.getElementById('extension-sidebar').remove();
    document.getElementById('extension-sidebar-open-btn').remove();
  }
}

export default {
  pageInit,
  getSideBarList,
  clearExtensionDom
}