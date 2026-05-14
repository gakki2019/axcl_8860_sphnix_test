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

- 支持按 Doxygen group id 做 blacklist 过滤。
- 被 blacklist 的 group 不会生成 API 页面。
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

- `excluded_by_config.tsv`：被 blacklist 过滤掉的 API 明细。
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
3. 执行 `python3 docs/scripts/api/api_docgen.py`。
4. 优先查看 `docs/build/api/report/summary.md`。
5. 如果 summary 不干净，再打开对应 TSV 明细定位问题。
6. 最后检查 `docs/source/en/develop/c` 下的生成文档是否符合预期。

## 6. 常见问题

- 如果 `--skip-doxygen` 报错，说明 XML 不存在或不完整，应先执行完整生成。
- 如果错误码探针失败，优先检查 `cc` 或 `gcc` 是否安装并在 `PATH` 中可用。
- 如果没有生成 API 页面，先检查 `docs/build/api/doxygen/xml` 是否有内容，再检查 `docs/build/api/report/orphaned_symbol.tsv` 和 `docs/build/api/report/excluded_by_config.tsv`。