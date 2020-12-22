import { extensionId } from './config.js';
import { getTargetLink } from './utils/getTargetLink.js';
import { removeAllTitleFocusStyle } from './utils/removeAllTitleFocusStyle.js';
import { setTitleFocusStyle } from './utils/setTitleFocusStyle.js';

// 'RIGHT' OR 'LEFT' default 'LEFT'
let layout = 'LEFT';
//
let isOpen = true;

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

const insertElementDomToRoot = (elementDomHtml, insertDom) => {
  insertDom.innerHTML += `${elementDomHtml}`;
}

const insertTitle = (titleDomHtml, insertDom) => {
  insertDom.innerHTML += `<h1 class="sidebar-h1">${titleDomHtml}</h1>`;
};

const insertList = (sideBarListHtml, insertDom) => {
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

const closeSideBarLeftSide = (openSideBarBtn, extensionSideBarDom) => {
  const delayTime = 500;
  openSideBarBtn.classList.remove('extension-sidebar-open-btn-close');
  extensionSideBarDom.classList.remove('extension-sidebar-open');
  extensionSideBarDom.classList.add('extension-sidebar-close');
  setTimeout(() => {
    openSideBarBtn.classList.add('extension-sidebar-open-btn-open');
  }, delayTime);
};

const closeSideBarRightSide = (openSideBarBtn, extensionSideBarDom) => {
  const delayTime = 500;
  openSideBarBtn.classList.remove('extension-sidebar-open-btn-close-right-side');
  extensionSideBarDom.classList.remove('extension-sidebar-open-right-side');
  extensionSideBarDom.classList.add('extension-sidebar-close-right-side');
  setTimeout(() => {
    openSideBarBtn.classList.remove('extension-sidebar-open-btn-close');
    openSideBarBtn.classList.add('extension-sidebar-open-btn-open-right-side');
  }, delayTime);
};

const openSideBarLeftSide = (openSideBarBtn, extensionSideBarDom) => {
  openSideBarBtn.classList.add('extension-sidebar-open-btn-close');
  setTimeout(() => {
    extensionSideBarDom.classList.add('extension-sidebar-open');
  }, 300);
  setTimeout(() => {
    extensionSideBarDom.classList.remove('extension-sidebar-close');
    openSideBarBtn.classList.remove('extension-sidebar-open-btn-open');
  }, 600);
};

const openSideBarRightSide = (openSideBarBtn, extensionSideBarDom) => {
  openSideBarBtn.classList.add('extension-sidebar-open-btn-close-right-side');
  setTimeout(() => {
    extensionSideBarDom.classList.add('extension-sidebar-open-right-side');
  }, 300);
  setTimeout(() => {
    extensionSideBarDom.classList.remove('extension-sidebar-close-right-side');
    openSideBarBtn.classList.remove('extension-sidebar-open-btn-open-right-side');
  }, 600);
};

const initSideBarAccordion = () => {
  const sidebarButton = document.getElementById('sidebar-button');
  const extensionSideBarDom = document.getElementById('extension-sidebar');
  const openSideBarBtn = document.getElementById('extension-sidebar-open-btn');

  const closeSideBar =  (extensionSideBarDom, openSideBarBtn, layout) => {
    switch (layout) {
      case 'LEFT':
        closeSideBarLeftSide(openSideBarBtn, extensionSideBarDom);
        break;
      case  'RIGHT':
        closeSideBarRightSide(openSideBarBtn, extensionSideBarDom);
        break;
      default:
        console.error('layout type error');
        break;
    }
  };

  const openSideBar = (extensionSideBarDom, openSideBarBtn, layout) => {
    switch (layout) {
      case 'LEFT':
        openSideBarLeftSide(openSideBarBtn, extensionSideBarDom);
        break;
      case 'RIGHT':
        openSideBarRightSide(openSideBarBtn, extensionSideBarDom);
        break;
      default:
        console.error('layout type error');
        break;
    }

  };

  sidebarButton.addEventListener('click', () => {
    closeSideBar(extensionSideBarDom, openSideBarBtn, layout);
    isOpen = !isOpen;
  });

  openSideBarBtn.addEventListener('click', () => {
    openSideBar(extensionSideBarDom, openSideBarBtn, layout);
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

const changeLayoutToRight = (rightSideBtn, leftSideBtn, extensionElm) => {
  const delayTime = 100;
  const sidebarButton = document.getElementById('sidebar-button');
  rightSideBtn.classList.add('extension-toolbar-side-left');
  setTimeout(() => {
    rightSideBtn.classList.remove('extension-toolbar-side-left');
    rightSideBtn.classList.add('hidden');
    leftSideBtn.classList.remove('hidden');
    extensionElm.classList.add('extension-sidebar-right');
    sidebarButton.classList.add('sidebar-right-style');
    layout = 'RIGHT';
  }, delayTime);
  setTimeout(() => {
    extensionElm.classList.remove('extension-sidebar-open');
  }, 300);
};

const changeLayoutToLeft = (rightSideBtn, leftSideBtn, extensionElm) => {
  const delayTime = 100;
  const sidebarButton = document.getElementById('sidebar-button');
  const sidebarOpenBtn = document.getElementById('extension-sidebar-open-btn');
  leftSideBtn.classList.add('extension-toolbar-side-right');
  setTimeout(() => {
    leftSideBtn.classList.remove('extension-toolbar-side-right');
    leftSideBtn.classList.add('hidden');
    rightSideBtn.classList.remove('hidden');
    extensionElm.classList.remove('extension-sidebar-right');
    extensionElm.classList.remove('extension-sidebar-open-right-side');
    sidebarButton.classList.remove('sidebar-right-style');
    sidebarOpenBtn.classList.remove('extension-sidebar-open-btn-close-right-side');
    layout = 'LEFT';
  }, delayTime);
}

const addLayoutListener = () => {
  const rightSideBtn = document.getElementById('right-side-button');
  const leftSideBtn = document.getElementById('left-side-button');
  const extensionElm = document.getElementById('extension-sidebar');

  rightSideBtn.addEventListener('click', () => {
    changeLayoutToRight(rightSideBtn, leftSideBtn, extensionElm);
  });
  leftSideBtn.addEventListener('click', () => {
    changeLayoutToLeft(rightSideBtn, leftSideBtn, extensionElm);
  });
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
    const rightSideBtnDomHtml = `
    <div class="right-side-button" id="right-side-button">
      <img src="chrome-extension://${extensionId}/icons/dock-to-right.svg"></img>
    </div>`;
    const leftSideBtnDomHtml = `
    <div class="left-side-button hidden" id="left-side-button">
      <img src="chrome-extension://${extensionId}/icons/dock-to-left.svg"></img>
    </div>`;
    const toolsBarDomHtml = `<div class="tools-bar" id="tools-bar"></div>`;
    const articleContent = `<div class="article-content" id="article-content"></div>`

    insertElementDomToRoot(toolsBarDomHtml, extensionSideBarDom);
    insertElementDomToRoot(sidebarDomHtml, extensionSideBarDom);
    insertElementDomToRoot(articleContent, extensionSideBarDom);
    insertElementDomToRoot(rightSideBtnDomHtml, document.getElementById('tools-bar'));
    insertElementDomToRoot(leftSideBtnDomHtml, document.getElementById('tools-bar'));
    insertTitle(titleDomHtml, document.getElementById('article-content'));
    insertList(sidebarListHtml, document.getElementById('article-content'));

    // 加入互動事件
    addLinkListener();
    initSideBarAccordion();
    addLayoutListener();

  } else {
    document.getElementById('extension-sidebar').remove();
    document.getElementById('extension-sidebar-open-btn').remove();
  }
}

const clearExtensionDom = () => {
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