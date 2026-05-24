from __future__ import annotations

from pathlib import Path

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

html_theme = "sphinx_rtd_theme"
html_static_path = ["_static"]
html_logo = "_static/img/logo.svg"
html_title = "AX8860 AXCL"
html_show_sourcelink = False
html_copy_source = False
html_css_files = [
	"css/axcl-sidebar.css",
]
html_js_files = [
	"js/axcl-sidebar.js",
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