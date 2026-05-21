from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
DOCS_DIR = REPO_ROOT / 'docs'
BUILD_DIR = DOCS_DIR / 'build'
RESULTS_DIR = BUILD_DIR / 'test-results'
LOGS_DIR = RESULTS_DIR / 'logs'
GENERATED_REPORT = DOCS_DIR / 'source' / '_generated' / 'test-report-generated.rst'
PLAYWRIGHT_JSON = RESULTS_DIR / 'playwright-report.json'
PLAYWRIGHT_STDERR = LOGS_DIR / 'playwright.stderr.log'
BUILD_LOG = LOGS_DIR / 'sphinx-build.log'


def run_command(command: list[str], *, cwd: Path | None = None, stdout_path: Path | None = None, stderr_path: Path | None = None) -> dict[str, object]:
    completed = subprocess.run(
        command,
        cwd=cwd or REPO_ROOT,
        text=True,
        capture_output=True,
        check=False,
    )

    if stdout_path is not None:
        stdout_path.parent.mkdir(parents=True, exist_ok=True)
        stdout_path.write_text(completed.stdout, encoding='utf-8')

    if stderr_path is not None:
        stderr_path.parent.mkdir(parents=True, exist_ok=True)
        stderr_path.write_text(completed.stderr, encoding='utf-8')

    return {
        'command': ' '.join(command),
        'returncode': completed.returncode,
        'stdout': completed.stdout,
        'stderr': completed.stderr,
    }


def normalize_status(returncode: int, *, skipped: bool = False) -> str:
    if skipped:
        return '跳过'
    return '通过' if returncode == 0 else '失败'


def load_json(path: Path) -> dict[str, object] | None:
    if not path.exists() or not path.read_text(encoding='utf-8').strip():
        return None
    return json.loads(path.read_text(encoding='utf-8'))


def collect_specs(suites: list[dict[str, object]]) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []
    for suite in suites:
        for spec in suite.get('specs', []):
            tests = spec.get('tests', [])
            first_test = tests[0] if tests else {}
            results = first_test.get('results', []) if isinstance(first_test, dict) else []
            first_result = results[0] if results else {}
            annotations = first_test.get('annotations', []) if isinstance(first_test, dict) else []
            details = ''
            if annotations:
                details = '; '.join(
                    annotation.get('description', '')
                    for annotation in annotations
                    if annotation.get('description')
                )
            records.append(
                {
                    'title': spec.get('title', '未命名用例'),
                    'status': first_test.get('status', first_result.get('status', 'unknown')),
                    'file': spec.get('file', ''),
                    'details': details,
                }
            )
        records.extend(collect_specs(suite.get('suites', [])))
    return records


def format_lines(lines: list[str], indent: str = '') -> str:
    return '\n'.join(f'{indent}{line}' for line in lines)


