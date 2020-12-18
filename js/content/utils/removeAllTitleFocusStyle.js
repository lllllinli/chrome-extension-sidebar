export const removeAllTitleFocusStyle = (linkList) => {
  for (const entry of Object.entries(linkList)) {
    entry[1].classList.remove('focus');
  }
};