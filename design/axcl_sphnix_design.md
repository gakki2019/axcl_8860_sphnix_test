# AXCL Sphinx 文档站设计说明

## 1. 总体设计

当前实现以 `docs/` 作为 Sphinx 工程根目录，`docs/source/` 作为内容源目录，`docs/build/html` 作为本地 HTML 输出目录。

## 2. 构建设计

### 2.1 Sphinx 配置

- 通过 `docs/conf.py` 统一配置主题、Markdown 支持、模板目录和静态资源目录。
- 使用 `myst-parser` 解析 Markdown 页面。
- 使用 `sphinx_rtd_theme` 作为主题基底。

### 2.2 构建入口

- 通过 `docs/Makefile` 执行本地 `html` 与 `clean` 目标。
- 通过仓库根的 `.readthedocs.yaml` 接入 Read the Docs。

### 2.3 验证与报告入口

- 通过 `docs/scripts/sphnix/generate_test_report.py` 串联“构建、Playwright 预检、导航对比、结果回写、HTML 刷新”整条流程。
- 通过 `make -C docs report` 或 `python3 docs/scripts/sphnix/generate_test_report.py` 触发自动化验证。
- 通过仓库根 `package.json` 暴露 `docs:report`、`docs:html`、`test:nav` 等脚本入口，便于本地和 CI 统一调用。

## 3. 内容组织设计

### 3.1 目录策略

- 根入口页位于 `docs/source/index.rst`，默认展示中文入口。
- 英文主入口位于 `docs/source/en/index.rst`。
- 中文主入口位于 `docs/source/zh/index.rst`。
- `docs/source/zh/en` 被视为异常重复目录，通过 Sphinx 排除。

### 3.2 占位内容策略

- 基础文档提供概览、安装、快速开始占位内容。
- 开发文档提供架构说明与 Python 占位页。
- FAQ 页提供常见问题入口。
- 现有 C/C++ 文档作为既有内容直接纳入导航树。

## 4. 导航设计

### 4.1 导航结构

- 基础文档
- 开发文档
- FAQ

### 4.2 语言策略

- 站点默认从中文入口开始浏览。
- 语言切换在页面内通过对等链接提供。
- 不使用 RTD 原生 translation project 模式。

### 4.3 侧边栏策略

- 当前语言页面只渲染当前语言树。
- 侧边栏交互和样式向 esp-idf 靠拢。
- 已通过模板覆盖、CSS 和少量 JS 接管左侧导航树，实现当前语言侧边栏、默认展开、状态保持与层级缩进控制。
- 当前样式已按 esp-idf / RTD 参考收敛到深灰侧栏底色、灰色当前项、高亮蓝色 hover、细化折叠图标和更接近 RTD 的层级间距。
- 侧边栏节点通过 `data-node-key` 标识，供前端状态保持和 Playwright 自动化用例复用。

## 5. 版本管理设计

- 版本管理复用 Read the Docs 原生能力。
- `latest` 对应默认分支。
- `vX.Y.Z` 标签对应同名版本。
- 版本入口使用 RTD Addons flyout，不实现自定义版本选择器。

## 6. 已知技术约束

1. 现有 C Markdown 文档使用旧式锚点与引用写法，当前通过 Sphinx `myst.xref_missing` 告警抑制保持构建可读性，后续再做结构性清理。
2. 页面内语言跳转依赖中英文平行路径映射。
3. HTML 测试报告已经切换为执行结果自动回写模式，生成内容写入 `docs/source/_generated/test-report-generated.rst`，再由 `docs/source/test-report.rst` 引入。
4. Playwright 对比测试依赖 Chromium 系统运行库；当前 Ubuntu 服务器缺少 `libatk-1.0.so.0` 时，用例会自动标记为跳过并把原因写入报告，而不是阻断文档构建。
