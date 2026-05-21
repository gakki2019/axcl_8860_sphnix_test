最新执行摘要
------------

- 执行时间：2026-05-21 13:49:49
- 报告脚本：``python3 docs/scripts/sphnix/generate_test_report.py``
- HTML 输出：``docs/build/html/test-report.html``
- 构建日志：``docs/build/test-results/logs/sphinx-build.log``
- Playwright JSON：``docs/build/test-results/playwright-report.json``

结果摘要
--------

.. list-table::
   :header-rows: 1

   * - 检查项
     - 结果
     - 说明
   * - Sphinx HTML 构建
     - 通过
     - ``make -C docs clean html`` 返回码 0，本轮记录到 0 条 WARNING。
   * - Playwright 导航对比
     - 失败
     - 计划执行 23 条用例；通过 19，失败 4，跳过 0，波动 0。

Playwright 环境预检
------------------------

- 浏览器可执行文件：``/Users/laiqinglong/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing``
- 缺失系统库：无
- 预检说明：``Skipping ldd check on macOS``

用例执行结果
------------

.. list-table::
   :header-rows: 1

   * - 用例
     - 结果
     - 说明
   * - homepage shows only the Chinese navigation
     - 通过
     - sidebar-compare.spec.js
   * - sidebar starts directly from localized top-level sections
     - 通过
     - sidebar-compare.spec.js
   * - homepage keeps first level open and second level closed by default
     - 通过
     - sidebar-compare.spec.js
   * - logo returns to the Chinese homepage with the same default tree
     - 通过
     - sidebar-compare.spec.js
   * - logo resets the Chinese homepage tree on the first return even after homepage branch toggles were saved
     - 通过
     - sidebar-compare.spec.js
   * - homepage faq leaf keeps unrelated branches open
     - 通过
     - sidebar-compare.spec.js
   * - keeps manually opened page groups open when navigating between page group leaves
     - 失败
     - sidebar-compare.spec.js
   * - icon and text clicks toggle branches independently
     - 通过
     - sidebar-compare.spec.js
   * - keeps the active page and sidebar state aligned when switching languages
     - 通过
     - sidebar-compare.spec.js
   * - preserves the current page node when switching languages
     - 通过
     - sidebar-compare.spec.js
   * - switching architecture pages keeps every ancestor branch open in the target language
     - 通过
     - sidebar-compare.spec.js
   * - switching overview section anchors keeps the matching subsection selected
     - 通过
     - sidebar-compare.spec.js
   * - switching faq anchors keeps the matching question selected
     - 通过
     - sidebar-compare.spec.js
   * - switching anchored sections keeps the matched node selected without scrolling the content pane down
     - 通过
     - sidebar-compare.spec.js
   * - language switching keeps the current sidebar item at the same visible position
     - 失败
     - sidebar-compare.spec.js
   * - desktop content scrolling does not drag the sidebar scroll position with it
     - 失败
     - sidebar-compare.spec.js
   * - desktop sidebar wheel scrolling does not leak into the page at the sidebar boundary
     - 失败
     - sidebar-compare.spec.js
   * - manual basic anchor clicks keep the content pane pinned to the top
     - 通过
     - sidebar-compare.spec.js
   * - manual faq anchor clicks keep the content pane pinned to the top
     - 通过
     - sidebar-compare.spec.js
   * - preserves homepage sidebar collapse state across language switches
     - 通过
     - sidebar-compare.spec.js
   * - homepage branch-only expand and collapse choices survive language switching without selecting a leaf page
     - 通过
     - sidebar-compare.spec.js
   * - homepage logo still resets the tree to the default expanded state after manual branch toggles
     - 通过
     - sidebar-compare.spec.js
   * - search page allows sidebar branches to fold and expand
     - 通过
     - sidebar-compare.spec.js

结论
----

- 自动化流程已完成执行并写回结果，但存在失败用例，需根据 Playwright 结果继续收敛样式或交互。
