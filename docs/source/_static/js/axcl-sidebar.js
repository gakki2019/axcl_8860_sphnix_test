(function () {
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

  function translateKey(key, fromLang, toLang) {
    const fromPrefix = `${fromLang}/`;
    const toPrefix = `${toLang}/`;
    if (key === fromLang) {
      return toLang;
    }
    if (key.startsWith(fromPrefix)) {
      return toPrefix + key.slice(fromPrefix.length);
    }
    return key;
  }

  function collectBranchState(tree) {
    const state = {};
    tree.querySelectorAll('.axcl-nav-node.is-branch[data-node-key]').forEach((node) => {
      state[node.dataset.nodeKey] = node.classList.contains('is-open');
    });
    return state;
  }

  function persistTranslatedState(tree, targetLang) {
    const sourceLang = tree.dataset.lang || 'zh';
    if (sourceLang === targetLang) {
      return;
    }
    const sourceState = collectBranchState(tree);
    const translatedState = {};
    Object.entries(sourceState).forEach(([key, value]) => {
      translatedState[translateKey(key, sourceLang, targetLang)] = value;
    });
    writeState(getStateKey(targetLang), translatedState);
  }

  function applyState(tree, state) {
    tree.querySelectorAll(".axcl-nav-node.is-branch").forEach((node) => {
      const key = node.dataset.nodeKey;
      const toggle = node.querySelector(":scope > .axcl-nav-row > .axcl-nav-toggle");
      const shouldOpen = Object.prototype.hasOwnProperty.call(state, key)
        ? Boolean(state[key])
        : node.classList.contains("is-default-open") || node.classList.contains("is-current-path") || node.classList.contains("is-current");
      node.classList.toggle("is-open", shouldOpen);
      if (toggle) {
        toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      }
    });
  }

  function bindTree(tree) {
    const stateKey = getStateKey(tree.dataset.lang || 'zh');
    const state = readState(stateKey);
    applyState(tree, state);
    let activeHoverNode = null;

    function resetSidebarScroll() {
      const sideScroll = document.querySelector(".wy-side-scroll");
      if (sideScroll) {
        sideScroll.scrollTop = 0;
      }
    }

    function clearHover() {
      if (!activeHoverNode) {
        return;
      }
      const row = activeHoverNode.querySelector(":scope > .axcl-nav-row");
      const link = activeHoverNode.querySelector(":scope > .axcl-nav-row > .axcl-nav-link");
      activeHoverNode.classList.remove("is-hovered");
      if (row) {
        row.style.removeProperty("background-color");
      }
      if (link) {
        link.style.removeProperty("color");
        link.style.removeProperty("-webkit-text-fill-color");
        link.style.removeProperty("background-color");
      }
      activeHoverNode = null;
    }

    function setHover(node) {
      if (!node || node === activeHoverNode) {
        return;
      }
      clearHover();
      activeHoverNode = node;
      const row = node.querySelector(":scope > .axcl-nav-row");
      const link = node.querySelector(":scope > .axcl-nav-row > .axcl-nav-link");
      node.classList.add("is-hovered");
      if (row) {
        row.style.setProperty("background-color", "transparent", "important");
      }
      if (link) {
        link.style.setProperty("color", "#ff5a5f", "important");
        link.style.setProperty("-webkit-text-fill-color", "#ff5a5f", "important");
        link.style.setProperty("background-color", "transparent", "important");
      }
    }

    tree.querySelectorAll(".axcl-nav-node.is-branch").forEach((node) => {
      const key = node.dataset.nodeKey;
      const toggle = node.querySelector(":scope > .axcl-nav-row > .axcl-nav-toggle");
      const label = node.querySelector(":scope > .axcl-nav-row > .axcl-nav-link--branch");

      function toggleNode(event) {
        event.preventDefault();
        const nextOpen = !node.classList.contains("is-open");
        node.classList.toggle("is-open", nextOpen);
        if (toggle) {
          toggle.setAttribute("aria-expanded", nextOpen ? "true" : "false");
        }
        state[key] = nextOpen;
        writeState(stateKey, state);
      }

      if (toggle) {
        toggle.addEventListener("click", toggleNode);
      }
      if (label) {
        label.addEventListener("click", toggleNode);
      }
    });

    document.querySelectorAll(".axcl-language-switch .axcl-language-link[data-lang-target]").forEach((link) => {
      link.addEventListener("click", () => {
        persistTranslatedState(tree, link.dataset.langTarget);
      });
    });

    tree.querySelectorAll(".axcl-nav-link.is-current").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });

    tree.addEventListener("mouseover", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const row = target ? target.closest(".axcl-nav-row") : null;
      if (!row || !tree.contains(row)) {
        return;
      }
      setHover(row.closest(".axcl-nav-node"));
    });

    tree.addEventListener("mouseout", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const row = target ? target.closest(".axcl-nav-row") : null;
      if (!row || !tree.contains(row)) {
        return;
      }
      const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (related && row.contains(related)) {
        return;
      }
      if (row.closest(".axcl-nav-node") === activeHoverNode) {
        clearHover();
      }
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
      bindTree(tree);
    }
    window.requestAnimationFrame(() => {
      document.documentElement.classList.remove("axcl-nav-pending");
    });
  });
})();