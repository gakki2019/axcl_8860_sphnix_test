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
      hoverRow: stylesFor(input.hoverRow),
      ancestorRow: stylesFor(input.ancestorRow),
    };
  }, selectors);
}

function normalizeNavKeys(keys) {
  return keys.map((key) => String(key || '').replace(/^(zh|en)\//, ''));
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
      currentRow: '.axcl-nav-node.is-current > .axcl-nav-row',
      hoverRow: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row > .axcl-nav-link',
      ancestorRow: '.axcl-nav-node[data-node-key="zh/develop/c"] > .axcl-nav-row',
      toggleIcon: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row > .axcl-nav-toggle',
      children: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-children',
    };

    const localBeforeHover = await readStyles(page, localSelectors);

    await page.locator('.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row > .axcl-nav-link').hover();
    await page.waitForTimeout(300);
    await referencePage.close();

    const localAfterHover = await readStyles(page, localSelectors);

    expect(localBeforeHover.sidebar.backgroundColor).toBe('rgb(52, 49, 49)');
    expect(localBeforeHover.search.backgroundColor).toBe('rgb(227, 227, 227)');
    expect(localAfterHover.hoverRow.color).toBe('rgb(255, 90, 95)');
    expect(localAfterHover.ancestorRow.backgroundColor).toBe(localBeforeHover.ancestorRow.backgroundColor);

    expect(parsePx(localBeforeHover.nestedLevel.paddingLeft)).toBeGreaterThan(parsePx(localBeforeHover.topLevel.paddingLeft));
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
    });

    await branchRow.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(children).toBeHidden();

    const afterCollapse = await readStyles(page, {
      toggleIcon: '.axcl-nav-node[data-node-key="zh/develop"] > .axcl-nav-row > .axcl-nav-toggle',
    });

    expect(beforeCollapse).toBeTruthy();
    expect(afterCollapse).toBeTruthy();

    await page.reload({ waitUntil: 'networkidle' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await branchRow.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(children).toBeVisible();
  });

  test('keeps ancestor backgrounds clear and resets sidebar scroll on deep pages', async ({ page }) => {
    await page.goto('/zh/develop/c/device_api.html', { waitUntil: 'networkidle' });

    const deviceStyles = await page.evaluate(() => {
      const parentRow = document.querySelector('.axcl-nav-node[data-node-key="zh/develop/c"] > .axcl-nav-row');
      const selectedRow = document.querySelector('.axcl-nav-node.level-3.is-current > .axcl-nav-row');
      const sideScroll = document.querySelector('.wy-side-scroll');
      return {
        parentBackground: parentRow ? getComputedStyle(parentRow).backgroundColor : null,
        selectedBackground: selectedRow ? getComputedStyle(selectedRow).backgroundColor : null,
        sideScrollTop: sideScroll ? sideScroll.scrollTop : null,
      };
    });

    expect(deviceStyles.parentBackground).toBe('rgba(0, 0, 0, 0)');
    expect(deviceStyles.selectedBackground).toBe('rgb(227, 227, 227)');
    expect(deviceStyles.sideScrollTop).toBe(0);

    await page.goto('/zh/develop/c/memory_api.html', { waitUntil: 'networkidle' });
    const memoryScrollTop = await page.evaluate(() => {
      const sideScroll = document.querySelector('.wy-side-scroll');
      return sideScroll ? sideScroll.scrollTop : null;
    });

    expect(memoryScrollTop).toBe(0);
  });

  test('resets sidebar scroll when clicking Memory API again', async ({ page }) => {
    await page.goto('/zh/develop/c/memory_api.html', { waitUntil: 'networkidle' });

    const beforeScrollTop = await page.evaluate(() => {
      const sideScroll = document.querySelector('.wy-side-scroll');
      return sideScroll ? sideScroll.scrollTop : null;
    });

    await page.locator('.axcl-nav-node.level-3.is-current > .axcl-nav-row > .axcl-nav-link').click({ force: true });
    await page.waitForTimeout(100);

    const scrollTop = await page.evaluate(() => {
      const sideScroll = document.querySelector('.wy-side-scroll');
      return sideScroll ? sideScroll.scrollTop : null;
    });

    expect(beforeScrollTop).toBe(0);
    expect(scrollTop).toBe(0);
  });

  test('keeps Device API aligned when switching languages', async ({ page }) => {
    await page.goto('/zh/develop/c/device_api.html', { waitUntil: 'networkidle' });

    const zhState = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
      openKeys: [...document.querySelectorAll('.axcl-nav-node.is-open[data-node-key]')].map((el) => el.getAttribute('data-node-key')),
      englishHref: document.querySelector('.axcl-language-switch .axcl-language-link[href]')?.getAttribute('href') || null,
    }));

    expect(zhState.title).toContain('设备 API');
    expect(zhState.heading).toContain('设备 API');
    expect(zhState.englishHref).toContain('/en/develop/c/device_api.html');

    await page.locator('.axcl-language-switch .axcl-language-link[href]').click();
    await page.waitForLoadState('networkidle');

    const enState = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
      openKeys: [...document.querySelectorAll('.axcl-nav-node.is-open[data-node-key]')].map((el) => el.getAttribute('data-node-key')),
    }));

    expect(enState.title).toContain('Device API');
    expect(enState.heading).toContain('Device API');
    expect(normalizeNavKeys(enState.openKeys)).toEqual(normalizeNavKeys(zhState.openKeys));
  });
});
