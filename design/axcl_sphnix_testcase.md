# AXCL Sphinx 文档站验证说明与测试用例

## 1. 验证目标

验证文档站构建链路、双语目录组织、导航可达性、版本管理接入和测试报告输出能力是否满足需求。

## 2. 验证分级

- Smoke：验证最关键的构建与访问主链路。
- 全量：验证导航、样式、语言切换、版本接入、自动报告和文档一致性。

## 3. Smoke 用例

### TC-SMOKE-001 本地 HTML 构建

- 前置条件：Python 与文档依赖已安装。
- 操作步骤：
  1. 进入 `docs` 目录。
  2. 执行 `make html`。
- 预期结果：`docs/build/html` 生成成功，构建无阻塞性错误。

### TC-SMOKE-002 默认中文入口

- 前置条件：HTML 构建完成。
- 操作步骤：
  1. 打开 `docs/build/html/index.html`。
  2. 观察首页入口文案和导航。
- 预期结果：首页默认展示中文入口说明，并能进入中文文档树。

### TC-SMOKE-003 Markdown 页面渲染

- 前置条件：HTML 构建完成。
- 操作步骤：
  1. 打开中文或英文基础文档中的 Markdown 页面。
  2. 检查标题、列表和链接显示。
- 预期结果：Markdown 页面内容完整渲染，无空白页。

### TC-SMOKE-004 C/C++ 文档可达性

- 前置条件：HTML 构建完成。
- 操作步骤：
  1. 从语言首页进入开发文档。
  2. 展开 C/C++ 节点。
  3. 打开任意一个 API 页面。
- 预期结果：C/C++ 树可见，API 与 reference 页面可以打开。

### TC-SMOKE-005 测试报告页生成

- 前置条件：HTML 构建完成。
- 操作步骤：
  1. 打开 `docs/build/html/test-report.html`。
  2. 检查报告标题、结果摘要与执行时间。
- 预期结果：测试报告页可访问，且内容来自最近一次执行结果，而不是手写快照。

### TC-SMOKE-006 自动报告脚本

- 前置条件：Python、Node、Sphinx 与 Playwright 依赖已安装。
- 操作步骤：
  1. 在仓库根目录执行 `python3 docs/scripts/sphnix/generate_test_report.py`。
  2. 检查 `docs/source/_generated/test-report-generated.rst` 是否被更新。
  3. 检查 `docs/build/html/test-report.html` 是否刷新。
- 预期结果：脚本可完成构建、测试、回写和 HTML 刷新闭环。

## 4. 全量用例

### TC-FULL-001 当前语言侧边栏隔离

- 前置条件：HTML 构建完成。
- 操作步骤：
  1. 分别打开中文页和英文页。
  2. 检查侧边栏树内容。
- 预期结果：中文页不显示英文树，英文页不显示中文树。

### TC-FULL-002 页面内语言跳转

- 前置条件：中英文入口页已生成。
- 操作步骤：
  1. 在中文入口页点击 English。
  2. 在英文入口页点击简体中文。
- 预期结果：可在对等入口页之间跳转，跳转后当前语言内容正确显示。

### TC-FULL-003 侧边栏展开状态

- 前置条件：侧边栏交互实现完成。
- 操作步骤：
  1. 展开基础文档。
  2. 观察开发文档与 FAQ 状态。
  3. 折叠开发文档并重新展开。
- 预期结果：同级状态互不影响，子节点展开状态保持，折叠图标方向随状态切换。

### TC-FULL-004 版本接入

- 前置条件：RTD 项目完成接入并同步分支或标签。
- 操作步骤：
  1. 在 RTD 页面查看版本菜单。
  2. 检查默认分支与标签版本显示。
- 预期结果：`latest` 对应默认分支，`vX.Y.Z` 对应标签版本，版本菜单来自 RTD Addons flyout。

### TC-FULL-005 文档一致性

- 前置条件：四份 design 文档已落盘。
- 操作步骤：
  1. 对照需求文档阅读设计文档。
  2. 对照验证文档检查验收项。
  3. 检查 TODO 文档中的状态记录。
- 预期结果：需求、设计、验证无冲突，任务状态仅出现在 TODO 文档。

### TC-FULL-006 Playwright 导航参考对比

- 前置条件：Playwright Chromium 运行库完整可用，本地 HTML 已生成。
- 操作步骤：
  1. 执行 `npx playwright test --config=playwright.config.js`。
  2. 打开本地 `zh/index.html` 与 esp-idf 参考页面。
  3. 检查侧边栏背景、当前项高亮、hover 颜色和层级间距对比结果。
- 预期结果：本地样式与 esp-idf 关键导航视觉指标保持接近，异常项会被测试结果标记。

### TC-FULL-007 Playwright 环境降级路径

- 前置条件：Playwright Chromium 浏览器已下载，但服务器缺失系统共享库。
- 操作步骤：
  1. 执行 `python3 docs/scripts/sphnix/generate_test_report.py`。
  2. 检查报告中的 Playwright 预检和用例状态。
- 预期结果：用例自动标记为跳过，报告明确记录缺失库名称，Sphinx HTML 仍可正常生成。

## 5. 测试报告要求

- 测试报告输出位置：`docs/build/html`。
- 报告内容至少包含执行时间、测试范围、Smoke 结果、全量结果、失败项与结论。
- HTML 测试报告由 `docs/source/test-report.rst` 引用自动生成内容，构建后固定输出为 `docs/build/html/test-report.html`。
- 自动生成结果文件位于 `docs/source/_generated/test-report-generated.rst`，运行日志位于 `docs/build/test-results/`。
- HTML 测试报告是结果产物，不替代本测试用例文档。
