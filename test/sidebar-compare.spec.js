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

function homepageRootBySectionLabel(page, label) {
    return page.locator(`.axcl-sidebar > ul > li:has(> ul > li > a:has-text(${JSON.stringify(label)}))`).first();
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

    test('sidebar starts directly from localized top-level sections', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        const zhRoot = homepageRootBySectionLabel(page, '基础');
        const zhRootLink = zhRoot.locator(':scope > a').first();
        const zhTopLevelLabels = await zhRoot.locator(':scope > ul > li > a').evaluateAll((nodes) =>
            nodes.map((node) => node.textContent.trim())
        );

        await expect(zhRootLink).toBeHidden();
        expect(zhTopLevelLabels).toEqual(['基础', '开发', '常见问题']);

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/index.html');

        const enRoot = homepageRootBySectionLabel(page, 'Basic');
        const enRootLink = enRoot.locator(':scope > a').first();
        const enTopLevelLabels = await enRoot.locator(':scope > ul > li > a').evaluateAll((nodes) =>
            nodes.map((node) => node.textContent.trim())
        );

        await expect(enRootLink).toBeHidden();
        expect(enTopLevelLabels).toEqual(['Basic', 'Development', 'FAQ']);
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

    test('logo resets the Chinese homepage tree on the first return even after homepage branch toggles were saved', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])').first();
        const zhBasic = zhRoot.locator('ul > li:has(> a:has-text("基础"))').first();
        const zhDevelop = zhRoot.locator('ul > li:has(> a:has-text("开发"))').first();
        const zhFaq = zhRoot.locator('ul > li:has(> a:has-text("常见问题"))').first();

        await zhBasic.locator(':scope > a').click();
        await zhDevelop.locator(':scope > a').click();
        await expect(zhBasic).toHaveAttribute('aria-expanded', 'false');
        await expect(zhDevelop).toHaveAttribute('aria-expanded', 'false');

        await zhFaq.locator('ul > li:has(> a:has-text("如何在本地构建文档？")) > a').first().click();
        await page.waitForURL('**/zh/faq/index.html*');

        await page.locator('.wy-side-nav-search a.icon-home').click();
        await page.waitForURL('**/index.html');

        await expect(zhBasic).toHaveAttribute('aria-expanded', 'true');
        await expect(zhDevelop).toHaveAttribute('aria-expanded', 'true');
        await expect(zhFaq).toHaveAttribute('aria-expanded', 'true');
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

    test('switching architecture pages keeps every ancestor branch open in the target language', async ({ page }) => {
        await gotoDocsPage(page, '/zh/develop/arch/system.html');

        await expect(branchLocator(page, '开发')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, '架构')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, '系统架构')).toHaveClass(/current/);

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/develop/arch/system.html');

        await expect(branchLocator(page, 'Development')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, 'Architecture')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, 'System Architecture')).toHaveClass(/current/);
    });

    test('switching overview section anchors keeps the matching subsection selected', async ({ page }) => {
        await gotoDocsPage(page, '/zh/basic/overview.html#id2');

        await expect(branchLocator(page, '页面目的')).toHaveClass(/current/);

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/basic/overview.html#purpose');

        await expect(branchLocator(page, 'Basic')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, 'Overview')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, 'Purpose')).toHaveClass(/current/);
    });

    test('switching faq anchors keeps the matching question selected', async ({ page }) => {
        await gotoDocsPage(page, '/zh/faq/index.html#id2');

        await expect(branchLocator(page, '如何在本地构建文档？')).toHaveClass(/current/);

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/faq/index.html#how-do-i-build-the-documentation-locally');

        await expect(branchLocator(page, 'FAQ')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, 'How do I build the documentation locally?')).toHaveClass(/current/);
    });

    test('switching anchored sections keeps the matched node selected without scrolling the content pane down', async ({ page }) => {
        await gotoDocsPage(page, '/zh/basic/install.html#sdk');

        await expect(branchLocator(page, 'SDK 环境准备')).toHaveClass(/current/);

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/basic/install.html#sdk-environment-preparation');

        await expect(branchLocator(page, 'Installation Guide')).toHaveAttribute('aria-expanded', 'true');
        await expect(branchLocator(page, 'SDK Environment Preparation')).toHaveClass(/current/);
        await expect(page.evaluate(() => window.scrollY)).resolves.toBe(0);
    });

    test('language switching keeps the current sidebar item at the same visible position', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 500 });
        await gotoDocsPage(page, '/zh/develop/c/reference/enum.html');

        await page.evaluate(() => {
            document.querySelector('.wy-side-scroll').scrollTop = 120;
        });

        const beforeSwitch = await branchLocator(page, '枚举参考').evaluate((node) => {
            const link = node.querySelector(':scope > a');
            const container = document.querySelector('.wy-side-scroll');
            const linkRect = link.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            return {
                fullyVisible: linkRect.top >= containerRect.top && linkRect.bottom <= containerRect.bottom,
                offsetTop: linkRect.top - containerRect.top,
            };
        });
        expect(beforeSwitch.fullyVisible).toBe(true);

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/develop/c/reference/enum.html');

        const afterSwitch = await branchLocator(page, 'Enum Reference').evaluate((node) => {
            const link = node.querySelector(':scope > a');
            const container = document.querySelector('.wy-side-scroll');
            const linkRect = link.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            return {
                fullyVisible: linkRect.top >= containerRect.top && linkRect.bottom <= containerRect.bottom,
                offsetTop: linkRect.top - containerRect.top,
            };
        });

        expect(afterSwitch.fullyVisible).toBe(true);
        expect(Math.abs(afterSwitch.offsetTop - beforeSwitch.offsetTop)).toBeLessThanOrEqual(2);
    });

    test('desktop content scrolling does not drag the sidebar scroll position with it', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 500 });
        await gotoDocsPage(page, '/zh/develop/c/reference/enum.html');

        const contentBox = await page.locator('.wy-nav-content').boundingBox();
        expect(contentBox).not.toBeNull();

        await page.evaluate(() => {
            document.querySelector('.wy-side-scroll').scrollTop = 120;
            window.scrollTo(0, 0);
        });

        await page.mouse.move(contentBox.x + 120, contentBox.y + 120);
        await page.mouse.wheel(0, 700);

        const result = await page.evaluate(() => ({
            side: document.querySelector('.wy-side-scroll').scrollTop,
            page: window.scrollY,
        }));

        expect(result.page).toBeGreaterThan(0);
        expect(result.side).toBe(120);
    });

    test('desktop sidebar wheel scrolling does not leak into the page at the sidebar boundary', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 500 });
        await gotoDocsPage(page, '/zh/develop/c/reference/enum.html');

        const sideBox = await page.locator('.wy-side-scroll').boundingBox();
        expect(sideBox).not.toBeNull();

        const boundaryState = await page.evaluate(() => {
            const sideScroll = document.querySelector('.wy-side-scroll');
            const maxScrollTop = sideScroll.scrollHeight - sideScroll.clientHeight;
            sideScroll.scrollTop = maxScrollTop;
            window.scrollTo(0, 400);
            return {
                maxScrollTop,
                page: window.scrollY,
            };
        });

        await page.mouse.move(sideBox.x + 40, sideBox.y + 120);
        await page.mouse.wheel(0, 500);

        const result = await page.evaluate(() => ({
            side: document.querySelector('.wy-side-scroll').scrollTop,
            page: window.scrollY,
        }));

        expect(result.side).toBe(boundaryState.maxScrollTop);
        expect(result.page).toBe(boundaryState.page);
    });

    test('manual basic anchor clicks keep the content pane pinned to the top', async ({ page }) => {
        await gotoDocsPage(page, '/zh/basic/install.html');

        await branchLocator(page, 'SDK 环境准备').locator(':scope > a').evaluate((node) => node.click());
        await page.waitForURL('**/zh/basic/install.html#sdk');

        await expect(branchLocator(page, 'SDK 环境准备')).toHaveClass(/current/);
        await expect(page.evaluate(() => window.scrollY)).resolves.toBe(0);
    });

    test('manual faq anchor clicks keep the content pane pinned to the top', async ({ page }) => {
        await gotoDocsPage(page, '/zh/faq/index.html');

        await branchLocator(page, '如何在本地构建文档？').locator(':scope > a').evaluate((node) => node.click());
        await page.waitForURL('**/zh/faq/index.html#id2');

        await expect(branchLocator(page, '如何在本地构建文档？')).toHaveClass(/current/);
        await expect(page.evaluate(() => window.scrollY)).resolves.toBe(0);
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

    test('homepage branch-only expand and collapse choices survive language switching without selecting a leaf page', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])').first();
        const zhBasic = zhRoot.locator('ul > li:has(> a:has-text("基础"))').first();
        const zhDevelop = zhRoot.locator('ul > li:has(> a:has-text("开发"))').first();
        const zhFaq = zhRoot.locator('ul > li:has(> a:has-text("常见问题"))').first();

        await zhBasic.locator(':scope > a').click();
        await zhDevelop.locator(':scope > a').click();

        await expect(zhBasic).toHaveAttribute('aria-expanded', 'false');
        await expect(zhDevelop).toHaveAttribute('aria-expanded', 'false');
        await expect(zhFaq).toHaveAttribute('aria-expanded', 'true');

        await page.locator('.axcl-language-switch .axcl-language-link[data-lang-target="en"]').click();
        await page.waitForURL('**/en/index.html');

        const enRoot = homepageRootBySectionLabel(page, 'Basic');
        const enBasic = enRoot.locator('ul > li:has(> a:has-text("Basic"))').first();
        const enDevelop = enRoot.locator('ul > li:has(> a:has-text("Development"))').first();
        const enFaq = enRoot.locator('ul > li:has(> a:has-text("FAQ"))').first();

        await expect(enBasic).toHaveAttribute('aria-expanded', 'false');
        await expect(enDevelop).toHaveAttribute('aria-expanded', 'false');
        await expect(enFaq).toHaveAttribute('aria-expanded', 'true');
    });

    test('homepage logo still resets the tree to the default expanded state after manual branch toggles', async ({ page }) => {
        await gotoDocsPage(page, '/index.html');

        const zhRoot = page.locator('.axcl-sidebar > ul > li:has(> a[href="zh/index.html"])').first();
        const zhBasic = zhRoot.locator('ul > li:has(> a:has-text("基础"))').first();
        const zhDevelop = zhRoot.locator('ul > li:has(> a:has-text("开发"))').first();
        const zhFaq = zhRoot.locator('ul > li:has(> a:has-text("常见问题"))').first();

        await zhBasic.locator(':scope > a').click();
        await zhDevelop.locator(':scope > a').click();
        await expect(zhBasic).toHaveAttribute('aria-expanded', 'false');
        await expect(zhDevelop).toHaveAttribute('aria-expanded', 'false');

        await page.locator('.wy-side-nav-search a.icon-home').click();

        await expect(zhBasic).toHaveAttribute('aria-expanded', 'true');
        await expect(zhDevelop).toHaveAttribute('aria-expanded', 'true');
        await expect(zhFaq).toHaveAttribute('aria-expanded', 'true');
    });
});
