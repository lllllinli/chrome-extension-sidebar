export const ruleHosts = [
  'medium.com',
  '*.medium.com'
];

const matchHost = (host, ruleHost) => {
  const hostArr = host.split('.');
  const ruleHostArr = ruleHost.split('.');
  let result = false;

  if (hostArr.length !== ruleHostArr.length) {
    return result;
  }

  const newRuleArr = ruleHostArr.map((rule, i) => {
    if (rule === '*') {
      return true;
    }

    return rule !== '*' && rule === hostArr[i];
  });

  if (
    ruleHostArr.length === newRuleArr.length
    && newRuleArr.filter(item => item === false).length === 0
  ) {
    result = true;
  }

  return result;
}


export const isMatchURLs = (hosts) => {
  const protocol = `${location.protocol}`;
  const host =`${location.host}`;
  const pathname = `${location.pathname}`;

  const isRuleProtocol = (protocol) => {
    const ruleProtocol = 'https:';
    return protocol === ruleProtocol;
  }

  const isRulePathname = (pathname) => {
    let result;
    const regexpRule01 = /^\/$/;
    // const regexpRule02 = /^\/[^\/]+$/;
    const hasEditPathname = pathname.indexOf('edit') > -1;
    const hasMePathname = pathname.indexOf('me') > -1;
    const hasNewStoryPathname = pathname.indexOf('new-story') > -1;
    result = !regexpRule01.test(pathname)
      // && !regexpRule02.test(pathname)
      && !hasMePathname
      && !hasEditPathname
      && !hasNewStoryPathname;

    return result;
  }

  const isRuleHost = (host, hosts) => {
    let results = [];
    for (let i = 0; i< hosts.length; i++) {
      const ruleHost = hosts[i]
      const hasAllSelector = ruleHost.indexOf('*') > -1;
      let result = false;
      // 假如有 rule 星號
      if (hasAllSelector) {
        result = matchHost(host, ruleHost);
        results.push(result);
      } else {
        result = (ruleHost === host);
        results.push(result);
      }
    }


    return results.filter(isMatch => isMatch === true).length === 1
  };

  return isRuleProtocol(protocol) && isRulePathname(pathname) && isRuleHost(host, hosts);
}