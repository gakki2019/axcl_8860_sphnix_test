最新执行摘要
------------

- 执行时间：2026-05-15 10:18:26
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
     - 计划执行 2 条用例；通过 0，失败 0，跳过 2，波动 0。

Playwright 环境预检
------------------

- 浏览器可执行文件：``/home/jingxiaoping/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome``
- 缺失系统库：``libatk-1.0.so.0``
- 预检说明：``/home/jingxiaoping/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome: not an ELF file.``

用例执行结果
------------

.. list-table::
   :header-rows: 1

   * - 用例
     - 结果
     - 说明
   * - matches key sidebar colors and spacing against esp-idf
     - 跳过
     - Chromium runtime dependencies are missing: libatk-1.0.so.0
   * - keeps collapse and expand state with icon feedback
     - 跳过
     - Chromium runtime dependencies are missing: libatk-1.0.so.0

结论
----

- Sphinx 构建与报告回写链路已打通；Playwright 用例已接入，但当前服务器缺少 Chromium 运行库，因此本轮导航比对被自动标记为跳过。
