# AXCL API 文档生成 SOP

本目录保存 AXCL API 文档自动生成的 Python 入口、Doxygen 配置和生成器配置文件，用于从头文件和 Doxygen XML 生成 Markdown 文档。

## 1. 环境依赖与搭建

运行前请先准备以下依赖：

- Linux 环境。当前设计目标环境是 Ubuntu 22.04。
- Python 3.10 或更高版本。
- Doxygen 1.9 或更高版本。
- C 编译器，例如 `gcc` 或 `cc`。错误码探针步骤会用到它。

如果系统中尚未安装 Python 3、Doxygen 或 C 编译器，先执行安装命令：

```bash
sudo apt update
sudo apt install -y python3 python3-pip doxygen build-essential
```

建议执行以下命令确认环境：

```bash
python3 --version
doxygen --version
cc --version
```

## 2. Python 用法与生成路径

主命令：

```bash
python3 docs/scripts/api/api_docgen.py
```

这条命令会完成以下动作：

- 自动创建所需目录。
- 调用 Doxygen 生成 XML 到 `docs/build/api/doxygen/xml`。
- 解析 XML 并生成 Markdown。
- 执行错误码探针。
- 输出报告文件。

常用模式：

```bash
python3 docs/scripts/api/api_docgen.py --skip-doxygen
python3 docs/scripts/api/api_docgen.py --validate-only
```

使用说明：

- `--skip-doxygen` 只适用于 `docs/build/api/doxygen/xml` 已经存在且内容有效的场景。
- `--validate-only` 只适用于 XML 和 Markdown 已经生成完毕，只想做校验的场景。
- 如果 XML 目录为空或缺失，脚本会直接报错，并提示先执行不带 `--skip-doxygen` 的完整命令。

生成出的 Markdown 路径如下：

- 总索引页：`docs/source/en/develop/c/index.md`
- API 页面：`docs/source/en/develop/c/*_api.md`
- reference 页面：`docs/source/en/develop/c/reference/*.md`

## 3. config 配置方法

配置目录：

- `docs/scripts/api/config`

当前配置文件：

- `docs/scripts/api/config/blacklist.yaml`

当前配置能力：

- 支持按 Doxygen group id 过滤函数和 reference symbol。
- 显式通过 `@ingroup` 归入 blacklist group 的函数和 reference symbol 不会写入生成的 Markdown。
- 未声明任何 `@ingroup` 的 reference symbol 仍会写入 reference 页面。
- 默认配置中包含 `mockApi`。

配置示例：

```yaml
version: 1
groups:
  - id: mockApi
    reason: Mock APIs are not part of public reference documentation.
```

配置修改方法：

- 在 `groups` 下新增条目即可增加一个需要过滤的 group。
- `id` 必须与头文件中的 `@defgroup` group id 一致。
- `reason` 建议写成人类可读描述，该内容会进入报告文件。

## 4. report 路径与说明

报告根目录：

- `docs/build/api/report`

汇总报告：

- `docs/build/api/report/summary.md`

明细报告说明：

- `excluded_by_config.tsv`：被 blacklist 过滤掉的函数和 reference symbol 明细。
- `undefined_defgroup.tsv`：引用了未定义 `@ingroup` 的符号。
- `orphaned_symbol.tsv`：未归组的公开函数。
- `unsupported_symbol_kind.tsv`：当前生成器跳过的顶层符号类型。
- `unsupported_tag.tsv`：当前不支持的 Doxygen 标签，例如 `@pre`、`@post`、`@example`。
- `broken_link.tsv`：无法解析的 `@ref` 或生成后无效的 Markdown 链接。
- `markdown_check.tsv`：Markdown 结构校验问题。

错误码探针输出目录：

- `docs/build/api/error_probe`

该目录下通常会包含：

- 探针输入源码
- host 侧输出
- device 侧输出
- 合并后的 TSV 结果

## 5. 建议使用 SOP

1. 确认系统 Python 3、Doxygen 和编译器已安装。
2. 如有需要，先检查并更新 `docs/scripts/api/config/blacklist.yaml`。
3. 执行 `python3 docs/scripts/api/api_docgen.py`。任一报告存在 ERROR 记录时返回非零退出码。
4. 优先查看 `docs/build/api/report/summary.md`。
5. 如果 summary 不干净，再打开对应 TSV 明细定位问题。
6. 最后检查 `docs/source/en/develop/c` 下的生成文档是否符合预期。
7. 按重新生成的英文页面翻译 `docs/source/zh/develop/` 下对应的中文页面，与源码改动一起提交。

