const { test, expect } = require('playwright/test');
const { getChromiumPreflight } = require('./support/playwright-env.cjs');

const preflight = getChromiumPreflight();
const skipReason = preflight.missingLibraries.length
    ? `Chromium runtime dependencies are missing: ${preflight.missingLibraries.join(', ')}`
    : `Chromium runtime is unavailable: ${(preflight.diagnostics[0] || 'unknown reason')}`;

const docsOrigin = 'http://127.0.0.1:18080';

function normalizeNavKeys(keys) {
    return keys
        .map((key) => String(key || ''))
        .filter((key) => key && key !== '#')
        .map((key) => key.replace(/^(?:\.\.\/)+/, '').replace(/^(?:zh|en)\//, ''));
}

function sidebarRoot(page) {
    return page.locator('.axcl-sidebar > ul').first();
}

function branchLocator(page, label) {
    return sidebarRoot(page).locator(`li:has(> a:has-text(${JSON.stringify(label)}))`).first();
}

function branchToggleLocator(page, label) {
    return branchLocator(page, label).locator(':scope > a > button.toctree-expand').first();
}

function branchChildrenLocator(page, label) {
    return branchLocator(page, label).locator(':scope > ul');
}

function branchLinkLocator(page, label) {
    return branchLocator(page, label).locator(':scope > a').first();
}

async function gotoDocsPage(page, path) {
    const url = path.startsWith('http://') || path.startsWith('https://')
        ? path
        : new URL(path, docsOrigin).toString();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch (error) {
        if (!String(error).includes('ERR_ABORTED')) {
            throw error;
        }
    }

    await page.evaluate(() => {
        window.localStorage.removeItem('axcl-sidebar-state-zh');
        window.localStorage.removeItem('axcl-sidebar-state-en');
    });

    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });

    await sidebarRoot(page).waitFor({ state: 'attached', timeout: 15000 });
    await sidebarRoot(page).locator('li').first().waitFor({ state: 'attached', timeout: 15000 });
}

async function readSidebarState(page) {
    return page.evaluate(() => ({
        title: document.title,
        heading: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
        path: window.location.pathname,
        openKeys: [...document.querySelectorAll('.axcl-sidebar > ul li.current')]
            .map((el) => el.querySelector(':scope > a')?.getAttribute('href') || null)
            .filter((href) => href && href !== '#'),
        currentHref: document.querySelector('.axcl-sidebar > ul a.current[href]:not([href="#"])')?.getAttribute('href') || null,
    }));
}