def render_report(build_result: dict[str, object], preflight: dict[str, object] | None, playwright_result: dict[str, object] | None) -> str:
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    build_warnings = sum(1 for line in str(build_result['stdout']).splitlines() if 'WARNING:' in line)

    if playwright_result:
        stats = playwright_result.get('stats', {})
        skipped = int(stats.get('skipped', 0))
        expected = int(stats.get('expected', 0))
        unexpected = int(stats.get('unexpected', 0))
        flaky = int(stats.get('flaky', 0))
        total = skipped + expected + unexpected + flaky
        test_rows = collect_specs(playwright_result.get('suites', []))
    else:
        skipped = 0
        expected = 0
        unexpected = 0
        flaky = 0
        total = 0
        test_rows = []

    preflight_missing = []
    preflight_ok = True
    preflight_diagnostics: list[str] = []
    if preflight:
        preflight_ok = bool(preflight.get('ok', False))
        preflight_missing = list(preflight.get('missingLibraries', []))
        preflight_diagnostics = list(preflight.get('diagnostics', []))

    playwright_skipped = bool(preflight_missing) and total == 0 or (playwright_result and expected == 0 and unexpected == 0 and skipped >= 1)
    playwright_status = normalize_status(0 if unexpected == 0 else 1, skipped=playwright_skipped)
    build_status = normalize_status(int(build_result['returncode']))

    lines = [
        '最新执行摘要',
        '------------',
        '',
        f'- 执行时间：{now}',
        f'- 报告脚本：``python3 docs/scripts/sphnix/generate_test_report.py``',
        f'- HTML 输出：``docs/build/html/test-report.html``',
        f'- 构建日志：``docs/build/test-results/logs/sphinx-build.log``',
        f'- Playwright JSON：``docs/build/test-results/playwright-report.json``',
        '',
        '结果摘要',
        '--------',
        '',
        '.. list-table::',
        '   :header-rows: 1',
        '',
        '   * - 检查项',
        '     - 结果',
        '     - 说明',
        f'   * - Sphinx HTML 构建',
        f'     - {build_status}',
        f'     - ``make -C docs clean html`` 返回码 {build_result["returncode"]}，本轮记录到 {build_warnings} 条 WARNING。',
        f'   * - Playwright 导航对比',
        f'     - {playwright_status}',
        f'     - 计划执行 {total} 条用例；通过 {expected}，失败 {unexpected}，跳过 {skipped}，波动 {flaky}。',
    ]

    if preflight:
        lines.extend([
            '',
            'Playwright 环境预检',
            '------------------------',
            '',
            f'- 浏览器可执行文件：``{preflight.get("executablePath", "")}``',
        ])
        if preflight_missing:
            lines.append(f'- 缺失系统库：{", ".join(f"``{item}``" for item in preflight_missing)}')
        else:
            lines.append('- 缺失系统库：无')
        if preflight_diagnostics:
            lines.append(f'- 预检说明：``{preflight_diagnostics[0]}``')

    lines.extend([
        '',
        '用例执行结果',
        '------------',
        '',
    ])

    if test_rows:
        lines.extend([
            '.. list-table::',
            '   :header-rows: 1',
            '',
            '   * - 用例',
            '     - 结果',
            '     - 说明',
        ])
        status_map = {
            'expected': '通过',
            'passed': '通过',
            'skipped': '跳过',
            'unexpected': '失败',
            'failed': '失败',
        }
        for row in test_rows:
            details = row['details'] or row['file'] or '无附加信息'
            lines.extend([
                f'   * - {row["title"]}',
                f'     - {status_map.get(str(row["status"]), str(row["status"]))}',
                f'     - {details}',
            ])
    else:
        lines.extend([
            '- 本轮没有生成 Playwright 用例结果。',
        ])

    lines.extend([
        '',
        '结论',
        '----',
        '',
    ])

    if build_result['returncode'] != 0:
        lines.append('- 本轮构建失败，测试报告已经写回源码，但 HTML 页面未更新到最终产物。请先处理构建错误。')
    elif not preflight_ok:
        lines.append('- Sphinx 构建与报告回写链路已打通；Playwright 用例已接入，但当前服务器缺少 Chromium 运行库，因此本轮导航比对被自动标记为跳过。')
    elif unexpected:
        lines.append('- 自动化流程已完成执行并写回结果，但存在失败用例，需根据 Playwright 结果继续收敛样式或交互。')
    else:
        lines.append('- 自动化流程已执行完成，测试结果已回写到源码页并发布到 HTML 产物。')

    return format_lines(lines) + '\n'


def main() -> int:
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)

    build_result = run_command(
        ['make', '-C', str(DOCS_DIR), 'clean', 'html'],
        stdout_path=BUILD_LOG,
    )

    preflight_result = run_command(
        ['node', 'test/support/playwright-env.cjs'],
        stdout_path=RESULTS_DIR / 'playwright-preflight.json',
    )
    preflight_json = load_json(RESULTS_DIR / 'playwright-preflight.json') or {
        'ok': False,
        'executablePath': '',
        'missingLibraries': [],
    }

    playwright_json = None
    if int(build_result['returncode']) == 0:
        playwright_run = run_command(
            ['npx', 'playwright', 'test', '--config=playwright.config.js', '--reporter=json'],
            stdout_path=PLAYWRIGHT_JSON,
            stderr_path=PLAYWRIGHT_STDERR,
        )
        if int(playwright_run['returncode']) not in (0, 1):
            print(playwright_run['stderr'], file=sys.stderr)
        playwright_json = load_json(PLAYWRIGHT_JSON)
    else:
        PLAYWRIGHT_JSON.write_text('', encoding='utf-8')
        PLAYWRIGHT_STDERR.write_text('Skipped because Sphinx build failed.\n', encoding='utf-8')

    GENERATED_REPORT.write_text(
        render_report(build_result, preflight_json, playwright_json),
        encoding='utf-8',
    )

    final_build = run_command(['make', '-C', str(DOCS_DIR), 'html'])
    if int(final_build['returncode']) != 0:
        print(final_build['stdout'])
        print(final_build['stderr'], file=sys.stderr)
        return int(final_build['returncode'])

    print(f'Report written to {GENERATED_REPORT}')
    print('HTML output refreshed at docs/build/html/test-report.html')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
