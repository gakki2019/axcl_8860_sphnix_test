(function () {
  function isExternalHref(href) {
    return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:');
  }

  function getStateKey(lang) {
    return `axcl-sidebar-state-${lang}`;
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

  function normalizeHref(href) {
    if (!href || href.startsWith('#') || isExternalHref(href)) {
      return href;
    }
    return href.replace(/^(?:\.\.\/)?(?:zh|en)\//, '');
  }

  function getBranchItems(tree) {
    return Array.from(tree.querySelectorAll('li')).filter((node) => {
      const hasDirectList = Array.from(node.children).some((child) => child.tagName === 'UL');
      const link = Array.from(node.children).find((child) => child.tagName === 'A') || null;
      const href = link ? link.getAttribute('href') || '' : '';
      return hasDirectList && Boolean(link) && href !== '#';
    });
  }

  function getBranchLink(node) {
    return Array.from(node.children).find((child) => child.tagName === 'A') || null;
  }

  function getLanguageRoot(tree) {
    if (tree.dataset.homepage !== 'true') {
      return tree;
    }

    const lang = tree.dataset.lang || 'zh';
    const rootNode = Array.from(tree.children).find((node) => {
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

    if (!rootNode) {
      return tree;
    }

    const rootList = Array.from(rootNode.children).find((child) => child.tagName === 'UL') || null;
    return rootList || tree;
  }

  function collectBranchState(tree) {
    const state = {};
    getBranchItems(tree).forEach((node) => {
      const link = getBranchLink(node);
      const href = link ? link.getAttribute('href') : '';
      const normalizedHref = normalizeHref(href);
      if (normalizedHref) {
        state[normalizedHref] = node.classList.contains('current');
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
      const link = getBranchLink(node);
      const href = normalizeHref(link ? link.getAttribute('href') : '');
      const shouldOpen = href && Object.prototype.hasOwnProperty.call(state, href)
        ? Boolean(state[href])
        : node.classList.contains('current') || node.classList.contains('toctree-l2');
      node.classList.toggle('current', shouldOpen);
      node.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    });
  }

  function bindTree(tree) {
    if (tree.dataset.axclBound === 'true') {
      return;
    }
    tree.dataset.axclBound = 'true';

    const stateKey = getStateKey(tree.dataset.lang || 'zh');
    const isHomepage = tree.dataset.homepage === 'true';
    const scope = getLanguageRoot(tree);
    const state = readState(stateKey);
    applyState(scope, state);

    function resetSidebarScroll() {
      const sideScroll = document.querySelector(".wy-side-scroll");
      if (sideScroll) {
        sideScroll.scrollTop = 0;
      }
    }

    function syncState() {
      writeState(stateKey, collectBranchState(scope));
    }

    function toggleBranch(node) {
      const nextOpen = !node.classList.contains('current');
      node.classList.toggle('current', nextOpen);
      node.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
      syncState();
    }

    if (isHomepage) {
      getBranchItems(scope).forEach((node) => {
        const link = getBranchLink(node);
        const href = normalizeHref(link ? link.getAttribute('href') : '');
        if (href && !Object.prototype.hasOwnProperty.call(state, href)) {
          node.classList.add('current');
          node.setAttribute('aria-expanded', 'true');
        }
      });
    }

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

      if (isRootWrapper) {
        event.preventDefault();
        return;
      }

      if (isCurrentLeaf) {
        event.preventDefault();
        resetSidebarScroll();
      }
    }, true);

    document.querySelectorAll(".axcl-language-switch .axcl-language-link[data-lang-target]").forEach((link) => {
      link.addEventListener("click", () => {
        persistTranslatedState(tree, link.dataset.langTarget);
      });
    });

    function forceSidebarScrollTop() {
      let attempts = 0;
      function tick() {
        resetSidebarScroll();
        attempts += 1;
        if (attempts < 12) {
          window.requestAnimationFrame(tick);
        }
      }
      tick();
    }

    window.history.scrollRestoration = "manual";
    forceSidebarScrollTop();
    window.requestAnimationFrame(forceSidebarScrollTop);
    window.setTimeout(forceSidebarScrollTop, 0);
    window.addEventListener("load", forceSidebarScrollTop, { once: true });
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