async function readBranchState(page, label) {
    return branchLocator(page, label).evaluate((node) => ({
        expanded: node.getAttribute('aria-expanded'),
        visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        current: node.classList.contains('current'),
        text: node.querySelector(':scope > a') ? node.querySelector(':scope > a').textContent.trim() : null,
        href: node.querySelector(':scope > a') ? node.querySelector(':scope > a').getAttribute('href')?.replace(/^(?:\.\.\/)+/, '').replace(/^(?:zh|en)\//, '') : null,
    }));
}

async function readHomepageLevelState(page, rootHref, label) {
    return page.locator(`.axcl-sidebar > ul > li:has(> a[href="${rootHref}"])`).first().locator(`ul > li:has(> a:has-text(${JSON.stringify(label)}))`).first().evaluate((node) => ({
        expanded: node.getAttribute('aria-expanded'),
        visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        current: node.classList.contains('current'),
        text: node.querySelector(':scope > a') ? node.querySelector(':scope > a').textContent.trim() : null,
        href: node.querySelector(':scope > a') ? node.querySelector(':scope > a').getAttribute('href') : null,
    }));
}

test.describe('AXCL sidebar navigation', () => {
    test.skip(!preflight.ok, skipReason);

    test('homepage shows only the Chinese navigation', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        await expect(page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])')).toBeVisible();
        await expect(page.locator('.axcl-sidebar > ul > li:has(> a[href="en/index.html"])')).toBeHidden();
    });

    test('homepage keeps first level open and second level closed by default', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])').first();
        const zhBasic = zhRoot.locator('ul > li:has(> a:has-text("基础"))').first();
        const zhDevelop = zhRoot.locator('ul > li:has(> a:has-text("开发"))').first();
        const zhFaq = zhRoot.locator('ul > li:has(> a:has-text("常见问题"))').first();
        const zhOverview = zhBasic.locator('ul > li:has(> a:has-text("概览"))').first();
        const zhInstall = zhBasic.locator('ul > li:has(> a:has-text("安装指南"))').first();
        const zhQuickStart = zhBasic.locator('ul > li:has(> a:has-text("快速开始"))').first();
        const zhDevelopArch = zhDevelop.locator('ul > li:has(> a:has-text("架构"))').first();
        const zhDevelopCpp = zhDevelop.locator('ul > li:has(> a:has-text("C/C++"))').first();

        await expect(zhBasic).toHaveAttribute('aria-expanded', 'true');
        await expect(zhDevelop).toHaveAttribute('aria-expanded', 'true');
        await expect(zhFaq).toHaveAttribute('aria-expanded', 'true');

        await expect(zhOverview).toHaveAttribute('aria-expanded', 'false');
        await expect(zhInstall).toHaveAttribute('aria-expanded', 'false');
        await expect(zhQuickStart).toHaveAttribute('aria-expanded', 'false');
        await expect(zhDevelopArch).toHaveAttribute('aria-expanded', 'false');
        await expect(zhDevelopCpp).toHaveAttribute('aria-expanded', 'false');

        await expect(zhOverview.locator(':scope > ul')).toHaveCSS('display', 'none');
        await expect(zhInstall.locator(':scope > ul')).toHaveCSS('display', 'none');
        await expect(zhQuickStart.locator(':scope > ul')).toHaveCSS('display', 'none');
        await expect(zhDevelopArch.locator(':scope > ul')).toHaveCSS('display', 'none');
        await expect(zhDevelopCpp.locator(':scope > ul')).toHaveCSS('display', 'none');

        await expect(zhBasic.locator(':scope > ul')).toHaveCSS('display', 'block');
        await expect(zhDevelop.locator(':scope > ul')).toHaveCSS('display', 'block');
        await expect(zhFaq.locator(':scope > ul')).toHaveCSS('display', 'block');
    });

    test('logo returns to the Chinese homepage with the same default tree', async ({ page }) => {
        await gotoDocsPage(page, '/en/develop/c/device_api.html');

        await page.locator('.wy-side-nav-search a.icon-home').click();
        await page.waitForURL('**/index.html');

        await expect(page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])')).toBeVisible();
        await expect(page.locator('.axcl-sidebar > ul > li:has(> a[href="en/index.html"])')).toBeHidden();

        const zhRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])').first();
        const zhBasic = zhRoot.locator('ul > li:has(> a:has-text("基础"))').first();
        const zhDevelop = zhRoot.locator('ul > li:has(> a:has-text("开发"))').first();
        const zhFaq = zhRoot.locator('ul > li:has(> a:has-text("常见问题"))').first();
        const zhOverview = zhBasic.locator('ul > li:has(> a:has-text("概览"))').first();
        const zhInstall = zhBasic.locator('ul > li:has(> a:has-text("安装指南"))').first();
        const zhQuickStart = zhBasic.locator('ul > li:has(> a:has-text("快速开始"))').first();
        const zhDevelopArch = zhDevelop.locator('ul > li:has(> a:has-text("架构"))').first();
        const zhDevelopCpp = zhDevelop.locator('ul > li:has(> a:has-text("C/C++"))').first();

        await expect(zhBasic).toHaveAttribute('aria-expanded', 'true');
        await expect(zhDevelop).toHaveAttribute('aria-expanded', 'true');
        await expect(zhFaq).toHaveAttribute('aria-expanded', 'true');

        await expect(zhOverview).toHaveAttribute('aria-expanded', 'false');
        await expect(zhInstall).toHaveAttribute('aria-expanded', 'false');
        await expect(zhQuickStart).toHaveAttribute('aria-expanded', 'false');
        await expect(zhDevelopArch).toHaveAttribute('aria-expanded', 'false');
        await expect(zhDevelopCpp).toHaveAttribute('aria-expanded', 'false');

        await expect(zhOverview.locator(':scope > ul')).toHaveCSS('display', 'none');
        await expect(zhInstall.locator(':scope > ul')).toHaveCSS('display', 'none');
        await expect(zhQuickStart.locator(':scope > ul')).toHaveCSS('display', 'none');
        await expect(zhDevelopArch.locator(':scope > ul')).toHaveCSS('display', 'none');
        await expect(zhDevelopCpp.locator(':scope > ul')).toHaveCSS('display', 'none');

        await expect(zhBasic.locator(':scope > ul')).toHaveCSS('display', 'block');
        await expect(zhDevelop.locator(':scope > ul')).toHaveCSS('display', 'block');
        await expect(zhFaq.locator(':scope > ul')).toHaveCSS('display', 'block');
    });

    test('logo return keeps the homepage root title aligned with the sidebar header tone', async ({ page }) => {
        await gotoDocsPage(page, '/zh/develop/c/device_api.html');

        await page.locator('.wy-side-nav-search a.icon-home').click();
        await page.waitForURL('**/index.html');

        const zhRootLink = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"]) > a').first();
        const header = page.locator('.wy-side-nav-search').first();

        await expect(zhRootLink).toBeVisible();
        await expect(zhRootLink).toHaveCSS('background-color', await header.evaluate((node) => getComputedStyle(node).backgroundColor));
    });

    test('localized homepage keeps the root title visible and lets it collapse the whole tree', async ({ page }) => {
        await gotoDocsPage(page, '/zh/index.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li.current').first();
        const zhRootLink = zhRoot.locator(':scope > a').first();
        const zhRootChildren = zhRoot.locator(':scope > ul').first();

        await expect(zhRootLink).toBeVisible();
        await expect(zhRoot).toHaveAttribute('aria-expanded', 'true');
        await expect(zhRootChildren).toHaveCSS('display', 'block');

        await zhRootLink.click();
        await expect(zhRoot).toHaveAttribute('aria-expanded', 'false');
        await expect(zhRootChildren).toHaveCSS('display', 'none');

        await zhRootLink.click();
        await expect(zhRoot).toHaveAttribute('aria-expanded', 'true');
        await expect(zhRootChildren).toHaveCSS('display', 'block');
    });

    test('root title on a content page collapses the current tree instead of navigating home first', async ({ page }) => {
        await gotoDocsPage(page, '/zh/develop/c/device_api.html');

        await page.locator('.wy-side-nav-search a.icon-home').click();
        await page.waitForURL('**/index.html');

        await branchLinkLocator(page, 'C/C++').click();
        await branchLocator(page, 'C/C++').locator(':scope > ul').waitFor({ state: 'visible' });
        await branchLocator(page, '流 API').locator(':scope > a').click();
        await page.waitForURL('**/zh/develop/c/stream_api.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li.current').first();
        const zhRootLink = zhRoot.locator(':scope > a').first();
        const zhRootChildren = zhRoot.locator(':scope > ul').first();
        const headerBackground = await page.locator('.wy-side-nav-search').first().evaluate((node) => getComputedStyle(node).backgroundColor);

        await expect(zhRootLink).toHaveCSS('background-color', headerBackground);
        await zhRootLink.click();
        await expect(page).toHaveURL(/\/zh\/develop\/c\/stream_api\.html$/);
        await expect(zhRoot).toHaveAttribute('aria-expanded', 'false');
        await expect(zhRootChildren).toHaveCSS('display', 'none');
        await expect(zhRootLink).toHaveCSS('background-color', headerBackground);
    });

    test('homepage faq leaf keeps unrelated branches open', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])').first();
        const zhBasic = zhRoot.locator('ul > li:has(> a:has-text("基础"))').first();
        const zhDevelop = zhRoot.locator('ul > li:has(> a:has-text("开发"))').first();
        const zhFaq = zhRoot.locator('ul > li:has(> a:has-text("常见问题"))').first();
        const zhFaqLeaf = zhFaq.locator('ul > li:has(> a:has-text("如何在本地构建文档？"))').first();

        const basicInitial = await readBranchState(page, '基础');
        const developInitial = await readBranchState(page, '开发');
        const faqInitial = await readBranchState(page, '常见问题');

        await zhFaqLeaf.locator(':scope > a').click();
        await page.waitForURL('**/zh/faq/index.html*');

        expect(await readBranchState(page, '基础')).toEqual(basicInitial);
        expect(await readBranchState(page, '开发')).toEqual(developInitial);
    });

    test('keeps manually opened page groups open when navigating between page group leaves', async ({ page }) => {
        await gotoDocsPage(page, '/zh/basic/install.html');

        const overview = branchLocator(page, '概览');
        const install = branchLocator(page, '安装指南');
        const quickStart = branchLocator(page, '快速开始');

        await expect(install).toHaveAttribute('aria-expanded', 'true');
        await expect(overview).toHaveAttribute('aria-expanded', 'false');
        await expect(quickStart).toHaveAttribute('aria-expanded', 'false');

        await branchLinkLocator(page, '概览').click();
        await branchLinkLocator(page, '快速开始').click();
        await expect(overview).toHaveAttribute('aria-expanded', 'true');
        await expect(install).toHaveAttribute('aria-expanded', 'true');
        await expect(quickStart).toHaveAttribute('aria-expanded', 'true');

        await install.locator(':scope > ul > li:has(> a:has-text("推荐准备项")) > a').click();
        await page.waitForURL('**/zh/basic/install.html*');
        await install.locator(':scope > ul > li:has(> a:has-text("文档构建准备")) > a').click();
        await page.waitForURL('**/zh/basic/install.html*');
        await expect(overview).toHaveAttribute('aria-expanded', 'true');
        await expect(install).toHaveAttribute('aria-expanded', 'true');
        await expect(quickStart).toHaveAttribute('aria-expanded', 'true');

        await overview.locator(':scope > ul > li:has(> a:has-text("页面目的")) > a').click();
        await page.waitForURL('**/zh/basic/overview.html*');

        await expect(branchLocator(page, '概览')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, '安装指南')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, '快速开始')).toHaveAttribute('aria-expanded', 'true');
    });

    test('icon and text clicks toggle branches independently', async ({ page }) => {
        await gotoDocsPage(page, '/zh/index.html');

        const basicToggle = branchToggleLocator(page, '基础');
        const basicChildren = branchChildrenLocator(page, '基础');
        const developText = branchLinkLocator(page, '开发');
        const developChildren = branchChildrenLocator(page, '开发');

        const basicInitial = await readBranchState(page, '基础');
        const developInitial = await readBranchState(page, '开发');
        const developChildInitial = await readBranchState(page, 'C/C++');
        const faqInitial = await readBranchState(page, '常见问题');

        await basicToggle.click();
        await expect(branchLocator(page, '基础')).toHaveAttribute('aria-expanded', basicInitial.expanded === 'true' ? 'false' : 'true');
        await expect(basicChildren).toHaveCSS('display', basicInitial.visible === 'block' ? 'none' : 'block');
        expect(await readBranchState(page, '开发')).toEqual(developInitial);
        expect(await readBranchState(page, 'C/C++')).toEqual(developChildInitial);
        expect(await readBranchState(page, '常见问题')).toEqual(faqInitial);

        await developText.click();
        await expect(branchLocator(page, '开发')).toHaveAttribute('aria-expanded', developInitial.expanded === 'true' ? 'false' : 'true');
        await expect(developChildren).toHaveCSS('display', developInitial.visible === 'block' ? 'none' : 'block');
        expect((await readBranchState(page, 'C/C++')).current).toBe(developChildInitial.current);
        expect((await readBranchState(page, 'C/C++')).expanded).toBe(developChildInitial.expanded);
        expect(await readBranchState(page, '常见问题')).toEqual(faqInitial);

        await developText.click();
        await expect(branchLocator(page, '开发')).toHaveAttribute('aria-expanded', developInitial.expanded);
        await expect(developChildren).toHaveCSS('display', developInitial.visible);
        expect(await readBranchState(page, 'C/C++')).toEqual(developChildInitial);
    });

    test('keeps the active page and sidebar state aligned when switching languages', async ({ page }) => {
        await gotoDocsPage(page, '/zh/develop/c/device_api.html');

        const zhState = await readSidebarState(page);
        expect(zhState.title).toContain('设备 API');
        expect(zhState.heading).toContain('设备 API');
        expect(zhState.path).toContain('/zh/develop/c/device_api.html');

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/develop/c/device_api.html');

        const enState = await readSidebarState(page);
        expect(enState.title).toContain('Device API');
        expect(enState.heading).toContain('Device API');
        expect(enState.path).toContain('/en/develop/c/device_api.html');
        expect(normalizeNavKeys(enState.openKeys)).toEqual(normalizeNavKeys(zhState.openKeys));
    });

    test('preserves the current page node when switching languages', async ({ page }) => {
        await gotoDocsPage(page, '/zh/develop/arch/system.html');

        const zhState = await readSidebarState(page);
        expect(zhState.title).toContain('系统架构');
        expect(zhState.heading).toContain('系统架构');
        await expect(branchLocator(page, '系统架构')).toHaveClass(/current/);

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/develop/arch/system.html');

        const enState = await readSidebarState(page);
        expect(enState.title).toContain('System Architecture');
        expect(enState.heading).toContain('System Architecture');
        await expect(branchLocator(page, 'System Architecture')).toHaveClass(/current/);
        expect(normalizeNavKeys(enState.openKeys)).toEqual(normalizeNavKeys(zhState.openKeys));
    });

    test('preserves homepage sidebar collapse state across language switches', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])').first();
        const zhBasic = zhRoot.locator('ul > li:has(> a:has-text("基础"))').first();
        const zhBasicLink = zhBasic.locator(':scope > a').first();
        const zhDevelop = zhRoot.locator('ul > li:has(> a:has-text("开发"))').first();
        const zhDevelopChild = zhRoot.locator('ul li:has(> a:has-text("C/C++"))').first();
        const zhFaq = zhRoot.locator('ul > li:has(> a:has-text("常见问题"))').first();

        const basicInitial = await zhBasic.evaluate((node) => ({
            expanded: node.getAttribute('aria-expanded'),
            current: node.classList.contains('current'),
            visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        }));
        const developInitial = await zhDevelop.evaluate((node) => ({
            expanded: node.getAttribute('aria-expanded'),
            current: node.classList.contains('current'),
            visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        }));
        const developChildInitial = await zhDevelopChild.evaluate((node) => ({
            expanded: node.getAttribute('aria-expanded'),
            current: node.classList.contains('current'),
            visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        }));
        const faqInitial = await zhFaq.evaluate((node) => ({
            expanded: node.getAttribute('aria-expanded'),
            current: node.classList.contains('current'),
            visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        }));

        await zhBasicLink.evaluate((link) => link.click());
        await expect(zhBasic).not.toHaveAttribute('aria-expanded', basicInitial.expanded);
        expect(await zhDevelop.evaluate((node) => ({
            expanded: node.getAttribute('aria-expanded'),
            current: node.classList.contains('current'),
            visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        }))).toEqual(developInitial);
        expect(await zhDevelopChild.evaluate((node) => ({
            expanded: node.getAttribute('aria-expanded'),
            current: node.classList.contains('current'),
            visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        }))).toEqual(developChildInitial);
        expect(await zhFaq.evaluate((node) => ({
            expanded: node.getAttribute('aria-expanded'),
            current: node.classList.contains('current'),
            visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        }))).toEqual(faqInitial);

        const zhState = await readSidebarState(page);

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/index.html');

        const enState = await readSidebarState(page);
        expect(enState.title).toContain('AXCL SDK Documentation');
        const zhStoredState = JSON.parse(await page.evaluate(() => window.localStorage.getItem('axcl-sidebar-state-zh') || '{}'));
        const enStoredState = JSON.parse(await page.evaluate(() => window.localStorage.getItem('axcl-sidebar-state-en') || '{}'));
        expect(enStoredState).toEqual(zhStoredState);
    });
});
