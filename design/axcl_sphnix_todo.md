# AXCL Sphinx 文档站 TODO

## 待开发

- 在具备 Chromium 系统运行库的环境中执行一次 Playwright 真机对比，完成与 esp-idf 的实测收口。
- 修复现有 C Markdown 文档的旧式锚点和交叉引用写法，替代当前的告警抑制策略。

## 进行中

- 无。

## 已完成

- 建立 `docs/conf.py`、`docs/requirements.txt`、`docs/Makefile` 的最小可构建链路。
- 建立 `docs/source/index.rst`、`docs/source/en/index.rst`、`docs/source/zh/index.rst` 的入口骨架。
- 补齐中英文基础文档、架构页、Python 占位页和 FAQ 占位页。
- 将现有 C/C++ 文档接入中英文开发导航树。
- 新增仓库级 `.readthedocs.yaml` 与 `.gitignore`。
- 建立 design 目录下的需求、设计、验证、TODO 四份中文文档。
- 实现模板级当前语言侧边栏与基础展开状态保持能力。
- 将测试报告迁移为源码页，并生成到 `docs/build/html/test-report.html`。
- 收敛侧边栏 hover、高亮、折叠图标和层级间距，使其更接近 esp-idf / RTD 风格。
- 新增 Playwright 导航对比用例，覆盖 hover 颜色、关键样式对比与展开折叠状态保持。
- 新增 `docs/scripts/sphnix/generate_test_report.py`，实现构建结果、Playwright 预检与测试状态自动写回报告页。
- 新增运行日志与 JSON 结果产物，统一落在 `docs/build/test-results/`。