(function () {
  function isExternalHref(href) {
    return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:');
  }

  function getStateKey(lang) {
    return `axcl-sidebar-state-${lang}`;
  }

  function getScrollKey(lang) {
    return `axcl-sidebar-scroll-${lang}`;
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

  function getBranchItems(tree) {
    return Array.from(tree.querySelectorAll('li')).filter((node) => {
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

    const descendant = Array.from(node.querySelectorAll('ul a[href]')).find((anchor) => {
      const candidate = toStateKey(anchor.getAttribute('href') || '');
      return Boolean(candidate);
    }) || null;
    if (descendant) {
      return toStateKey(descendant.getAttribute('href') || '');
    }

    return '';
  }

  function getLanguageRoot(tree) {
    const topList = Array.from(tree.children).find((node) => node.tagName === 'UL') || null;
    if (topList) {
      const activeRootNode = Array.from(topList.children).find((node) => {
        if (node.tagName !== 'LI') {
          return false;
        }
        return node.querySelector('a.current') !== null;
      }) || null;

      if (activeRootNode) {
        const activeRootList = Array.from(activeRootNode.children).find((child) => child.tagName === 'UL') || null;
        if (activeRootList) {
          return activeRootList;
        }
      }
    }

    if (tree.dataset.homepage !== 'true') {
      return tree;
    }

    const lang = tree.dataset.lang || 'zh';
    const rootNode = topList
      ? Array.from(topList.children).find((node) => {
          if (node.tagName !== 'LI') {
            return false;
          }
          const link = getBranchLink(node);
          const href = link ? link.getAttribute('href') || '' : '';
          return href === '#'
            || href === `${lang}/index.html`
            || href.endsWith(`/${lang}/index.html`)
            || href.endsWith(`../${lang}/index.html`);
        }) || null
      : null;

    if (!rootNode) {
      return tree;
    }

    const rootList = Array.from(rootNode.children).find((child) => child.tagName === 'UL') || null;
    return rootList || tree;
  }

  function getHomepageRootNode(tree) {
    if (tree.dataset.homepage !== 'true') {
      return null;
    }

    const lang = tree.dataset.lang || 'zh';
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
      return href === '#'
        || href === `${lang}/index.html`
        || href.endsWith(`/${lang}/index.html`)
        || href.endsWith(`../${lang}/index.html`);
    }) || null;
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
    const sourceState = collectBranchState(tree);
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
      } else if (containsCurrent) {
        // Without saved user preference, expand branches containing active page.
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
    const isHomepage = tree.dataset.homepage === 'true';
    const scope = getLanguageRoot(tree);
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

    function restoreSidebarScroll() {
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

    function syncState() {
      writeState(stateKey, collectBranchState(scope));
    }

    function toggleBranch(node) {
      const nextOpen = !isExpanded(node);
      setExpanded(node, nextOpen);
      syncState();
    }

    function applyHomepageDefaults() {
      if (!isHomepage) {
        return;
      }

      if (!homepageDefaultsApplied) {
        homepageDefaultsApplied = true;

        getBranchItems(scope).forEach((node) => {
          const shouldOpen = node.classList.contains('toctree-l2');
          setExpanded(node, shouldOpen);
        });

        syncState();
      } else {
        const state = readState(stateKey);
        const hasSavedState = Object.keys(state).length > 0;

        if (hasSavedState) {
          applyState(scope, state);
        }
      }
    }

    var applyingSidebarState = false;
    var restoreScheduled = false;
    var homepageDefaultsApplied = false;

    function applySidebarState() {
      applyingSidebarState = true;
      if (isHomepage) {
        applyHomepageDefaults();
      } else {
        applyState(scope, readState(stateKey));
      }

      window.setTimeout(() => {
        applyingSidebarState = false;
      }, 0);
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

    applySidebarState();

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
      const isRootWrapper = link.getAttribute('href') === '#';
      const isCurrentLeaf = link.classList.contains('current') && !isBranch;
      const href = link.getAttribute('href') || '';
      const isInPageAnchor = href.startsWith('#') && href !== '#';

      if (isRootWrapper) {
        event.preventDefault();
        return;
      }

      if (!isBranch) {
        event.stopPropagation();
      }

      if (!isBranch && !isInPageAnchor) {
        // Persist sidebar state before full-page navigation.
        // For in-page anchors, hashchange recovery will re-apply state.
        syncState();
        persistSidebarScroll();
      }

      if (isCurrentLeaf) {
        event.preventDefault();
      }
    }, true);

    document.querySelectorAll(".axcl-language-switch .axcl-language-link[data-lang-target]").forEach((link) => {
      link.addEventListener("click", () => {
        persistTranslatedState(tree, link.dataset.langTarget);
      });
    });

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
      navigation.axclSidebarPatched = true;
      return true;
    }

    window.history.scrollRestoration = "manual";
    patchThemeNavigation();
    restoreSidebarScroll();
    window.requestAnimationFrame(applySidebarState);
    window.requestAnimationFrame(restoreSidebarScroll);
    window.requestAnimationFrame(patchThemeNavigation);
    window.setTimeout(applySidebarState, 0);
    window.setTimeout(restoreSidebarScroll, 0);
    window.setTimeout(patchThemeNavigation, 0);
    window.setTimeout(patchThemeNavigation, 50);
    window.setTimeout(applySidebarState, 50);
    window.setTimeout(restoreSidebarScroll, 50);
    window.addEventListener("load", applySidebarState, { once: true });
    window.addEventListener("load", restoreSidebarScroll, { once: true });
    window.addEventListener("load", patchThemeNavigation, { once: true });
    window.addEventListener("beforeunload", () => {
      syncState();
      persistSidebarScroll();
    });

    // sphinx_rtd_theme binds hashchange -> Navigation.reset(), which rewrites
    // `.wy-menu-vertical .current` and can wipe manual branch expand state.
    // Re-apply our persisted sidebar state after hash changes.
    window.addEventListener("hashchange", () => {
      window.requestAnimationFrame(applySidebarState);
      window.requestAnimationFrame(restoreSidebarScroll);
      window.setTimeout(applySidebarState, 0);
      window.setTimeout(restoreSidebarScroll, 0);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const tree = document.querySelector(".axcl-sidebar");
    if (tree) {
      const run = () => {
        bindTree(tree);
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            bindTree(tree);
            window.requestAnimationFrame(() => {
              document.documentElement.classList.remove("axcl-nav-pending");
            });
          });
        });
      };
      if (document.readyState === "complete") {
        run();
      } else {
        run();
      }
    } else {
      window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("axcl-nav-pending");
      });
    }
  });
})();
