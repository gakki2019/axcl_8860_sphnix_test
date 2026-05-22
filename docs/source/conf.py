from __future__ import annotations

from pathlib import Path

project = "AXCL SDK Documentation"
copyright = "2026, AXCL"
author = "AXCL"
release = "latest"

extensions = [
	"myst_parser",
]

templates_path = ["_templates"]
exclude_patterns = [
	"build",
	"Thumbs.db",
	".DS_Store",
	"en/asserts/README.md",
	"shared/README.md",
	"en/develop/c/index.md",
	"zh/asserts/README.md",
	"zh/develop/c/index.md",
	"zh/en/**",
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
html_title = "AXCL SDK Documentation"
html_show_sourcelink = False
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
	"titles_only": False,
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