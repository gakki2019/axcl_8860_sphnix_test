# AXCL API Doc Generator SOP

This directory contains the Python entrypoint and configuration for generating AXCL API Markdown documents from Doxygen XML.

## 1. Environment Setup

Before running the generator, prepare the following dependencies:

- Linux environment. The current design target is Ubuntu 22.04.
- Python 3.10 or later.
- Doxygen 1.9 or later.
- A C compiler such as `gcc` or `cc`. It is required for the error-code probe step.

If Python 3, Doxygen, or the C compiler are not installed, install them first:

```bash
sudo apt update
sudo apt install -y python3 python3-pip doxygen build-essential
```

Then verify the tools:

```bash
python3 --version
doxygen --version
cc --version
```

## 2. How To Run The Python Generator

Main entry:

```bash
python3 docs/scripts/api/api_docgen.py
```

What this command does:

- Creates required output directories automatically.
- Runs Doxygen to generate XML into `docs/build/api/doxygen/xml`.
- Parses XML and generates Markdown.
- Builds error-code probe outputs.
- Writes reports into the report directory.

Common modes:

```bash
python3 docs/scripts/api/api_docgen.py --skip-doxygen
python3 docs/scripts/api/api_docgen.py --validate-only
```

Usage notes:

- Use `--skip-doxygen` only when `docs/build/api/doxygen/xml` already exists and is valid.
- Use `--validate-only` only when generated Markdown and Doxygen XML already exist.
- If the XML directory is missing or empty, the script fails fast and asks you to run without `--skip-doxygen` first.

Generated Markdown paths:

- API index: `docs/source/en/develop/c/index.md`
- API pages: `docs/source/en/develop/c/*_api.md`
- Reference pages: `docs/source/en/develop/c/reference/*.md`

## 3. Config SOP

Configuration directory:

- `docs/scripts/api/config`

Current config file:

- `docs/scripts/api/config/blacklist.yaml`

Current behavior:

- The generator supports group-level blacklist control.
- A blacklisted group is excluded from generated API pages.
- The default config contains `mockApi`.

Config example:

```yaml
version: 1
groups:
  - id: mockApi
    reason: Mock APIs are not part of public reference documentation.
```

How to edit config:

- Add a new item under `groups` to exclude another Doxygen group id.
- Keep `id` aligned with the actual `@defgroup` group id in headers.
- Keep `reason` human-readable. It is written into the report.

## 4. Report Paths And Meanings

Report root:

- `docs/build/api/report`

Main summary:

- `docs/build/api/report/summary.md`

Detailed reports:

- `excluded_by_config.tsv`: APIs filtered out by blacklist config.
- `undefined_defgroup.tsv`: symbols that reference an undefined `@ingroup`.
- `orphaned_symbol.tsv`: public functions that were not assigned to any generated API group.
- `unsupported_symbol_kind.tsv`: top-level symbol kinds currently skipped by the renderer.
- `unsupported_tag.tsv`: unsupported Doxygen tags such as `@pre`, `@post`, or `@example`.
- `broken_link.tsv`: unresolved `@ref` targets or invalid rendered Markdown links.
- `markdown_check.tsv`: generated Markdown structure issues.

Error probe outputs:

- Directory: `docs/build/api/error_probe`
- Typical files include the probe source, host output, device output, and merged TSV results.

## 5. Recommended Daily SOP

1. Activate the Python environment.
2. Check or update `docs/scripts/api/config/blacklist.yaml` if blacklist scope changed.
3. Run `python3 docs/scripts/api/api_docgen.py`.
4. Inspect `docs/build/api/report/summary.md` first.
5. If summary is not clean, open the corresponding TSV report and fix either the source comments or the generator logic.
6. Review generated Markdown under `docs/source/en/develop/c`.

## 6. Troubleshooting

- If `--skip-doxygen` fails, regenerate XML first with the full command.
- If the error probe fails, check whether `cc` or `gcc` is installed and available in `PATH`.
- If API pages are missing, first inspect `docs/build/api/doxygen/xml` and then `docs/build/api/report/orphaned_symbol.tsv` and `docs/build/api/report/excluded_by_config.tsv`.