维护规则（文档与代码一致、注释写法、错误码表述、示例、术语、中英文一致）见 `kwmex/wf/rule/axcl-doc-rule.md`。

## 6. 常见问题

- 如果 `--skip-doxygen` 报错，说明 XML 不存在或不完整，应先执行完整生成。
- 如果错误码探针失败，优先检查 `cc` 或 `gcc` 是否安装并在 `PATH` 中可用。
- 如果没有生成 API 页面，先检查 `docs/build/api/doxygen/xml` 是否有内容，再检查 `docs/build/api/report/orphaned_symbol.tsv` 和 `docs/build/api/report/excluded_by_config.tsv`。

## 7. Python API Markdown

同一入口支持 Python 模式，不使用 Doxygen 或 Sphinx autodoc：

```bash
python3 docs/scripts/api/api_docgen.py --language python
```

Python 模式直接读取仓库中 `python/axcl/` 的公开绑定、函数签名和 docstring，不调用设备 API，
也不需要安装 pyAXCL wheel 或 PyAV。环境要求为 64 位 Python >= 3.10，文档依赖见 `docs/requirements.txt`。
默认不带 `--language` 时仍按原流程生成 C API 文档。

输出位置：

- 自动生成的英文 Markdown：`docs/source/en/develop/python/reference/*.md`。
- 英文导航入口：`docs/source/en/develop/python/reference/index.md`。
- 独立维护的中文 Markdown：`docs/source/zh/develop/python/reference/*.md`。
- 接口覆盖及源码说明质量报告：`docs/build/api/python/summary.json`。

页面复用 C API 的 Markdown 渲染逻辑，中英文使用对应语言的编号标题。
Python 参数表展示名称、实际类型和说明；参数类型、默认值及返回类型取自当前绑定，返回项说明取自 docstring。
“函数”小节先展示 Python 调用，再以“C++ 原型”展示 docstring 原型表中的 C 接口声明。
Python 调用使用实际公开导出路径。
缺失的原型记录到 `source_issues`，不会根据 Python 签名猜测 C 原型。
英文正文保留源码说明。中文 Markdown 与 C/C++ 中文文档一样独立维护，生成器不覆盖或删除中文页面。
生成过程不调用翻译服务；新增或修改接口说明后，需要单独同步中文 Markdown。
接口名、参数名、类型、原型和示例保持不变，不将 C 输出参数直接当作 Python 输入参数。
当前范围是公开函数，常量、枚举及 ctypes 类型不单独生成页面。

模块通过 `_C_API_SIGNATURES` 和 `__all__` 自动发现，并核对公开包实际导出。
全局函数归入 `axcl`，POOL 归入 `axcl.pool`；不生成内部工具和 sample 接口。
遵循现有绑定结构新增、删除或修改接口后，重新构建英文页面并单独更新中文 Markdown，无需维护函数清单。

仅检查英文生成文件是否与当前代码一致：

```bash
python3 docs/scripts/api/api_docgen.py --language python --validate-only
```

校验发现页面缺失、内容过期或 Markdown 结构/链接错误时返回非零退出码。
`summary.json` 中的 `source_issues` 单独记录源码注释缺失、截断及需要审核的 C 指针措辞；
这些内容问题不会被生成器自动改写，也不会因为构建通过就被视为已审核。

在 `docs/` 目录执行：

```bash
make python-api  # 仅更新 Python Markdown
make html        # 更新 C/Python Markdown，再构建 HTML
```

Python HTML 入口为 `docs/build/html/{zh,en}/develop/python/reference/index.html`。
英文生成的 Markdown 带来源标记，请修改 Python docstring 后重新生成，不要直接编辑英文产物；中文 Markdown 按重新生成的英文页面翻译，与 docstring 改动一起提交（见 `kwmex/wf/rule/axcl-doc-rule.md`）。
生成器拒绝覆盖无标记的同名手写页面，仅清理本模式标记的过期 Markdown。
