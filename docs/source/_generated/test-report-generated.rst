最新执行摘要
------------

- 执行时间：2026-05-20 11:40:51
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
     - 跳过
     - 计划执行 22 条用例；通过 0，失败 0，跳过 22，波动 0。

Playwright 环境预检
------------------------

- 浏览器可执行文件：``/Users/laiqinglong/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing``
- 缺失系统库：无
- 预检说明：``ldd execution failed: spawnSync ldd ENOENT``

用例执行结果
------------

.. list-table::
   :header-rows: 1

   * - 用例
     - 结果
     - 说明
   * - homepage shows only the Chinese navigation
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - sidebar starts directly from localized top-level sections
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - homepage keeps first level open and second level closed by default
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - logo returns to the Chinese homepage with the same default tree
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - logo resets the Chinese homepage tree on the first return even after homepage branch toggles were saved
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - homepage faq leaf keeps unrelated branches open
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - keeps manually opened page groups open when navigating between page group leaves
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - icon and text clicks toggle branches independently
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - keeps the active page and sidebar state aligned when switching languages
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - preserves the current page node when switching languages
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - switching architecture pages keeps every ancestor branch open in the target language
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - switching overview section anchors keeps the matching subsection selected
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - switching faq anchors keeps the matching question selected
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - switching anchored sections keeps the matched node selected without scrolling the content pane down
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - language switching keeps the current sidebar item at the same visible position
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - desktop content scrolling does not drag the sidebar scroll position with it
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - desktop sidebar wheel scrolling does not leak into the page at the sidebar boundary
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - manual basic anchor clicks keep the content pane pinned to the top
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - manual faq anchor clicks keep the content pane pinned to the top
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - preserves homepage sidebar collapse state across language switches
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - homepage branch-only expand and collapse choices survive language switching without selecting a leaf page
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT
   * - homepage logo still resets the tree to the default expanded state after manual branch toggles
     - 跳过
     - Chromium runtime is unavailable: ldd execution failed: spawnSync ldd ENOENT

结论
----

- Sphinx 构建与报告回写链路已打通；Playwright 用例已接入，但当前服务器缺少 Chromium 运行库，因此本轮导航比对被自动标记为跳过。
