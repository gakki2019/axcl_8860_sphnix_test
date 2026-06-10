from __future__ import annotations

from pathlib import Path
from xml.etree import ElementTree as ET

project = "AX8860 AXCL"
copyright = "2026, Axera Semiconductor Co., Ltd."
author = "AXCL"
release = "latest"

extensions = [
	"myst_parser",
]

templates_path = ["_templates"]
exclude_patterns = [
	"Thumbs.db",
	".DS_Store",
	"en/asserts/README.md",
	"shared/README.md",
	"en/develop/c/index.md",
	"zh/asserts/README.md",
	"zh/develop/c/index.md",
]

source_suffix = {
	".rst": "restructuredtext",
	".md": "markdown",
}

root_doc = "index"
language = "zh_CN"

myst_enable_extensions = [
	"colon_fence",
	"deflist",
]

suppress_warnings = [
	"myst.xref_missing",
	"toc.not_included",
]

HIDDEN_TOC_LABELS = {
	"函数",
	"参数",
	"返回值",
	"说明",
	"参考",
	"示例",
	"parameters",
	"returns",
	"values",
	"取值",
	"fields",
}

html_theme = "sphinx_rtd_theme"
html_static_path = ["_static"]
html_logo = "_static/img/logo.svg"
html_title = "AX8860 AXCL"
html_show_sourcelink = False
html_copy_source = False
html_css_files = [
	"css/ax-sidebar.css",
]
html_js_files = [
	"js/ax-sidebar.js",
]

html_context = {
	"default_docset": "zh",
}

html_theme_options = {
	"collapse_navigation": False,
	"navigation_depth": 4,
	"sticky_navigation": True,
	"includehidden": False,
	"titles_only": True,
}

html_sidebars = {
	"**": [
		"searchbox.html",
		"globaltoc.html",
	],
}

html_extra_path = []

nitpicky = False

BASE_DIR = Path(__file__).resolve().parent


def _text_content(node: ET.Element) -> str:
	return "".join(node.itertext()).strip()


def _prune_detail_toc_lists(toc_html: str) -> str:
	if not toc_html or not toc_html.strip():
		return toc_html

	try:
		root = ET.fromstring(f"<div>{toc_html}</div>")
	except ET.ParseError:
		return toc_html

	changed = False

	while True:
		removed_any = False

		for parent in root.iter():
			for child in list(parent):
				if child.tag != "ul":
					continue

				direct_items = [item for item in list(child) if item.tag == "li"]
				if not direct_items:
					continue

				labels: list[str] = []
				for item in direct_items:
					link = next((node for node in list(item) if node.tag == "a"), None)
					if link is None:
						labels = []
						break
					labels.append(_text_content(link).lower())

				if labels and all(label in HIDDEN_TOC_LABELS for label in labels):
					parent.remove(child)
					removed_any = True
					changed = True
					break

			if removed_any:
				break

		if not removed_any:
			break

	if not changed:
		return toc_html

	return "".join(
		ET.tostring(child, encoding="unicode", method="html")
		for child in list(root)
	)


def prune_page_toc_detail_sections(app, pagename, templatename, context, doctree):
	toc_html = context.get("toc")
	if not isinstance(toc_html, str):
		return

	context["toc"] = _prune_detail_toc_lists(toc_html)


def setup(app):
	app.connect("html-page-context", prune_page_toc_detail_sections)
