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
        .map((key) => key.replace(/^(?:\.\.\/)?(?:zh|en)\//, ''));
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
        currentHref: document.querySelector('.axcl-sidebar > ul a.current')?.getAttribute('href') || null,
    }));
}

async function readBranchState(page, label) {
    return branchLocator(page, label).evaluate((node) => ({
        expanded: node.getAttribute('aria-expanded'),
        visible: node.querySelector(':scope > ul') ? getComputedStyle(node.querySelector(':scope > ul')).display : null,
        current: node.classList.contains('current'),
        text: node.querySelector(':scope > a') ? node.querySelector(':scope > a').textContent.trim() : null,
        href: node.querySelector(':scope > a') ? node.querySelector(':scope > a').getAttribute('href') : null,
    }));
}

test.describe('AXCL sidebar navigation', () => {
    test.skip(!preflight.ok, skipReason);

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

    test('preserves homepage sidebar collapse state across language switches', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])').first();
        const zhBasic = zhRoot.locator('ul > li:has(> a:has-text("基础"))').first();
        const zhBasicToggle = zhBasic.locator(':scope > a > button.toctree-expand').first();
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

        await zhBasicToggle.click();
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

        const enRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="#"])').first();
        const enBasic = enRoot.locator('ul > li:has(> a:has-text("Basic"))').first();
        const enDevelop = enRoot.locator('ul > li:has(> a:has-text("Development"))').first();
        const enDevelopChild = enRoot.locator('ul li:has(> a:has-text("C/C++"))').first();
        const enFaq = enRoot.locator('ul > li:has(> a:has-text("FAQ"))').first();

        const enState = await readSidebarState(page);
        expect(enState.title).toContain('AXCL SDK Documentation');
        const zhStoredState = JSON.parse(await page.evaluate(() => window.localStorage.getItem('axcl-sidebar-state-zh') || '{}'));
        const enStoredState = JSON.parse(await page.evaluate(() => window.localStorage.getItem('axcl-sidebar-state-en') || '{}'));
        expect(enStoredState).toEqual(zhStoredState);
    });
});
