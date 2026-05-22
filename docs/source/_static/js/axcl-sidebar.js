(function () {
  function isExternalHref(href) {
    return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:');
  }

  function isHomepageUrl(href) {
    try {
      const url = new URL(href, window.location.href);
      const path = url.pathname;
      return path === '/' || 
             path === '/index.html' || 
             path === '/zh/' || 
             path === '/zh/index.html' || 
             path === '/en/' || 
             path === '/en/index.html' ||
             path.endsWith('/zh/index.html') ||
             path.endsWith('/en/index.html');
    } catch (e) {
      return false;
    }
  }


  function getStateKey(lang) {
    return `axcl-sidebar-state-${lang}`;
  }

  function getScrollKey(lang) {
    return `axcl-sidebar-scroll-${lang}`;
  }

  function getContentScrollResetKey() {
    return 'axcl-language-switch-scroll-reset';
  }

  function getSidebarFocusRevealKey() {
    return 'axcl-language-switch-sidebar-focus-reveal';
  }

  function getHomepageResetKey() {
    return 'axcl-homepage-reset-pending';
  }

  function readState(stateKey) {
    try {
      return JSON.parse(window.localStorage.getItem(stateKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeState(stateKey, state) {
    try {
      window.localStorage.setItem(stateKey, JSON.stringify(state));
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function readScrollTop(scrollKey) {
    try {
      const raw = window.sessionStorage.getItem(scrollKey);
      if (raw === null) {
        return null;
      }
      const value = Number(raw);
      return Number.isFinite(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  function writeScrollTop(scrollKey, scrollTop) {
    try {
      window.sessionStorage.setItem(scrollKey, String(scrollTop));
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function readContentScrollResetFlag() {
    try {
      return window.sessionStorage.getItem(getContentScrollResetKey()) === 'true';
    } catch (error) {
      return false;
    }
  }

  function writeContentScrollResetFlag() {
    try {
      window.sessionStorage.setItem(getContentScrollResetKey(), 'true');
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function clearContentScrollResetFlag() {
    try {
      window.sessionStorage.removeItem(getContentScrollResetKey());
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function readSidebarFocusRevealTarget() {
    try {
      const raw = window.sessionStorage.getItem(getSidebarFocusRevealKey());
      if (!raw) {
        return null;
      }

      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            lang: typeof parsed.lang === 'string' ? parsed.lang : '',
            offsetTop: Number.isFinite(parsed.offsetTop) ? parsed.offsetTop : null,
          };
        }
      } catch (parseError) {
        return { lang: raw, offsetTop: null };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  function writeSidebarFocusRevealTarget(lang, offsetTop) {
    try {
      window.sessionStorage.setItem(getSidebarFocusRevealKey(), JSON.stringify({
        lang: String(lang || ''),
        offsetTop: Number.isFinite(offsetTop) ? offsetTop : null,
      }));
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function clearSidebarFocusRevealTarget() {
    try {
      window.sessionStorage.removeItem(getSidebarFocusRevealKey());
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function readHomepageResetPending() {
    try {
      return window.sessionStorage.getItem(getHomepageResetKey()) === 'true';
    } catch (error) {
      return false;
    }
  }

  function writeHomepageResetPending() {
    try {
      window.sessionStorage.setItem(getHomepageResetKey(), 'true');
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function clearHomepageResetPending() {
    try {
      window.sessionStorage.removeItem(getHomepageResetKey());
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function isDesktopSidebarScrollIsolationEnabled() {
    if (typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)').matches;
  }

  function normalizeHref(href) {
    if (!href || href === '#') {
      return href;
    }

    try {
      const url = new URL(href, window.location.href);
      const isExternalOtherOrigin = isExternalHref(href) && !href.startsWith(window.location.origin);
      if (url.origin !== window.location.origin || isExternalOtherOrigin) {
        return href;
      }

      return `${url.pathname.replace(/^\/(?:zh|en)\//, '').replace(/^\//, '')}${url.hash}`;
    } catch (error) {
      return href
        .replace(/^(?:\.\.\/)+/, '')
        .replace(/^(?:zh|en)\//, '');
    }
  }

  function resolveLocalHref(href) {
    if (!href || href === '#') {
      return href;
    }

    try {
      const url = new URL(href, window.location.href);
      const isExternalOtherOrigin = isExternalHref(href) && !href.startsWith(window.location.origin);
      if (url.origin !== window.location.origin || isExternalOtherOrigin) {
        return href;
      }

      return `${url.pathname}${url.hash}`;
    } catch (error) {
      return href;
    }
  }

  function getBranchItems(tree) {
    const candidates = [];
    if (tree.tagName === 'LI') {
      candidates.push(tree);
    }
    candidates.push(...Array.from(tree.querySelectorAll('li')));

    return candidates.filter((node) => {
      const hasDirectList = Array.from(node.children).some((child) => child.tagName === 'UL');
      const link = Array.from(node.children).find((child) => child.tagName === 'A') || null;
      return hasDirectList && Boolean(link);
    });
  }

  function getBranchLink(node) {
    return Array.from(node.children).find((child) => child.tagName === 'A') || null;
  }

  function toStateKey(href) {
    const normalized = normalizeHref(href);
    if (!normalized || normalized === '#') {
      return '';
    }
    return normalized.split('#')[0];
  }

  function isExpanded(node) {
    if (node.dataset.axclExpanded === 'true') {
      return true;
    }
    if (node.dataset.axclExpanded === 'false') {
      return false;
    }
    return node.classList.contains('current');
  }

  function setExpanded(node, expanded) {
    node.dataset.axclExpanded = expanded ? 'true' : 'false';
    node.classList.toggle('current', expanded);
    node.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function getBranchStateKey(node) {
    const link = getBranchLink(node);
    const linkStateKey = toStateKey(link ? link.getAttribute('href') : '');
    if (linkStateKey) {
      return linkStateKey;
    }

    const sidebar = node.closest('.axcl-sidebar');
    if (
      sidebar
      && sidebar.dataset.homepage === 'true'
      && node.classList.contains('toctree-l1')
    ) {
      return `${sidebar.dataset.lang || 'zh'}/index.html`;
    }

    const descendant = Array.from(node.querySelectorAll('ul a[href]')).find((anchor) => {
      const candidate = toStateKey(anchor.getAttribute('href') || '');
      return Boolean(candidate);
    }) || null;
    if (descendant) {
      return toStateKey(descendant.getAttribute('href') || '');
    }

    return '';
  }

  function getLanguageRootNodeByLang(tree, lang) {
    const topList = Array.from(tree.children).find((node) => node.tagName === 'UL') || null;
    if (!topList) {
      return null;
    }

    return Array.from(topList.children).find((node) => {
      if (node.tagName !== 'LI') {
        return false;
      }
      const link = getBranchLink(node);
      const href = link ? link.getAttribute('href') || '' : '';
      const resolvedPath = resolveLocalHref(href).split('#')[0];
      if (href === '#') {
        return true;
      }

      if (lang === 'zh') {
        return resolvedPath === '/index.html' || resolvedPath === '/zh/index.html';
      }

      return resolvedPath === `/${lang}/index.html`;
    }) || null;
  }

  function getLanguageRoot(tree) {
    if (tree.dataset.homepage === 'true') {
      return getHomepageRootNode(tree) || tree;
    }

    const topList = Array.from(tree.children).find((node) => node.tagName === 'UL') || null;
    if (topList) {
      const activeRootNode = Array.from(topList.children).find((node) => {
        if (node.tagName !== 'LI') {
          return false;
        }
        return node.querySelector('a.current') !== null;
      }) || null;

      if (activeRootNode) {
        return activeRootNode;
      }

      // Fallback for search.html or other pages not in toctree
      const fallbackRoot = getLanguageRootNodeByLang(tree, tree.dataset.lang || 'zh');
      if (fallbackRoot) {
        return fallbackRoot;
      }
    }
    return tree;
  }

  function getHomepageRootNode(tree) {
    if (tree.dataset.homepage !== 'true') {
      return null;
    }
    return getLanguageRootNodeByLang(tree, tree.dataset.lang || 'zh');
  }

  function getCurrentLanguageScope(tree) {
    return getLanguageRootNodeByLang(tree, tree.dataset.lang || 'zh') || getLanguageRoot(tree);
  }

  function getTopLevelRootNodes(tree) {
    const topList = Array.from(tree.children).find((node) => node.tagName === 'UL') || null;
    if (!topList) {
      return [];
    }

    return Array.from(topList.children).filter((node) => node.tagName === 'LI');
  }

  function getActiveLanguageRootNode(tree) {
    const roots = getTopLevelRootNodes(tree);
    return roots.find((node) => node.querySelector('a.current') !== null) || roots[0] || null;
  }

  function getTranslatedLanguageRootNode(tree, sourceRootNode) {
    return getTopLevelRootNodes(tree).find((node) => node !== sourceRootNode) || null;
  }

  function getDirectCurrentNode(rootNode) {
    const candidates = [rootNode, ...Array.from(rootNode.querySelectorAll('li'))];
    const currentNodes = candidates.filter((node) => {
      if (node.tagName !== 'LI') {
        return false;
      }
      const link = getBranchLink(node);
      return Boolean(link) && link.classList.contains('current');
    });

    return currentNodes[currentNodes.length - 1] || null;
  }

  function getNodeIndexPath(rootNode, targetNode) {
    const path = [];
    let currentNode = targetNode;

    while (currentNode && currentNode !== rootNode) {
      const parentList = currentNode.parentElement;
      if (!parentList) {
        return null;
      }

      const siblings = Array.from(parentList.children).filter((node) => node.tagName === 'LI');
      const index = siblings.indexOf(currentNode);
      if (index < 0) {
        return null;
      }

      path.unshift(index);
      currentNode = parentList.closest('li');
    }

    return currentNode === rootNode ? path : null;
  }

  function followNodeIndexPath(rootNode, indexPath) {
    let currentNode = rootNode;

    for (const index of indexPath) {
      const childList = Array.from(currentNode.children).find((node) => node.tagName === 'UL') || null;
      if (!childList) {
        return null;
      }

      const children = Array.from(childList.children).filter((node) => node.tagName === 'LI');
      currentNode = children[index] || null;
      if (!currentNode) {
        return null;
      }
    }

    return currentNode;
  }

  function resolveTranslatedCurrentHref(tree, fallbackHref) {
    const sourceRootNode = getActiveLanguageRootNode(tree);
    const targetRootNode = sourceRootNode ? getTranslatedLanguageRootNode(tree, sourceRootNode) : null;
    const currentNode = sourceRootNode ? getDirectCurrentNode(sourceRootNode) : null;

    if (!sourceRootNode || !targetRootNode || !currentNode) {
      return fallbackHref;
    }

    const indexPath = getNodeIndexPath(sourceRootNode, currentNode);
    if (!indexPath) {
      return fallbackHref;
    }

    const targetNode = followNodeIndexPath(targetRootNode, indexPath);
    const targetLink = targetNode ? getBranchLink(targetNode) : null;
    if (!targetLink) {
      return resolveLocalHref(fallbackHref);
    }

    return targetLink.dataset.axclHrefResolved
      || resolveLocalHref(targetLink.getAttribute('href') || fallbackHref)
      || resolveLocalHref(fallbackHref);
  }

  function updateLanguageSwitchTargets(tree) {
    document.querySelectorAll(".axcl-language-switch .axcl-language-link[data-lang-target]").forEach((link) => {
      if (!link.dataset.axclBaseHref) {
        link.dataset.axclBaseHref = link.getAttribute('href') || '';
      }

      const resolvedHref = resolveTranslatedCurrentHref(tree, link.dataset.axclBaseHref);
      if (resolvedHref) {
        link.setAttribute('href', resolvedHref);
      }
    });
  }

  function collectBranchState(tree) {
    const state = {};
    getBranchItems(tree).forEach((node) => {
      const stateKey = getBranchStateKey(node);
      if (stateKey) {
        state[stateKey] = isExpanded(node);
      }
    });
    return state;
  }

  function persistTranslatedState(tree, targetLang) {
    const sourceLang = tree.dataset.lang || 'zh';
    const sourceStateKey = getStateKey(sourceLang);
    const sourceState = {
      ...readState(sourceStateKey),
      ...collectBranchState(getCurrentLanguageScope(tree)),
    };
    writeState(getStateKey(targetLang), sourceState);
  }

  function applyState(tree, state) {
    getBranchItems(tree).forEach((node) => {
      const stateKey = getBranchStateKey(node);

      // Branches that contain the current page MUST stay expanded.
      // Sphinx sets class="current" on the active <a> element, and our JS
      // never modifies <a> class attributes, so querySelector('a.current')
      // reliably detects whether the current page lives inside this branch.
      const containsCurrent = node.querySelector('a.current') !== null;

      var shouldOpen;
      if (stateKey && Object.prototype.hasOwnProperty.call(state, stateKey)) {
        // Respect the user's manual expand / collapse choices first.
        shouldOpen = Boolean(state[stateKey]);
      } else if (containsCurrent || node === tree) {
        // Without saved user preference, expand branches containing active page or the root node itself.
        shouldOpen = true;
      } else {
        // No saved preference: do not override the current rendered state.
        // This avoids route-change-driven auto-collapse.
        shouldOpen = isExpanded(node);
      }

      setExpanded(node, shouldOpen);
    });
  }

  function bindTree(tree) {
    if (tree.dataset.axclBound === 'true') {
      return;
    }
    tree.dataset.axclBound = 'true';

    const stateKey = getStateKey(tree.dataset.lang || 'zh');
    const scrollKey = getScrollKey(tree.dataset.lang || 'zh');
    const isHomepageActive = () => tree.dataset.homepage === 'true';
    var scope = getCurrentLanguageScope(tree);
    applyState(scope, readState(stateKey));


    function getSidebarScrollContainer() {
      return document.querySelector('.wy-side-scroll');
    }



    function persistSidebarScroll() {
      const sideScroll = getSidebarScrollContainer();
      if (!sideScroll) {
        return;
      }
      writeScrollTop(scrollKey, sideScroll.scrollTop);
    }

    function getSidebarFocusRevealSnapshot() {
      const sideScroll = getSidebarScrollContainer();
      const rootNode = getLanguageRoot(tree);
      const currentNode = rootNode && rootNode.tagName === 'LI'
        ? getDirectCurrentNode(rootNode)
        : null;
      const currentLink = currentNode ? getBranchLink(currentNode) : null;

      if (!sideScroll || !currentLink) {
        return null;
      }

      const containerRect = sideScroll.getBoundingClientRect();
      const linkRect = currentLink.getBoundingClientRect();
      return {
        offsetTop: linkRect.top - containerRect.top,
      };
    }

    function restoreSidebarScroll() {
      const focusRevealTarget = readSidebarFocusRevealTarget();
      if (focusRevealTarget && focusRevealTarget.lang === (tree.dataset.lang || 'zh')) {
        return;
      }

      const sideScroll = getSidebarScrollContainer();
      if (!sideScroll) {
        return;
      }
      const saved = readScrollTop(scrollKey);
      if (saved === null) {
        return;
      }
      sideScroll.scrollTop = saved;
    }

    function resetContentScrollIfNeeded() {
      if (!readContentScrollResetFlag()) {
        return;
      }

      clearContentScrollResetFlag();
      const scrollContentToTop = () => window.scrollTo(0, 0);

      scrollContentToTop();
      window.requestAnimationFrame(scrollContentToTop);
      [0, 50, 150, 300, 600, 1000].forEach((delay) => {
        window.setTimeout(scrollContentToTop, delay);
      });
    }

    function revealSidebarCurrentNodeIfNeeded() {
      const focusRevealTarget = readSidebarFocusRevealTarget();
      if (!focusRevealTarget || focusRevealTarget.lang !== (tree.dataset.lang || 'zh')) {
        return;
      }

      const sideScroll = getSidebarScrollContainer();
      const rootNode = getLanguageRoot(tree);
      const currentNode = rootNode && rootNode.tagName === 'LI'
        ? getDirectCurrentNode(rootNode)
        : null;
      const currentLink = currentNode ? getBranchLink(currentNode) : null;

      if (!sideScroll || !currentLink) {
        return;
      }

      const containerRect = sideScroll.getBoundingClientRect();
      const linkRect = currentLink.getBoundingClientRect();
      const maxScrollTop = sideScroll.scrollHeight - sideScroll.clientHeight;
      const desiredOffsetTop = Number.isFinite(focusRevealTarget.offsetTop)
        ? focusRevealTarget.offsetTop
        : (linkRect.top - containerRect.top);
      const targetScrollTop = sideScroll.scrollTop
        + (linkRect.top - containerRect.top)
        - desiredOffsetTop;
      const clampedScrollTop = Math.max(0, Math.min(maxScrollTop, targetScrollTop));
      const applyScrollTop = () => {
        sideScroll.scrollTop = clampedScrollTop;
      };

      clearSidebarFocusRevealTarget();
      applyScrollTop();
      window.requestAnimationFrame(applyScrollTop);
      window.setTimeout(applyScrollTop, 0);
      window.setTimeout(applyScrollTop, 50);
    }

    function syncState() {
      writeState(stateKey, {
        ...readState(stateKey),
        ...collectBranchState(scope),
      });
    }

    function toggleBranch(node) {
      const nextOpen = !isExpanded(node);
      setExpanded(node, nextOpen);
      syncState();
    }

    function applyHomepageDefaults() {
      if (!isHomepageActive()) {
        return;
      }

      if (readHomepageResetPending()) {
        clearHomepageResetPending();
        writeState(stateKey, {});
        homepageDefaultsApplied = false;
      }

      const state = readState(stateKey);
      const hasSavedState = Object.keys(state).length > 0;

      if (hasSavedState) {
        homepageDefaultsApplied = true;
        applyState(scope, state);
        return;
      }

      if (!homepageDefaultsApplied) {
        homepageDefaultsApplied = true;

        getBranchItems(scope).forEach((node) => {
          const shouldOpen =
            node.classList.contains('toctree-l2') ||
            node.classList.contains('toctree-l1');
          setExpanded(node, shouldOpen);
        });

        syncState();
      }
    }

    var applyingSidebarState = false;
    var restoreScheduled = false;
    var homepageDefaultsApplied = false;

    function applySidebarState() {
      applyingSidebarState = true;
      if (isHomepageActive()) {
        applyHomepageDefaults();
        window.setTimeout(() => {
          applyingSidebarState = false;
        }, 0);
        return;
      }

      // On full page loads Sphinx only restores the current document path.
      // Recompute the exact current leaf from pathname + hash so duplicate
      // autogenerated anchors like #id4 stay attached to the right branch.
      updateSidebarForNewPage(window.location.href);
    }

    function resetHomepageToDefaultState() {
      if (!isHomepageActive()) {
        return;
      }
      writeState(stateKey, {});
      homepageDefaultsApplied = false;
      applySidebarState();
      restoreSidebarScroll();
    }


    function scheduleSidebarStateRestore() {
      if (restoreScheduled) {
        return;
      }
      restoreScheduled = true;
      window.requestAnimationFrame(() => {
        restoreScheduled = false;
        applySidebarState();
      });
    }

    // ===== SPA Navigation Support =====
    // Pre-calculate resolved pathnames for relative links without modifying the DOM href.
    // This allows SPA page transitions to uniquely identify nodes and matches Playwright
    // tests that assert on raw Sphinx-generated relative href attributes in the DOM.
    tree.querySelectorAll('a[href]').forEach(function(linkEl) {
      var rawHref = linkEl.getAttribute('href');
      if (!rawHref || isExternalHref(rawHref)) return;
      if (rawHref === '#') {
        linkEl.dataset.axclHrefResolved = window.location.pathname;
        return;
      }
      try {
        var resolved = new URL(rawHref, window.location.href);
        if (resolved.origin === window.location.origin) {
          linkEl.dataset.axclHrefResolved = resolved.pathname + (resolved.hash || '');
        }
      } catch (e) { /* ignore malformed URLs */ }
    });

    applySidebarState();
    updateLanguageSwitchTargets(tree);


    var spaAbortController = null;

    function bindLanguageSwitchListeners() {
      document.querySelectorAll(".axcl-language-switch .axcl-language-link[data-lang-target]").forEach(function(switchLink) {
        if (switchLink.dataset.axclBound === 'true') return;
        switchLink.dataset.axclBound = 'true';
        switchLink.addEventListener("click", function() {
          var focusRevealSnapshot = getSidebarFocusRevealSnapshot();
          syncState();
          persistTranslatedState(tree, switchLink.dataset.langTarget);
          updateLanguageSwitchTargets(tree);
          writeContentScrollResetFlag();
          writeSidebarFocusRevealTarget(
            switchLink.dataset.langTarget,
            focusRevealSnapshot ? focusRevealSnapshot.offsetTop : null
          );
        });
      });
    }

    function findBestMatchingSidebarLink(rootNode, targetUrl) {
      var exactHrefMatch = null;
      var exactPathMatch = null;
      var firstPathMatch = null;
      var targetPathname = targetUrl.pathname;
      var targetHash = targetUrl.hash || '';
      var targetFull = targetPathname + targetHash;

      rootNode.querySelectorAll('a[href]').forEach(function(linkEl) {
        var resolvedHref = linkEl.dataset.axclHrefResolved;
        if (!resolvedHref) {
          return;
        }

        if (resolvedHref === targetFull && !exactHrefMatch) {
          exactHrefMatch = linkEl;
        }

        var resolvedPath = resolvedHref.split('#')[0];
        if (resolvedPath !== targetPathname) {
          return;
        }

        if (!firstPathMatch) {
          firstPathMatch = linkEl;
        }

        if (!resolvedHref.includes('#') && !exactPathMatch) {
          exactPathMatch = linkEl;
        }
      });

      if (targetHash) {
        return exactHrefMatch || exactPathMatch || firstPathMatch;
      }

      return exactPathMatch || firstPathMatch;
    }

    function updateSidebarForNewPage(newUrl) {
      applyingSidebarState = true;
      var targetUrl;
      try {
        targetUrl = new URL(newUrl, window.location.href);
      } catch (e) {
        applyingSidebarState = false;
        return;
      }

      // Update homepage attribute dynamically
      tree.dataset.homepage = isHomepageUrl(newUrl) ? 'true' : 'false';
      scope = getCurrentLanguageScope(tree);

      // Clear all current markers within current language scope
      scope.querySelectorAll('a.current').forEach(function(el) {
        el.classList.remove('current');
      });
      scope.querySelectorAll('li.current').forEach(function(el) {
        el.classList.remove('current');
      });
      // Prefer exact path + hash matches so same-page anchors do not fall through
      // to the last leaf on the same document.
      var matchedLink = findBestMatchingSidebarLink(scope, targetUrl);
      // Mark matched link and all ancestor <li>s as current
      if (matchedLink) {
        matchedLink.classList.add('current');
        var parentLi = matchedLink.closest('li');
        while (parentLi) {
          parentLi.classList.add('current');
          if (parentLi === scope || !scope.contains(parentLi)) break;
          var pe = parentLi.parentElement;
          parentLi = pe ? pe.closest('li') : null;
        }
      }
      // Language root itself must stay marked current
      if (scope.tagName === 'LI') scope.classList.add('current');
      // Re-apply saved expand / collapse preferences
      applyState(scope, readState(stateKey));
      window.setTimeout(function() { applyingSidebarState = false; }, 0);
    }


    function performSPANavigation(targetHref, skipPushState) {
      if (spaAbortController) spaAbortController.abort();
      spaAbortController = new AbortController();
      var signal = spaAbortController.signal;
      var targetUrl;
      try {
        targetUrl = new URL(targetHref, window.location.href);
      } catch (e) {
        window.location.href = targetHref;
        return;
      }
      fetch(targetUrl.href, { signal: signal })
        .then(function(resp) {
          if (!resp.ok) throw new Error('HTTP ' + resp.status);
          return resp.text();
        })
        .then(function(html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var newContent = doc.querySelector('.wy-nav-content');
          var curContent = document.querySelector('.wy-nav-content');
          if (!newContent || !curContent) {
            window.location.href = targetUrl.href;
            return;
          }
          // Replace only the content area; sidebar DOM stays intact
          curContent.innerHTML = newContent.innerHTML;
          document.title = doc.title;
          if (!skipPushState) {
            history.pushState(
              { axclSPA: true },
              doc.title,
              targetUrl.pathname + (targetUrl.hash || '')
            );
          }
          updateSidebarForNewPage(targetUrl.href);
          if (targetUrl.hash) {
            var ht = document.querySelector(targetUrl.hash);
            if (ht) ht.scrollIntoView();
          } else {
            window.scrollTo(0, 0);
          }
          bindLanguageSwitchListeners();
          updateLanguageSwitchTargets(tree);
          spaAbortController = null;
        })
        .catch(function(err) {
          if (err.name === 'AbortError') return;
          window.location.href = targetUrl.href;
        });
    }

    bindLanguageSwitchListeners();
    // ===== End SPA Navigation Support =====

    getBranchItems(scope).forEach((node) => {
      const link = getBranchLink(node);
      if (!link) {
        return;
      }
      link.addEventListener('click', (event) => {
        const clickedButton = event.target instanceof Element ? event.target.closest('button.toctree-expand') : null;
        if (clickedButton) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        toggleBranch(node);
      });
    });

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) {
        return;
      }

      const homepageLogo = target.closest('.wy-side-nav-search a.icon-home, .wy-nav-top a, .wy-breadcrumbs a.icon-home');
      if (homepageLogo) {
        if (isHomepageActive()) {
          event.preventDefault();
          event.stopPropagation();
          resetHomepageToDefaultState();
        } else {
          writeHomepageResetPending();
        }
        return;
      }

      const toggle = target.closest('button.toctree-expand');
      if (toggle && scope.contains(toggle)) {
        event.preventDefault();
        event.stopPropagation();
        const node = toggle.closest('li');
        if (node) {
          toggleBranch(node);
        }
        return;
      }

      const link = target.closest('.wy-menu-vertical a[href]');
      if (!link || !scope.contains(link)) {
        return;
      }

      const node = link.closest('li');
      if (!node) {
        return;
      }

      const isBranch = Array.from(node.children).some((child) => child.tagName === 'UL');
      const isCurrentLeaf = link.classList.contains('current') && !isBranch;
      const href = link.getAttribute('href') || '';
      const isSamePageAnchor = href.startsWith('#') && href !== '#';
      const hasHashTarget = href.includes('#') && !href.endsWith('#');

      if (isBranch) {
        event.preventDefault();
        event.stopPropagation();
        toggleBranch(node);
        return;
      }

      if (!isBranch) {
        if (isCurrentLeaf) {
          event.preventDefault();
          return;
        }

        if (isSamePageAnchor) {
          // Let the browser handle same-page anchors normally.
          return;
        }

        // Use full-page navigation for cross-page leaf links so the sidebar DOM
        // stays in sync with the destination page's local anchor structure.
        var resolvedHref = link.dataset.axclHrefResolved || href;
        if (!isExternalHref(resolvedHref) && !isHomepageActive()) {
          syncState();
          persistSidebarScroll();
          if (hasHashTarget) {
            writeContentScrollResetFlag();
          }
          return;
        }


        // Fallback: full-page navigation for external or homepage links.
        syncState();
        persistSidebarScroll();
      }
    }, true);

    // Language switch listeners are bound by bindLanguageSwitchListeners() above.

    const observer = new MutationObserver(() => {
      if (!applyingSidebarState) {
        scheduleSidebarStateRestore();
      }
    });
    getBranchItems(scope).forEach((node) => {
      observer.observe(node, {
        attributes: true,
        attributeFilter: ['class', 'aria-expanded'],
      });
    });

    function patchThemeNavigation() {
      const navigation = window.SphinxRtdTheme && window.SphinxRtdTheme.Navigation;
      if (!navigation || navigation.axclSidebarPatched === true) {
        return Boolean(navigation);
      }

      function getSidebarScrollTop() {
        const sideScroll = document.querySelector('.wy-side-scroll');
        return sideScroll ? sideScroll.scrollTop : null;
      }

      function restoreSidebarScrollTop(scrollTop) {
        if (scrollTop === null || typeof scrollTop === 'undefined') {
          return;
        }
        const sideScroll = document.querySelector('.wy-side-scroll');
        if (!sideScroll) {
          return;
        }
        sideScroll.scrollTop = scrollTop;
      }

      ['reset', 'toggleCurrent'].forEach((methodName) => {
        const original = navigation[methodName];
        if (typeof original !== 'function') {
          return;
        }

        navigation[methodName] = function () {
          const scrollTopBefore = getSidebarScrollTop();
          const result = original.apply(this, arguments);
          restoreSidebarScrollTop(scrollTopBefore);
          window.requestAnimationFrame(() => restoreSidebarScrollTop(scrollTopBefore));
          window.setTimeout(() => restoreSidebarScrollTop(scrollTopBefore), 0);
          scheduleSidebarStateRestore();
          window.setTimeout(applySidebarState, 0);
          return result;
        };
      });

      if (typeof navigation.onScroll === 'function') {
        navigation.onScroll = function () {
          this.winScroll = false;
          this.winPosition = this.win ? this.win.scrollTop() : 0;
        };
      }

      navigation.axclSidebarPatched = true;
      return true;
    }

    window.history.scrollRestoration = "manual";
    patchThemeNavigation();
    restoreSidebarScroll();
    window.requestAnimationFrame(applySidebarState);
    window.requestAnimationFrame(restoreSidebarScroll);
    window.requestAnimationFrame(revealSidebarCurrentNodeIfNeeded);
    window.requestAnimationFrame(patchThemeNavigation);
    window.setTimeout(applySidebarState, 0);
    window.setTimeout(restoreSidebarScroll, 0);
    window.setTimeout(revealSidebarCurrentNodeIfNeeded, 0);
    window.setTimeout(patchThemeNavigation, 0);
    window.setTimeout(patchThemeNavigation, 50);
    window.setTimeout(applySidebarState, 50);
    window.setTimeout(restoreSidebarScroll, 50);
    window.setTimeout(revealSidebarCurrentNodeIfNeeded, 50);
    window.setTimeout(resetContentScrollIfNeeded, 50);
    window.setTimeout(() => updateLanguageSwitchTargets(tree), 50);
    window.addEventListener("load", applySidebarState, { once: true });
    window.addEventListener("load", restoreSidebarScroll, { once: true });
    window.addEventListener("load", revealSidebarCurrentNodeIfNeeded, { once: true });
    window.addEventListener("load", patchThemeNavigation, { once: true });
    window.addEventListener("load", resetContentScrollIfNeeded, { once: true });
    window.addEventListener("pageshow", revealSidebarCurrentNodeIfNeeded, { once: true });
    window.addEventListener("pageshow", resetContentScrollIfNeeded, { once: true });
    window.addEventListener("load", () => updateLanguageSwitchTargets(tree), { once: true });
    window.addEventListener("beforeunload", () => {
      syncState();
      persistSidebarScroll();
    });

    // Handle browser back / forward after SPA navigation.
    window.addEventListener("popstate", function() {
      performSPANavigation(window.location.href, true);
    });

    // sphinx_rtd_theme binds hashchange -> Navigation.reset(), which rewrites
    // `.wy-menu-vertical .current` and can wipe manual branch expand state.
    // Re-apply our persisted sidebar state after hash changes.
    window.addEventListener("hashchange", () => {
      updateSidebarForNewPage(window.location.href);
      window.requestAnimationFrame(applySidebarState);
      window.requestAnimationFrame(restoreSidebarScroll);
      window.requestAnimationFrame(revealSidebarCurrentNodeIfNeeded);
      window.requestAnimationFrame(resetContentScrollIfNeeded);
      window.requestAnimationFrame(() => updateLanguageSwitchTargets(tree));
      window.setTimeout(applySidebarState, 0);
      window.setTimeout(restoreSidebarScroll, 0);
      window.setTimeout(revealSidebarCurrentNodeIfNeeded, 0);
      window.setTimeout(revealSidebarCurrentNodeIfNeeded, 50);
      window.setTimeout(resetContentScrollIfNeeded, 0);
      window.setTimeout(resetContentScrollIfNeeded, 50);
      window.setTimeout(() => updateLanguageSwitchTargets(tree), 0);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var tree = document.querySelector(".axcl-sidebar");

    function revealSidebar() {
      // Add the transition class first, then remove the hiding class on the
      // next frame so the CSS transition triggers a smooth fade-in.
      document.documentElement.classList.add("axcl-nav-ready");
      window.requestAnimationFrame(function () {
        document.documentElement.classList.remove("axcl-nav-pending");
      });
    }

    if (tree) {
      bindTree(tree);
      // Double-rAF ensures Sphinx RTD theme's own init has run and the sidebar
      // DOM is fully settled before we reveal.
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          bindTree(tree);
          revealSidebar();
        });
      });
    } else {
      revealSidebar();
    }
  });
})();
