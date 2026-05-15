(function () {
  const stateKey = "axcl-sidebar-state";

  function readState() {
    try {
      return JSON.parse(window.localStorage.getItem(stateKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeState(state) {
    try {
      window.localStorage.setItem(stateKey, JSON.stringify(state));
    } catch (error) {
      // Ignore storage failures and keep navigation usable.
    }
  }

  function applyState(tree, state) {
    tree.querySelectorAll(".axcl-nav-node.is-branch").forEach((node) => {
      const key = node.dataset.nodeKey;
      const toggle = node.querySelector(":scope > .axcl-nav-row > .axcl-nav-toggle");
      const shouldOpen = Object.prototype.hasOwnProperty.call(state, key)
        ? Boolean(state[key])
        : node.classList.contains("is-default-open") || node.classList.contains("is-current-branch");
      node.classList.toggle("is-open", shouldOpen);
      if (toggle) {
        toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      }
    });
  }

  function bindTree(tree) {
    const state = readState();
    applyState(tree, state);

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
        writeState(state);
      }

      if (toggle) {
        toggle.addEventListener("click", toggleNode);
      }
      if (label) {
        label.addEventListener("click", toggleNode);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const tree = document.querySelector(".axcl-sidebar");
    if (tree) {
      bindTree(tree);
    }
    document.documentElement.classList.remove("axcl-nav-pending");
  });
})();