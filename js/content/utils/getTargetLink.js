export const getTargetLink = (linkDom, id) => {
  let result = undefined;
  for (const entry of Object.entries(linkDom)) {
    const href = entry[1].dataset.href;
    if (href === id) {
      return entry[1];
    }
  }

  return result;
};