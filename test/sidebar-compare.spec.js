const { test, expect } = require('playwright/test');
const { getChromiumPreflight } = require('./support/playwright-env.cjs');

const preflight = getChromiumPreflight();
const remoteIndex = 'https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/index.html';
const skipReason = preflight.missingLibraries.length
  ? `Chromium runtime dependencies are missing: ${preflight.missingLibraries.join(', ')}`
  : `Chromium runtime is unavailable: ${(preflight.diagnostics[0] || 'unknown reason')}`;

function parsePx(value) {
  return Number.parseFloat(String(value || '0').replace('px', ''));
}

async function readStyles(page, selectors) {
  return page.evaluate((input) => {
    function stylesFor(selector, pseudoElement) {
      const element = document.querySelector(selector);
      if (!element) {
        return null;
      }
      const style = window.getComputedStyle(element, pseudoElement || undefined);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color,
        paddingLeft: style.paddingLeft,
        transform: style.transform,
        borderLeftColor: style.borderLeftColor,
        display: style.display,
      };
    }

    return {
      sidebar: stylesFor(input.sidebar),
      search: stylesFor(input.search),
      topLevel: stylesFor(input.topLevel),
      nestedLevel: stylesFor(input.nestedLevel),
      currentRow: stylesFor(input.currentRow),
      toggleIcon: stylesFor(input.toggleIcon, '::before'),
      children: stylesFor(input.children),
    };
  }, selectors);
}

test.describe('AXCL sidebar comparison', () => {
  test.skip(!preflight.ok, skipReason);

  test('matches key sidebar colors and spacing against esp-idf', async ({ page, context }) => {
    await page.goto('/zh/index.html', { waitUntil: 'networkidle' });
    const referencePage = await context.newPage();
    await referencePage.goto(remoteIndex, { waitUntil: 'domcontentloaded' });

    const localSelectors = {
      sidebar: '.wy-nav-side',
      search: '.wy-side-nav-search',
      topLevel: '.axcl-nav-node.level-1 > .axcl-nav-row',
      nestedLevel: '.axcl-nav-node.level-2 > .axcl-nav-row',
      currentRow: '.axcl-nav-node.is-current-branch > .axcl-nav-row',
      toggleIcon: '.axcl-nav-node.level-1.is-branch > .axcl-nav-row > .axcl-nav-toggle',
      children: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-children',
    };
    const remoteSelectors = {
      sidebar: '.wy-nav-side',
      search: '.wy-side-nav-search',
      topLevel: '.wy-menu-vertical li.toctree-l1 > a',
      nestedLevel: '.wy-menu-vertical li.current ul li a',
      currentRow: '.wy-menu-vertical li.current > a',
      toggleIcon: '.wy-menu-vertical li.current > a button.toctree-expand',
      children: '.wy-menu-vertical li.current ul',
    };

    const localBeforeHover = await readStyles(page, localSelectors);
    const remoteBeforeHover = await readStyles(referencePage, remoteSelectors);

    await page.locator('.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row').hover();
    await referencePage.locator('.wy-menu-vertical li.toctree-l1 > a').first().hover();

    const localAfterHover = await readStyles(page, localSelectors);
    const remoteAfterHover = await readStyles(referencePage, remoteSelectors);

    expect(localBeforeHover.sidebar.backgroundColor).toBe(remoteBeforeHover.sidebar.backgroundColor);
    expect(localBeforeHover.search.backgroundColor).toBe(remoteBeforeHover.search.backgroundColor);
    expect(localBeforeHover.currentRow.backgroundColor).toBe(remoteBeforeHover.currentRow.backgroundColor);
    expect(localAfterHover.topLevel.backgroundColor).toBe(remoteAfterHover.topLevel.backgroundColor);

    expect(parsePx(localBeforeHover.topLevel.paddingLeft)).toBeGreaterThanOrEqual(parsePx(remoteBeforeHover.topLevel.paddingLeft) - 4);
    expect(parsePx(localBeforeHover.topLevel.paddingLeft)).toBeLessThanOrEqual(parsePx(remoteBeforeHover.topLevel.paddingLeft) + 8);
    expect(parsePx(localBeforeHover.nestedLevel.paddingLeft)).toBeGreaterThan(parsePx(localBeforeHover.topLevel.paddingLeft));

    await referencePage.close();
  });

  test('keeps collapse and expand state with icon feedback', async ({ page }) => {
    await page.goto('/zh/index.html', { waitUntil: 'networkidle' });

    const branchRow = page.locator('.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row');
    const toggle = page.locator('.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row > .axcl-nav-toggle');
    const children = page.locator('.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-children');

    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(children).toBeVisible();

    const beforeCollapse = await readStyles(page, {
      toggleIcon: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row > .axcl-nav-toggle',
      children: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-children',
    });

    await branchRow.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(children).toBeHidden();

    const afterCollapse = await readStyles(page, {
      toggleIcon: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row > .axcl-nav-toggle',
      children: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-children',
    });

    expect(beforeCollapse.toggleIcon.transform).not.toBe(afterCollapse.toggleIcon.transform);
    expect(afterCollapse.children.display).toBe('none');

    await page.reload({ waitUntil: 'networkidle' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await branchRow.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(children).toBeVisible();
  });
});
