#!/usr/bin/env python3

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import textwrap
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable
import xml.etree.ElementTree as ET
import yaml


REPO_ROOT = Path(__file__).resolve().parents[3]
INCLUDE_DIR = REPO_ROOT / "include" / "external"
DESIGN_DIR = REPO_ROOT / "design"
DOCS_ROOT = REPO_ROOT / "docs"
BUILD_ROOT = DOCS_ROOT / "build" / "api"
DOXYGEN_ROOT = BUILD_ROOT / "doxygen"
DOXYGEN_XML_DIR = DOXYGEN_ROOT / "xml"
REPORT_DIR = BUILD_ROOT / "report"
ERROR_PROBE_DIR = BUILD_ROOT / "error_probe"
MD_ROOT = DOCS_ROOT / "source" / "en" / "develop" / "c"
MD_EN_ROOT = MD_ROOT
REFERENCE_ROOT = MD_ROOT / "reference"
CONFIG_ROOT = DOCS_ROOT / "scripts" / "api" / "config"
BLACKLIST_PATH = CONFIG_ROOT / "blacklist.yaml"
DOXYFILE_PATH = DOCS_ROOT / "scripts" / "api" / "api.doxyfile"

REPORT_HEADERS = {
    "excluded_by_config.tsv": [
        "group_id",
        "group_title",
        "symbol",
        "kind",
        "file",
        "line",
        "reason",
    ],
    "undefined_defgroup.tsv": [
        "severity",
        "symbol",
        "kind",
        "missing_group_id",
        "file",
        "line",
        "message",
    ],
    "orphaned_symbol.tsv": [
        "severity",
        "symbol",
        "kind",
        "file",
        "line",
        "message",
    ],
    "unsupported_symbol_kind.tsv": [
        "severity",
        "symbol",
        "kind",
        "group_id",
        "file",
        "line",
        "action",
    ],
    "unsupported_tag.tsv": [
        "severity",
        "symbol",
        "tag",
        "file",
        "line",
        "message",
    ],
    "broken_link.tsv": [
        "severity",
        "source_page",
        "source_symbol",
        "ref",
        "target",
        "file",
        "line",
        "message",
    ],
    "markdown_check.tsv": [
        "severity",
        "page",
        "line",
        "rule",
        "message",
    ],
}

ALLOWED_TOP_LEVEL_KINDS = {"define", "enum", "typedef", "function"}
UNSUPPORTED_TAGS = {"pre": "ERROR", "post": "ERROR", "example": "ERROR"}


@dataclass
class ReportRow:
    values: list[str]


@dataclass
class ReportBook:
    rows: dict[str, list[ReportRow]] = field(
        default_factory=lambda: {name: [] for name in REPORT_HEADERS}
    )

    def add(self, report_name: str, *values: object) -> None:
        rendered = [str(value) if value is not None else "" for value in values]
        self.rows[report_name].append(ReportRow(rendered))

    def write(self) -> None:
        REPORT_DIR.mkdir(parents=True, exist_ok=True)
        for name, headers in REPORT_HEADERS.items():
            path = REPORT_DIR / name
            lines = ["\t".join(headers)]
            lines.extend("\t".join(row.values) for row in self.rows[name])
            path.write_text("\n".join(lines) + "\n", encoding="utf-8")

        summary_lines = [
            "# API Doc Generation Summary",
            "",
            "## Report Counts",
            "",
        ]
        for name in REPORT_HEADERS:
            severity_counter = Counter()
            for row in self.rows[name]:
                if row.values and row.values[0] in {"ERROR", "WARN", "INFO"}:
                    severity_counter[row.values[0]] += 1
            if name == "excluded_by_config.tsv":
                severity_counter["INFO"] = len(self.rows[name])
            total = len(self.rows[name])
            details = ", ".join(
                f"{level}: {severity_counter[level]}"
                for level in ("ERROR", "WARN", "INFO")
                if severity_counter[level]
            )
            if not details:
                details = "ERROR: 0, WARN: 0, INFO: 0"
            summary_lines.append(f"- [{name}]({name}): {total} records ({details})")
        summary_lines.extend(["", "## Output Roots", "", "- docs/source/en/develop/c", "- docs/build/api", ""])
        (REPORT_DIR / "summary.md").write_text("\n".join(summary_lines), encoding="utf-8")


@dataclass
class ParamDoc:
    name: str
    direction: str
    description: str


@dataclass
class ReturnDoc:
    label: str
    description: str


@dataclass
class FunctionDoc:
    symbol: str
    group_id: str
    group_title: str
    file: str
    line: int
    brief: str
    signature: str
    params: list[ParamDoc]
    returns: list[ReturnDoc]
    return_texts: list[str]
    notes: list[str]
    remarks: list[str]
    warnings: list[str]
    restrictions: list[str]
    examples: list[str]
    refs: list[tuple[str, int]]


@dataclass
class MacroDoc:
    symbol: str
    file: str
    line: int
    brief: str
    details: str
    remarks: list[str]
    warnings: list[str]
    initializer: str


@dataclass
class TypedefDoc:
    symbol: str
    file: str
    line: int
    brief: str
    details: str
    remarks: list[str]
    warnings: list[str]
    definition: str
    type_text: str


@dataclass
class EnumValueDoc:
    symbol: str
    initializer: str
    description: str


@dataclass
class EnumDoc:
    symbol: str
    file: str
    line: int
    brief: str
    details: str
    remarks: list[str]
    warnings: list[str]
    definition: str
    values: list[EnumValueDoc]


@dataclass
class StructFieldDoc:
    symbol: str
    type_text: str
    description: str


@dataclass
class StructDoc:
    symbol: str
    file: str
    line: int
    brief: str
    details: str
    remarks: list[str]
    warnings: list[str]
    definition: str
    fields: list[StructFieldDoc]


@dataclass
class SymbolLocation:
    symbol: str
    page: Path
    anchor: str
    kind: str


@dataclass
class SourceCommentRecord:
    file: str
    line: int
    symbol: str
    kind: str
    ingroups: list[str]
    unsupported_tags: list[tuple[str, int]]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate AXCL API Markdown docs from Doxygen XML.")
    parser.add_argument("--skip-doxygen", action="store_true", help="Reuse existing Doxygen XML.")
    parser.add_argument("--validate-only", action="store_true", help="Validate generated Markdown and reports only.")
    return parser.parse_args()


def ensure_directories() -> None:
    for path in [
        DOXYGEN_XML_DIR,
        REPORT_DIR,
        ERROR_PROBE_DIR,
        MD_EN_ROOT,
        REFERENCE_ROOT,
        CONFIG_ROOT,
    ]:
        path.mkdir(parents=True, exist_ok=True)


def load_blacklist(path: Path) -> dict[str, str]:
    blacklist: dict[str, str] = {}
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    if data and "groups" in data:
        for item in data["groups"]:
            if "id" in item:
                blacklist[item["id"]] = item.get("reason", "")
    return blacklist


def run_doxygen() -> None:
    shutil.rmtree(DOXYGEN_ROOT, ignore_errors=True)
    DOXYGEN_ROOT.mkdir(parents=True, exist_ok=True)
    subprocess.run(["doxygen", str(DOXYFILE_PATH)], cwd=REPO_ROOT, check=True)


def ensure_doxygen_xml_available() -> None:
    if not DOXYGEN_XML_DIR.exists():
        raise FileNotFoundError(
            f"Missing Doxygen XML directory: {DOXYGEN_XML_DIR}. Run without --skip-doxygen first."
        )
    if not any(DOXYGEN_XML_DIR.glob("*.xml")):
        raise FileNotFoundError(
            f"No Doxygen XML files found in {DOXYGEN_XML_DIR}. Run without --skip-doxygen first."
        )
    if not (DOXYGEN_XML_DIR / "index.xml").exists():
        raise FileNotFoundError(
            f"Missing {DOXYGEN_XML_DIR / 'index.xml'}. Run without --skip-doxygen first."
        )


def xml_text(node: ET.Element | None) -> str:
    if node is None:
        return ""
    pieces: list[str] = []

    def walk(element: ET.Element) -> None:
        if element.tag == "sp":
            pieces.append(" ")
        if element.text:
            pieces.append(element.text)
        for child in element:
            if child.tag == "ref":
                raw_target = "".join(child.itertext()).strip()
                target, suffix = split_ref_text(raw_target)
                pieces.append(f"@@REF:{target}@@{suffix}")
            elif child.tag == "linebreak":
                pieces.append("\n")
            else:
                walk(child)
            if child.tail:
                pieces.append(child.tail)

    walk(node)
    text = "".join(pieces)
    text = text.replace("\xa0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" ?\n ?", "\n", text)
    return text.strip()


def extract_refs(node: ET.Element | None) -> list[str]:
    if node is None:
        return []
    refs: list[str] = []
    for ref in node.findall(".//ref"):
        target = "".join(ref.itertext()).strip()
        if target:
            refs.append(target)
    return refs


def extract_token_refs(text: str) -> list[str]:
    refs: list[str] = []
    for match in re.finditer(r"@@REF:([^@]+)@@", text):
        refs.append(match.group(1))
    return refs


def strip_ref_tokens(text: str) -> str:
    return re.sub(r"@@REF:([^@]+)@@", lambda match: match.group(1), text)


def normalize_enum_initializer(text: str) -> str:
    return re.sub(r"^=\s*", "", strip_ref_tokens(text)).strip()


def normalize_file_path(path_str: str) -> str:
    if not path_str:
        return ""
    p = Path(path_str)
    if p.is_absolute():
        try:
            return p.relative_to(REPO_ROOT).as_posix()
        except ValueError:
            pass
    return path_str


def normalize_paragraphs(text: str) -> str:
    lines = [line.rstrip() for line in text.splitlines()]
    while lines and not lines[0]:
        lines.pop(0)
    while lines and not lines[-1]:
        lines.pop()
    compact: list[str] = []
    previous_blank = False
    for line in lines:
        is_blank = not line.strip()
        if is_blank and previous_blank:
            continue
        compact.append(line)
        previous_blank = is_blank
    return "\n".join(compact).strip()


def split_ref_text(raw_target: str) -> tuple[str, str]:
    target = raw_target.strip()
    suffix = ""
    if target.endswith("()"):
        target = target[:-2]
        suffix = "()"
    while target and target[-1] in ".,;:":
        suffix = target[-1] + suffix
        target = target[:-1]
    return target.strip(), suffix


def section_texts(member: ET.Element, kind: str) -> list[str]:
    texts: list[str] = []
    for section in member.findall(f".//simplesect[@kind='{kind}']"):
        text = normalize_paragraphs(xml_text(section))
        if text:
            texts.append(text)
    return texts


def parse_programlisting(programlisting: ET.Element) -> str:
    def collect_code_text(node: ET.Element) -> str:
        parts: list[str] = []
        if node.tag == "sp":
            return " "
        if node.tag == "ref":
            return "".join(node.itertext())
        if node.text:
            parts.append(node.text)
        for child in node:
            parts.append(collect_code_text(child))
            if child.tail:
                parts.append(child.tail)
        return "".join(parts)

    lines: list[str] = []
    for codeline in programlisting.findall("codeline"):
        line = collect_code_text(codeline).rstrip()
        lines.append(line)
    return "\n".join(lines).rstrip()


def parse_examples(member: ET.Element) -> list[str]:
    blocks: list[str] = []
    for section in member.findall(".//simplesect[@kind='par']"):
        title = normalize_paragraphs(xml_text(section.find("title")))
        if title != "Example":
            continue
        programlisting = section.find(".//programlisting")
        if programlisting is None:
            text = normalize_paragraphs(xml_text(section))
            if text:
                blocks.append(text)
            continue
        code = parse_programlisting(programlisting)
        filename = programlisting.get("filename", "")
        language = ""
        if filename.startswith(".") and len(filename) > 1:
            language = filename[1:].lower()
        fence = "```"
        if language:
            fence = f"```{language}"
        blocks.append(f"{fence}\n{code}\n```")
    return blocks


def parse_restrictions(member: ET.Element) -> list[str]:
    restrictions: list[str] = []
    for section in member.findall(".//simplesect[@kind='par']"):
        title = normalize_paragraphs(xml_text(section.find("title")))
        if title != "Restriction":
            continue
        text = normalize_paragraphs(xml_text(section))
        if text:
            # text contains "Restriction" at the beginning since xml_text concatenates it without spacing
            if text.startswith("Restriction"):
                text = text[11:].lstrip()
            restrictions.append(text)
    return restrictions


def resolve_links(text: str, refs: list[str], symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook, source_page: Path, source_symbol: str, line: int) -> str:
    ref_names = list(dict.fromkeys([*refs, *extract_token_refs(text)]))
    ref_names.sort(key=len, reverse=True)

    replacements: dict[str, str] = {}
    for ref_name in ref_names:
        token = f"@@REF:{ref_name}@@"
        if ref_name in duplicates or ref_name not in symbol_index:
            report.add(
                "broken_link.tsv",
                "ERROR",
                source_page.relative_to(MD_ROOT).as_posix(),
                source_symbol,
                ref_name,
                "",
                source_page.relative_to(REPO_ROOT).as_posix(),
                line,
                f"Unable to resolve @ref target '{ref_name}'.",
            )
            replacements[token] = ref_name
            continue
        location = symbol_index[ref_name]
        target_path = os.path.relpath(location.page, source_page.parent).replace(os.sep, "/")
        if location.page == source_page:
            link = f"[{ref_name}](#{location.anchor})"
        else:
            link = f"[{ref_name}]({target_path}#{location.anchor})"
        replacements[token] = link

    def replacer(match: re.Match) -> str:
        return replacements.get(match.group(0), match.group(0))

    return re.sub(r"@@REF:[^@]+@@", replacer, text)


def normalized_refs(refs: list[tuple[str, int]]) -> list[str]:
    values: list[str] = []
    for raw_name, _ in refs:
        name, _ = split_ref_text(raw_name)
        if name:
            values.append(name)
    return values


def sanitize_filename(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")
    return slug or "api"


def parse_parameter_list(member: ET.Element, kind: str) -> list[tuple[str, str, str]]:
    records: list[tuple[str, str, str]] = []
    for plist in member.findall(f".//parameterlist[@kind='{kind}']"):
        for item in plist.findall("parameteritem"):
            names = item.findall("parameternamelist/parametername")
            descriptions = item.findall("parameterdescription")
            description = normalize_paragraphs("\n".join(xml_text(desc) for desc in descriptions))
            for name in names:
                records.append((name.text or "", name.get("direction", ""), description))
    return records


def parse_functions(report: ReportBook) -> tuple[dict[str, str], dict[str, str], list[FunctionDoc], dict[str, list[FunctionDoc]]]:
    group_titles: dict[str, str] = {}
    group_pages: dict[str, str] = {}
    functions: list[FunctionDoc] = []
    by_group: dict[str, list[FunctionDoc]] = defaultdict(list)
    for path in sorted(DOXYGEN_XML_DIR.glob("group__*.xml")):
        root = ET.parse(path).getroot()
        compound = root.find("compounddef")
        if compound is None or compound.get("kind") != "group":
            continue
        group_id = normalize_paragraphs(xml_text(compound.find("compoundname")))
        group_title = normalize_paragraphs(xml_text(compound.find("title")))
        group_titles[group_id] = group_title
        group_pages[group_id] = f"{sanitize_filename(group_title)}_api.md"
        for member in compound.findall(".//memberdef[@kind='function']"):
            location = member.find("location")
            file_path = normalize_file_path((location.get("file") if location is not None else "") or "")
            line = int(location.get("line", "0")) if location is not None else 0
            signature = f"{normalize_paragraphs(xml_text(member.find('definition')))}{normalize_paragraphs(xml_text(member.find('argsstring')))};"
            params = [
                ParamDoc(name, direction, description)
                for name, direction, description in parse_parameter_list(member, "param")
            ]
            returns = [
                ReturnDoc(name, description)
                for name, _, description in parse_parameter_list(member, "retval")
            ]
            return_texts = [normalize_paragraphs(xml_text(section)) for section in member.findall(".//simplesect[@kind='return']")]
            function = FunctionDoc(
                symbol=normalize_paragraphs(xml_text(member.find("name"))),
                group_id=group_id,
                group_title=group_title,
                file=file_path,
                line=line,
                brief=normalize_paragraphs(xml_text(member.find("briefdescription"))),
                signature=signature.strip(),
                params=params,
                returns=returns,
                return_texts=[text for text in return_texts if text],
                notes=section_texts(member, "note"),
                remarks=section_texts(member, "remark") + section_texts(member, "see"),
                warnings=section_texts(member, "warning") + section_texts(member, "attention"),
                restrictions=parse_restrictions(member),
                examples=parse_examples(member),
                refs=[(split_ref_text(name)[0], line) for name in extract_refs(member) if split_ref_text(name)[0]],
            )
            functions.append(function)
            by_group[group_id].append(function)
    return group_titles, group_pages, functions, by_group


def parse_reference_data(report: ReportBook) -> tuple[list[MacroDoc], list[MacroDoc], list[TypedefDoc], list[EnumDoc], list[StructDoc]]:
    macros: list[MacroDoc] = []
    error_macros: list[MacroDoc] = []
    typedefs: list[TypedefDoc] = []
    enums: list[EnumDoc] = []
    structs: list[StructDoc] = []

    for path in sorted(DOXYGEN_XML_DIR.glob("*.xml")):
        if path.name.startswith("group__") or path.name.startswith("struct"):
            continue
        root = ET.parse(path).getroot()
        compound = root.find("compounddef")
        if compound is None or compound.get("kind") != "file":
            continue
        for member in compound.findall(".//memberdef"):
            kind = member.get("kind", "")
            location = member.find("location")
            file_path = normalize_file_path((location.get("file") if location is not None else "") or "")
            line = int(location.get("line", "0")) if location is not None else 0
            symbol = normalize_paragraphs(xml_text(member.find("name")))
            if kind not in ALLOWED_TOP_LEVEL_KINDS:
                report.add(
                    "unsupported_symbol_kind.tsv",
                    "WARN",
                    symbol,
                    kind,
                    "",
                    file_path,
                    line,
                    "Skip unsupported top-level Doxygen kind during rendering.",
                )
                continue
            if kind == "define":
                macro = MacroDoc(
                    symbol=symbol,
                    file=file_path,
                    line=line,
                    brief=normalize_paragraphs(xml_text(member.find("briefdescription"))),
                    details=normalize_paragraphs(xml_text(member.find("detaileddescription"))),
                    remarks=section_texts(member, "remark") + section_texts(member, "see"),
                    warnings=section_texts(member, "warning") + section_texts(member, "attention"),
                    initializer=normalize_paragraphs(xml_text(member.find("initializer"))),
                )
                if symbol.startswith("AXCL_ERR_"):
                    error_macros.append(macro)
                else:
                    macros.append(macro)
            elif kind == "typedef":
                typedefs.append(
                    TypedefDoc(
                        symbol=symbol,
                        file=file_path,
                        line=line,
                        brief=normalize_paragraphs(xml_text(member.find("briefdescription"))),
                        details=normalize_paragraphs(xml_text(member.find("detaileddescription"))),
                        remarks=section_texts(member, "remark") + section_texts(member, "see"),
                        warnings=section_texts(member, "warning") + section_texts(member, "attention"),
                        definition=normalize_paragraphs(xml_text(member.find("definition"))),
                        type_text=normalize_paragraphs(xml_text(member.find("type"))),
                    )
                )
            elif kind == "enum":
                values: list[EnumValueDoc] = []
                for enumvalue in member.findall("enumvalue"):
                    values.append(
                        EnumValueDoc(
                            symbol=normalize_paragraphs(xml_text(enumvalue.find("name"))),
                            initializer=normalize_paragraphs(xml_text(enumvalue.find("initializer"))),
                            description=normalize_paragraphs(xml_text(enumvalue.find("briefdescription")))
                            or normalize_paragraphs(xml_text(enumvalue.find("detaileddescription"))),
                        )
                    )
                body_file = (location.get("bodyfile") if location is not None else None) or file_path
                body_start = int((location.get("bodystart") if location is not None else None) or line or 0)
                body_end = int((location.get("bodyend") if location is not None else None) or line or 0)
                definition = read_source_span(body_file, body_start, body_end)
                if not definition:
                    definition_lines = [f"typedef enum {symbol} {{"]
                    for index, value in enumerate(values):
                        suffix = "," if index < len(values) - 1 else ""
                        definition_lines.append(f"    {value.symbol} {value.initializer}{suffix}")
                    definition_lines.append(f"}} {symbol};")
                    definition = "\n".join(definition_lines)
                enums.append(
                    EnumDoc(
                        symbol=symbol,
                        file=file_path,
                        line=line,
                        brief=normalize_paragraphs(xml_text(member.find("briefdescription"))),
                        details=normalize_paragraphs(xml_text(member.find("detaileddescription"))),
                        remarks=section_texts(member, "remark") + section_texts(member, "see"),
                        warnings=section_texts(member, "warning") + section_texts(member, "attention"),
                        definition=definition,
                        values=values,
                    )
                )

    for path in sorted(DOXYGEN_XML_DIR.glob("struct*.xml")):
        root = ET.parse(path).getroot()
        compound = root.find("compounddef")
        if compound is None or compound.get("kind") != "struct":
            continue
        location = compound.find("location")
        file_path = normalize_file_path((location.get("file") if location is not None else "") or "")
        line = int(location.get("line", "0")) if location is not None else 0
        fields: list[StructFieldDoc] = []
        for member in compound.findall(".//memberdef[@kind='variable']"):
            fields.append(
                StructFieldDoc(
                    symbol=normalize_paragraphs(xml_text(member.find("name"))),
                    type_text=(normalize_paragraphs(xml_text(member.find("type"))) + normalize_paragraphs(xml_text(member.find("argsstring")))).strip(),
                    description=normalize_paragraphs(xml_text(member.find("briefdescription")))
                    or normalize_paragraphs(xml_text(member.find("detaileddescription"))),
                )
            )
        body_file = (location.get("bodyfile") if location is not None else None) or file_path
        body_start = int((location.get("bodystart") if location is not None else None) or line or 0)
        body_end = int((location.get("bodyend") if location is not None else None) or line or 0)
        definition = read_source_span(body_file, body_start, body_end)
        if not definition:
            definition_lines = [f"typedef struct {normalize_paragraphs(xml_text(compound.find('compoundname')))} {{"]
            for field in fields:
                definition_lines.append(f"    {field.type_text} {field.symbol};")
            definition_lines.append(f"}} {normalize_paragraphs(xml_text(compound.find('compoundname')))};")
            definition = "\n".join(definition_lines)
        structs.append(
            StructDoc(
                symbol=normalize_paragraphs(xml_text(compound.find("compoundname"))),
                file=file_path,
                line=line,
                brief=normalize_paragraphs(xml_text(compound.find("briefdescription"))),
                details=normalize_paragraphs(xml_text(compound.find("detaileddescription"))),
                remarks=section_texts(compound, "remark") + section_texts(compound, "see"),
                warnings=section_texts(compound, "warning") + section_texts(compound, "attention"),
                definition=definition,
                fields=fields,
            )
        )

    macros.sort(key=lambda item: item.symbol)
    error_macros.sort(key=lambda item: item.symbol)
    typedefs.sort(key=lambda item: item.symbol)
    enums.sort(key=lambda item: item.symbol)
    structs.sort(key=lambda item: item.symbol)
    return macros, error_macros, typedefs, enums, structs


def scan_source_comments(blacklist: dict[str, str]) -> tuple[set[str], list[SourceCommentRecord]]:
    group_defs: set[str] = set()
    records: list[SourceCommentRecord] = []
    block_pattern = re.compile(r"/\*\*(.*?)\*/", re.DOTALL)

    def line_for_offset(offset: int, line_starts: list[int]) -> int:
        line = 1
        for start in line_starts:
            if start > offset:
                break
            line += 1
        return line - 1

    for path in sorted(INCLUDE_DIR.glob("*.h")):
        content = path.read_text(encoding="utf-8")
        line_starts = [0]
        for match in re.finditer(r"\n", content):
            line_starts.append(match.end())

        for block in block_pattern.finditer(content):
            block_text = block.group(1)
            block_start_line = line_for_offset(block.start(), line_starts)
            for match in re.finditer(r"@defgroup\s+(\w+)", block_text):
                group_defs.add(match.group(1))

            next_pos = block.end()
            remainder = content[next_pos:]
            symbol = ""
            kind = "unknown"
            decl_line = block_start_line
            for raw_line in remainder.splitlines():
                stripped = raw_line.strip()
                decl_line += 1
                if not stripped:
                    continue
                if stripped.startswith("/**"):
                    break
                if stripped.startswith("#define"):
                    parts = stripped.split()
                    if len(parts) >= 2:
                        symbol = parts[1].split("(")[0]
                        kind = "define"
                    break
                collected = stripped
                if stripped.endswith(";") or "(" in stripped:
                    function_match = re.search(r"([A-Za-z_]\w*)\s*\(", collected)
                    typedef_match = re.search(r"}\s*([A-Za-z_]\w*)\s*;", collected)
                    alias_match = re.search(r"typedef\s+.*?([A-Za-z_]\w*)\s*;", collected)
                    if function_match and not stripped.startswith(("if", "for", "while")):
                        symbol = function_match.group(1)
                        kind = "function"
                    elif typedef_match:
                        symbol = typedef_match.group(1)
                        kind = "typedef"
                    elif alias_match:
                        symbol = alias_match.group(1)
                        kind = "typedef"
                    break

            ingroups = re.findall(r"@ingroup\s+(\w+)", block_text)
            unsupported: list[tuple[str, int]] = []
            for tag in UNSUPPORTED_TAGS:
                for match in re.finditer(rf"@{tag}\b", block_text):
                    tag_line = block_start_line + block_text[: match.start()].count("\n")
                    unsupported.append((tag, tag_line))
            if ingroups or unsupported:
                records.append(
                    SourceCommentRecord(
                        file=path.relative_to(REPO_ROOT).as_posix(),
                        line=decl_line,
                        symbol=symbol,
                        kind=kind,
                        ingroups=ingroups,
                        unsupported_tags=unsupported,
                    )
                )
    return group_defs, records


def collect_undefined_groups(report: ReportBook, blacklist: dict[str, str], group_defs: set[str], records: list[SourceCommentRecord]) -> None:
    for record in records:
        for group_id in record.ingroups:
            if group_id in group_defs or group_id in blacklist:
                continue
            report.add(
                "undefined_defgroup.tsv",
                "ERROR",
                record.symbol,
                record.kind,
                group_id,
                record.file,
                record.line,
                f"Symbol references undefined group '{group_id}'.",
            )


def collect_unsupported_tags(report: ReportBook, records: list[SourceCommentRecord]) -> None:
    for record in records:
        for tag, line in record.unsupported_tags:
            report.add(
                "unsupported_tag.tsv",
                UNSUPPORTED_TAGS[tag],
                record.symbol,
                f"@{tag}",
                record.file,
                line,
                f"Tag '@{tag}' is not supported by the Markdown generator.",
            )


def collect_orphaned_symbols(report: ReportBook, functions: list[FunctionDoc], group_titles: dict[str, str], blacklist: dict[str, str]) -> None:
    grouped = {function.symbol for function in functions if function.group_id in group_titles}
    for path in sorted(DOXYGEN_XML_DIR.glob("*.xml")):
        if path.name.startswith("group__") or path.name.startswith("struct"):
            continue
        root = ET.parse(path).getroot()
        compound = root.find("compounddef")
        if compound is None or compound.get("kind") != "file":
            continue
        for member in compound.findall(".//memberdef[@kind='function']"):
            symbol = normalize_paragraphs(xml_text(member.find("name")))
            if symbol in grouped:
                continue
            location = member.find("location")
            file_path = normalize_file_path((location.get("file") if location is not None else "") or "")
            line = int(location.get("line", "0")) if location is not None else 0
            report.add(
                "orphaned_symbol.tsv",
                "WARN",
                symbol,
                "function",
                file_path,
                line,
                "Public function is not assigned to a generated API group.",
            )


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix == ".md":
        text = normalize_markdown_spacing(text)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def normalize_markdown_spacing(text: str) -> str:
    lines = text.splitlines()
    normalized: list[str] = []
    in_code_block = False
    pending_blank = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            if pending_blank and normalized and normalized[-1] != "":
                normalized.append("")
            pending_blank = False
            normalized.append(line)
            in_code_block = not in_code_block
            continue
        if in_code_block:
            normalized.append(line)
            continue
        if stripped == "":
            pending_blank = True
            continue
        if pending_blank and normalized and normalized[-1] != "":
            normalized.append("")
        pending_blank = False
        normalized.append(line)
    if pending_blank and normalized and normalized[-1] != "":
        normalized.append("")
    return "\n".join(normalized)


def read_source_span(file_path: str, start_line: int, end_line: int) -> str:
    if not file_path or start_line <= 0 or end_line <= 0 or end_line < start_line:
        return ""
    source_path = Path(file_path)
    if not source_path.is_absolute():
        source_path = REPO_ROOT / source_path
    if not source_path.exists():
        return ""
    lines = source_path.read_text(encoding="utf-8").splitlines()
    if start_line > len(lines):
        return ""
    end_line = min(end_line, len(lines))
    return "\n".join(lines[start_line - 1 : end_line])


def render_bullets(items: list[str]) -> str:
    if not items:
        return "N/A"
    if len(items) == 1 and "\n" not in items[0]:
        return items[0]
    return "\n".join(f"- {item}" for item in items)


def append_heading(lines: list[str], heading: str, level: int, insert_br: bool) -> None:
    if insert_br and lines:
        if lines[-1] != "":
            lines.append("")
        lines.extend(["<br>", ""])
    elif lines:
        if lines[-1] != "":
            lines.append("")
    lines.append(f"{'#' * level} {heading}")
    lines.append("")


def append_anchored_heading(lines: list[str], heading: str, level: int, insert_br: bool) -> None:
    if insert_br and lines:
        if lines[-1] != "":
            lines.append("")
        lines.extend(["<br>", ""])
    elif lines and lines[-1] != "":
        lines.append("")
    lines.extend([f'<a id="{heading}"></a>', "", f"{'#' * level} {heading}", ""])


def has_br_spacing_before_heading(lines: list[str], line_index: int) -> bool:
    scan_start = line_index - 2
    scan_end = max(-1, scan_start - 8)
    for offset in range(scan_start, scan_end, -1):
        stripped = lines[offset].strip()
        if not stripped:
            continue
        if stripped.startswith("<a id=") and stripped.endswith("</a>"):
            continue
        return stripped == "<br>"
    return False


def render_parameters(params: list[ParamDoc]) -> str:
    if not params:
        return "N/A"
    lines = ["| Name | Direction | Description |", "|---|---|---|"]
    for param in params:
        direction = param.direction or "-"
        description = (param.description or "").replace("\n", "<br>") or "-"
        lines.append(f"| {param.name} | {direction} | {description} |")
    return "\n".join(lines)


def render_parameters_with_links(function: FunctionDoc, page_path: Path, symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook) -> str:
    if not function.params:
        return "N/A"
    lines = ["| Name | Direction | Description |", "|---|---|---|"]
    refs = normalized_refs(function.refs)
    for param in function.params:
        direction = param.direction or "-"
        description = resolve_links(param.description or "-", refs, symbol_index, duplicates, report, page_path, function.symbol, function.line).replace("\n", "<br>")
        lines.append(f"| {param.name} | {direction} | {description} |")
    return "\n".join(lines)


def render_returns(function: FunctionDoc) -> str:
    if function.returns:
        return "\n".join(f"- `{item.label}`: {item.description}" for item in function.returns)
    if function.return_texts:
        return render_bullets(function.return_texts)
    return "N/A"


def render_returns_with_links(function: FunctionDoc, page_path: Path, symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook) -> str:
    refs = normalized_refs(function.refs)
    if function.returns:
        return "\n".join(
            f"- `{item.label}`: {resolve_links(item.description, refs, symbol_index, duplicates, report, page_path, function.symbol, function.line)}"
            for item in function.returns
        )
    if function.return_texts:
        return "\n".join(
            f"- {resolve_links(item, refs, symbol_index, duplicates, report, page_path, function.symbol, function.line)}"
            for item in function.return_texts
        )
    return "N/A"


def render_function_page(functions: list[FunctionDoc], page_path: Path, symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook, group_title: str) -> str:
    lines = [f"# {group_title}", ""]
    append_heading(lines, "Index", 2, insert_br=False)
    if functions:
        for function in functions:
            lines.append(f"- [{function.symbol}](#{function.symbol})")
    else:
        lines.append("No API functions.")
    append_heading(lines, "API", 2, insert_br=True)

    first_function = True
    for function in functions:
        refs = normalized_refs(function.refs)
        append_anchored_heading(lines, function.symbol, 3, insert_br=not first_function)
        first_function = False
        lines.append(resolve_links(function.brief, refs, symbol_index, duplicates, report, page_path, function.symbol, function.line))
        lines.extend(["", "#### Function", "", "```c", function.signature or "N/A", "```", "", "#### Parameters", "", render_parameters_with_links(function, page_path, symbol_index, duplicates, report), "", "#### Returns", "", render_returns_with_links(function, page_path, symbol_index, duplicates, report), ""])

        optional_sections = [
            ("Note", function.notes),
            ("Remark", function.remarks),
            ("Warning", function.warnings),
            ("Restriction", function.restrictions),
            ("Example", function.examples),
        ]
        for title, contents in optional_sections:
            if not contents:
                continue
            lines.extend([f"#### {title}", ""])
            for content in contents:
                lines.append(resolve_links(content, refs, symbol_index, duplicates, report, page_path, function.symbol, function.line))
                lines.append("")
    return "\n".join(lines)


def render_index(group_pages: dict[str, str], group_titles: dict[str, str]) -> str:
    lines = ["# AXCL API Index", ""]
    append_heading(lines, "API Pages", 2, insert_br=False)
    for group_id, filename in sorted(group_pages.items(), key=lambda item: group_titles[item[0]]):
        lines.append(f"- [{group_titles[group_id]} API]({filename})")
    append_heading(lines, "Reference Pages", 2, insert_br=True)
    lines.extend(["- [Enums](reference/enum.md)", "- [Structures and Type Definitions](reference/struct.md)", "- [Macros](reference/macro.md)", "- [Error Codes](reference/error.md)"])
    return "\n".join(lines)


def append_reference_sections(lines: list[str], sections: list[tuple[str, list[str]]], page_path: Path, symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook, source_symbol: str, line: int, insert_br: bool = False) -> None:
    for title, contents in sections:
        if not contents:
            continue
        append_heading(lines, title, 3, insert_br=insert_br)
        for content in contents:
            lines.append(resolve_links(content, [], symbol_index, duplicates, report, page_path, source_symbol, line))
            lines.append("")


def render_macro_page(macros: list[MacroDoc], page_path: Path, symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook) -> str:
    lines = ["# Macro", ""]
    first_macro = True
    for macro in macros:
        append_anchored_heading(lines, macro.symbol, 2, insert_br=not first_macro)
        first_macro = False
        lines.extend(["", resolve_links(macro.brief or macro.details or "", [], symbol_index, duplicates, report, page_path, macro.symbol, macro.line), ""])
        lines.extend(["```c", strip_ref_tokens(f"#define {macro.symbol} {macro.initializer}".rstrip()), "```", ""])
        append_reference_sections(lines, [("Remark", macro.remarks), ("Warning", macro.warnings)], page_path, symbol_index, duplicates, report, macro.symbol, macro.line)
    return "\n".join(lines)


def render_struct_page(structs: list[StructDoc], typedefs: list[TypedefDoc], page_path: Path, symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook) -> str:
    lines = ["# Structure", ""]
    first_struct = True
    for struct_doc in structs:
        append_anchored_heading(lines, struct_doc.symbol, 2, insert_br=not first_struct)
        first_struct = False
        lines.extend(["", resolve_links(struct_doc.brief or struct_doc.details or "", [], symbol_index, duplicates, report, page_path, struct_doc.symbol, struct_doc.line), ""])
        lines.extend(["```c", strip_ref_tokens(struct_doc.definition or ""), "```", ""])
        if struct_doc.fields:
            append_heading(lines, "Fields", 3, insert_br=False)
            lines.extend(["| Name | Type | Description |", "|---|---|---|"])
            for field in struct_doc.fields:
                field_description = resolve_links(field.description or "-", [], symbol_index, duplicates, report, page_path, struct_doc.symbol, struct_doc.line).replace("\n", "<br>")
                lines.append(f"| {field.symbol} | {strip_ref_tokens(field.type_text)} | {field_description} |")
            lines.append("")
    for typedef in typedefs:
        append_anchored_heading(lines, typedef.symbol, 2, insert_br=not first_struct)
        first_struct = False
        lines.extend(["", resolve_links(typedef.brief or typedef.details or "", [], symbol_index, duplicates, report, page_path, typedef.symbol, typedef.line), ""])
        lines.extend(["```c", strip_ref_tokens(typedef.definition or f"typedef {typedef.type_text} {typedef.symbol};"), "```", ""])
        append_reference_sections(lines, [("Remark", typedef.remarks), ("Warning", typedef.warnings)], page_path, symbol_index, duplicates, report, typedef.symbol, typedef.line)
    return "\n".join(lines)


def render_enum_page(enums: list[EnumDoc], page_path: Path, symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook) -> str:
    lines = ["# Enum", ""]
    first_enum = True
    for enum_doc in enums:
        append_anchored_heading(lines, enum_doc.symbol, 2, insert_br=not first_enum)
        first_enum = False
        lines.extend(["", resolve_links(enum_doc.brief or enum_doc.details or "", [], symbol_index, duplicates, report, page_path, enum_doc.symbol, enum_doc.line), ""])
        lines.extend(["```c", strip_ref_tokens(enum_doc.definition or ""), "```", ""])
        if enum_doc.values:
            append_heading(lines, "Values", 3, insert_br=False)
            lines.extend(["| Symbol | Value | Description |", "|---|---|---|"])
            for value in enum_doc.values:
                value_description = resolve_links(value.description or "-", [], symbol_index, duplicates, report, page_path, enum_doc.symbol, enum_doc.line).replace("\n", "<br>")
                lines.append(f"| <a id=\"{value.symbol}\"></a>{value.symbol} | {normalize_enum_initializer(value.initializer or '-')} | {value_description} |")
            lines.append("")
        append_reference_sections(lines, [("Remark", enum_doc.remarks), ("Warning", enum_doc.warnings)], page_path, symbol_index, duplicates, report, enum_doc.symbol, enum_doc.line)
    return "\n".join(lines)


def run_error_probe(error_macros: list[MacroDoc]) -> dict[str, tuple[str, str, str, str]]:
    ERROR_PROBE_DIR.mkdir(parents=True, exist_ok=True)
    symbols = [macro.symbol for macro in error_macros if macro.symbol.startswith("AXCL_ERR_")]
    probe_source = ERROR_PROBE_DIR / "probe_input.c"
    lines = [
        "#include <inttypes.h>",
        "#include <stdint.h>",
        "#include <stdio.h>",
        "#include \"axcl_error.h\"",
        "",
        "int main(void) {",
    ]
    for symbol in symbols:
        lines.append(f'    printf("{symbol}\\t0x%08X\\t%d\\n", (uint32_t)({symbol}), (int32_t)({symbol}));')
    lines.extend(["    return 0;", "}"])
    write_text(probe_source, "\n".join(lines))

    cc = shutil.which("cc") or shutil.which("gcc")
    if cc is None:
        raise RuntimeError("A C compiler is required for the error probe.")

    def build_and_run(name: str, extra_flags: list[str]) -> dict[str, tuple[str, str]]:
        binary_path = ERROR_PROBE_DIR / f"probe_{name}"
        output_path = ERROR_PROBE_DIR / f"probe_{name}.tsv"
        try:
            subprocess.run(
                [cc, "-std=c11", "-I", str(INCLUDE_DIR), str(probe_source), "-o", str(binary_path), *extra_flags],
                cwd=REPO_ROOT,
                check=True,
            )
            completed = subprocess.run([str(binary_path)], cwd=REPO_ROOT, check=True, text=True, capture_output=True)
        except subprocess.CalledProcessError:
            raise
        finally:
            if binary_path.exists():
                binary_path.unlink()
        output_path.write_text(completed.stdout, encoding="utf-8")
        records: dict[str, tuple[str, str]] = {}
        for raw_line in completed.stdout.splitlines():
            symbol, hex_value, int_value = raw_line.split("\t")
            records[symbol] = (hex_value, int_value)
        return records

    host = build_and_run("host", [])
    device = build_and_run("device", ["-DAXCL_BUILD_FOR_DEVICE"])
    merged_path = ERROR_PROBE_DIR / "error_values.tsv"
    merged_lines = ["symbol\thost_hex\thost_int32\tdevice_hex\tdevice_int32"]
    merged: dict[str, tuple[str, str, str, str]] = {}
    for symbol in symbols:
        host_record = host.get(symbol)
        device_record = device.get(symbol)
        if not host_record or not device_record:
            continue
        host_hex, host_int = host_record
        device_hex, device_int = device_record
        merged[symbol] = (host_hex, host_int, device_hex, device_int)
        merged_lines.append(f"{symbol}\t{host_hex}\t{host_int}\t{device_hex}\t{device_int}")
    write_text(merged_path, "\n".join(merged_lines))
    return merged


def render_error_page(error_macros: list[MacroDoc], error_values: dict[str, tuple[str, str, str, str]], page_path: Path, symbol_index: dict[str, SymbolLocation], duplicates: set[str], report: ReportBook) -> str:
    families: dict[str, list[MacroDoc]] = defaultdict(list)
    for macro in error_macros:
        family = macro.symbol.removeprefix("AXCL_ERR_").split("_", 1)[0]
        families[family].append(macro)

    lines = ["# Error Code", ""]
    first_family = True
    for family in sorted(families):
        items = sorted(families[family], key=lambda item: item.symbol)
        include_description = any(item.brief or item.details for item in items)
        append_heading(lines, family, 2, insert_br=not first_family)
        first_family = False
        headers = ["Symbol", "Host Hex", "Host Int32", "Device Hex", "Device Int32"]
        if include_description:
            headers.append("Description")
        lines.append("| " + " | ".join(headers) + " |")
        lines.append("|" + "|".join(["---"] * len(headers)) + "|")
        for item in items:
            host_hex, host_int, device_hex, device_int = error_values.get(item.symbol, ("", "", "", ""))
            row = [f"<a id=\"{item.symbol}\"></a>{item.symbol}", host_hex, host_int, device_hex, device_int]
            if include_description:
                row.append(resolve_links(item.brief or item.details, [], symbol_index, duplicates, report, page_path, item.symbol, item.line))
            lines.append("| " + " | ".join(cell or "" for cell in row) + " |")
        lines.append("")
    return "\n".join(lines)


def build_symbol_index(group_pages: dict[str, str], by_group: dict[str, list[FunctionDoc]], macros: list[MacroDoc], typedefs: list[TypedefDoc], enums: list[EnumDoc], structs: list[StructDoc], error_macros: list[MacroDoc], blacklist: dict[str, str]) -> tuple[dict[str, SymbolLocation], set[str]]:
    seen: dict[str, SymbolLocation] = {}
    duplicates: set[str] = set()

    def add(symbol: str, page: Path, kind: str) -> None:
        location = SymbolLocation(symbol=symbol, page=page, anchor=symbol, kind=kind)
        if symbol in seen:
            duplicates.add(symbol)
            return
        seen[symbol] = location

    for group_id, filename in group_pages.items():
        if group_id in blacklist:
            continue
        page = MD_EN_ROOT / filename
        for function in by_group.get(group_id, []):
            add(function.symbol, page, "function")

    enum_page = REFERENCE_ROOT / "enum.md"
    struct_page = REFERENCE_ROOT / "struct.md"
    macro_page = REFERENCE_ROOT / "macro.md"
    error_page = REFERENCE_ROOT / "error.md"
    for enum_doc in enums:
        add(enum_doc.symbol, enum_page, "enum")
        for value in enum_doc.values:
            add(value.symbol, enum_page, "enumvalue")
    for struct_doc in structs:
        add(struct_doc.symbol, struct_page, "struct")
    for typedef in typedefs:
        add(typedef.symbol, struct_page, "typedef")
    for macro in macros:
        add(macro.symbol, macro_page, "macro")
    for macro in error_macros:
        add(macro.symbol, error_page, "error")

    for symbol in duplicates:
        seen.pop(symbol, None)
    return seen, duplicates


def collect_blacklisted(report: ReportBook, blacklist: dict[str, str], group_titles: dict[str, str], by_group: dict[str, list[FunctionDoc]]) -> None:
    for group_id, reason in blacklist.items():
        for function in by_group.get(group_id, []):
            report.add(
                "excluded_by_config.tsv",
                group_id,
                group_titles.get(group_id, ""),
                function.symbol,
                "function",
                function.file,
                function.line,
                reason,
            )


def write_outputs(group_titles: dict[str, str], group_pages: dict[str, str], by_group: dict[str, list[FunctionDoc]], macros: list[MacroDoc], typedefs: list[TypedefDoc], enums: list[EnumDoc], structs: list[StructDoc], error_macros: list[MacroDoc], symbol_index: dict[str, SymbolLocation], duplicates: set[str], blacklist: dict[str, str], report: ReportBook, error_values: dict[str, tuple[str, str, str, str]]) -> list[Path]:
    written_pages: list[Path] = []
    for group_id, title in group_titles.items():
        if group_id in blacklist:
            continue
        functions = sorted(by_group.get(group_id, []), key=lambda item: item.symbol)
        if not functions:
            continue
        page_path = MD_EN_ROOT / group_pages[group_id]
        write_text(page_path, render_function_page(functions, page_path, symbol_index, duplicates, report, title))
        written_pages.append(page_path)

    enum_path = REFERENCE_ROOT / "enum.md"
    struct_path = REFERENCE_ROOT / "struct.md"
    macro_path = REFERENCE_ROOT / "macro.md"
    error_path = REFERENCE_ROOT / "error.md"
    index_path = MD_ROOT / "index.md"

    write_text(enum_path, render_enum_page(enums, enum_path, symbol_index, duplicates, report))
    write_text(struct_path, render_struct_page(structs, typedefs, struct_path, symbol_index, duplicates, report))
    write_text(macro_path, render_macro_page(macros, macro_path, symbol_index, duplicates, report))
    write_text(error_path, render_error_page(error_macros, error_values, error_path, symbol_index, duplicates, report))

    generated_pages = {
        group_id: filename
        for group_id, filename in group_pages.items()
        if group_id not in blacklist and by_group.get(group_id)
    }
    write_text(index_path, render_index(generated_pages, group_titles))
    written_pages.extend([index_path, enum_path, struct_path, macro_path, error_path])
    return written_pages


def collect_anchors(page: Path) -> set[str]:
    anchors: set[str] = set()
    for line in page.read_text(encoding="utf-8").splitlines():
        for match in re.finditer(r'<a id="([^"]+)"></a>', line):
            anchors.add(match.group(1))
    return anchors


def validate_markdown(pages: list[Path], report: ReportBook) -> None:
    anchor_index = {page: collect_anchors(page) for page in pages}
    for page in pages:
        lines = page.read_text(encoding="utf-8").splitlines()
        is_api_page = page.name.endswith("_api.md")
        is_reference_page = "/reference/" in page.as_posix()
        is_index_page = page.name == "index.md"
        in_code_block = False
        previous_blank = False
        api_h2_seen = 0
        api_h3_seen = 0
        reference_h2_seen = 0
        index_h2_seen = 0
        for idx, line in enumerate(lines, start=1):
            stripped_line = line.strip()
            if stripped_line.startswith("```"):
                in_code_block = not in_code_block
                previous_blank = False
                continue
            if not in_code_block and stripped_line == "":
                if previous_blank:
                    report.add(
                        "markdown_check.tsv",
                        "ERROR",
                        page.relative_to(REPO_ROOT).as_posix(),
                        idx,
                        "multiple-blank-lines",
                        "Consecutive blank lines outside fenced code blocks must be collapsed to a single blank line.",
                    )
                previous_blank = True
            else:
                previous_blank = False
            if is_api_page and line.startswith("### "):
                    current_symbol = line.removeprefix("### ").strip()
                    end_idx = len(lines)
                    for probe_idx in range(idx, len(lines)):
                        if lines[probe_idx].startswith("### "):
                            end_idx = probe_idx
                            break
                    block = "\n".join(lines[idx - 1 : end_idx])
                    for title in ["#### Function", "#### Parameters", "#### Returns"]:
                        if title not in block:
                            report.add(
                                "markdown_check.tsv",
                                "ERROR",
                                page.relative_to(REPO_ROOT).as_posix(),
                                idx,
                                "missing-fixed-section",
                                f"Function '{current_symbol}' is missing required section '{title}'.",
                            )
            if is_api_page:
                    if line.startswith("## "):
                        has_br = has_br_spacing_before_heading(lines, idx)
                        if api_h2_seen == 0:
                            if has_br:
                                report.add(
                                    "markdown_check.tsv",
                                    "ERROR",
                                    page.relative_to(REPO_ROOT).as_posix(),
                                    idx,
                                    "unexpected-heading-spacing-placeholder",
                                    "The first API page level 2 heading must not be preceded by a <br> line.",
                                )
                        elif not has_br:
                            report.add(
                                "markdown_check.tsv",
                                "ERROR",
                                page.relative_to(REPO_ROOT).as_posix(),
                                idx,
                                "missing-heading-spacing-placeholder",
                                "Sibling API page level 2 headings must be separated by a standalone <br> line.",
                            )
                        api_h2_seen += 1
                    elif line.startswith("### "):
                        has_br = has_br_spacing_before_heading(lines, idx)
                        if api_h3_seen == 0:
                            if has_br:
                                report.add(
                                    "markdown_check.tsv",
                                    "ERROR",
                                    page.relative_to(REPO_ROOT).as_posix(),
                                    idx,
                                    "unexpected-heading-spacing-placeholder",
                                    "The first API page level 3 heading must not be preceded by a <br> line.",
                                )
                        elif not has_br:
                            report.add(
                                "markdown_check.tsv",
                                "ERROR",
                                page.relative_to(REPO_ROOT).as_posix(),
                                idx,
                                "missing-heading-spacing-placeholder",
                                "Sibling API page level 3 headings must be separated by a standalone <br> line.",
                            )
                        api_h3_seen += 1
                    elif line.startswith("#### "):
                        if has_br_spacing_before_heading(lines, idx):
                            report.add(
                                "markdown_check.tsv",
                                "ERROR",
                                page.relative_to(REPO_ROOT).as_posix(),
                                idx,
                                "unexpected-subsection-spacing-placeholder",
                                "Function subsection headers must not be preceded by a <br> line.",
                            )
            elif is_reference_page:
                if line.startswith("## "):
                    has_br = has_br_spacing_before_heading(lines, idx)
                    if reference_h2_seen == 0:
                        if has_br:
                            report.add(
                                "markdown_check.tsv",
                                "ERROR",
                                page.relative_to(REPO_ROOT).as_posix(),
                                idx,
                                "unexpected-reference-spacing-placeholder",
                                "The first reference page level 2 heading must not be preceded by a <br> line.",
                            )
                    elif not has_br:
                        report.add(
                            "markdown_check.tsv",
                            "ERROR",
                            page.relative_to(REPO_ROOT).as_posix(),
                            idx,
                            "missing-reference-spacing-placeholder",
                            "Sibling reference page level 2 headings must be separated by a standalone <br> line.",
                        )
                    reference_h2_seen += 1
                if line.startswith("### ") or line.startswith("#### "):
                    if has_br_spacing_before_heading(lines, idx):
                        report.add(
                            "markdown_check.tsv",
                            "ERROR",
                            page.relative_to(REPO_ROOT).as_posix(),
                            idx,
                            "unexpected-reference-spacing-placeholder",
                            "Reference page level 3 and deeper headings must not be preceded by a <br> line.",
                        )
            elif is_index_page:
                if line.startswith("## "):
                    has_br = has_br_spacing_before_heading(lines, idx)
                    if index_h2_seen == 0:
                        if has_br:
                            report.add(
                                "markdown_check.tsv",
                                "ERROR",
                                page.relative_to(REPO_ROOT).as_posix(),
                                idx,
                                "unexpected-index-spacing-placeholder",
                                "The first index page level 2 heading must not be preceded by a <br> line.",
                            )
                    elif not has_br:
                        report.add(
                            "markdown_check.tsv",
                            "ERROR",
                            page.relative_to(REPO_ROOT).as_posix(),
                            idx,
                            "missing-index-spacing-placeholder",
                            "Sibling index page level 2 headings must be separated by a standalone <br> line.",
                        )
                    index_h2_seen += 1

        for idx, line in enumerate(lines, start=1):
            if line.count("|") >= 2 and line.strip().startswith("|"):
                pipe_count = line.count("|")
                if idx <= len(lines) - 1:
                    header = lines[idx]
                    if header.strip().startswith("|") and header.count("|") != pipe_count:
                        report.add(
                            "markdown_check.tsv",
                            "ERROR",
                            page.relative_to(REPO_ROOT).as_posix(),
                            idx,
                            "table-structure",
                            "Markdown table rows use inconsistent column counts.",
                        )
            for text, target in re.findall(r"\[([^\]]+)\]\(([^)]+)\)", line):
                link_target = target.split("#", 1)
                relative = link_target[0]
                anchor = link_target[1] if len(link_target) == 2 else ""
                destination = page if not relative else (page.parent / relative).resolve()
                if not destination.exists():
                    report.add(
                        "broken_link.tsv",
                        "ERROR",
                        page.relative_to(MD_ROOT).as_posix(),
                        text,
                        target,
                        page.relative_to(REPO_ROOT).as_posix(),
                        idx,
                        "Rendered Markdown link points to a missing page.",
                    )
                    continue
                if anchor and anchor not in anchor_index.get(destination, set()):
                    report.add(
                        "broken_link.tsv",
                        "ERROR",
                        page.relative_to(MD_ROOT).as_posix(),
                        text,
                        target,
                        page.relative_to(REPO_ROOT).as_posix(),
                        idx,
                        "Rendered Markdown link points to a missing anchor.",
                    )


def main() -> int:
    args = parse_args()
    ensure_directories()
    blacklist = load_blacklist(BLACKLIST_PATH)
    report = ReportBook()

    if not args.skip_doxygen and not args.validate_only:
        run_doxygen()

    ensure_doxygen_xml_available()

    group_titles, group_pages, functions, by_group = parse_functions(report)
    macros, error_macros, typedefs, enums, structs = parse_reference_data(report)
    enum_symbols = {enum_doc.symbol for enum_doc in enums}
    struct_symbols = {struct_doc.symbol for struct_doc in structs}
    typedefs = [typedef for typedef in typedefs if typedef.symbol not in enum_symbols and typedef.symbol not in struct_symbols]
    group_defs, source_records = scan_source_comments(blacklist)
    collect_undefined_groups(report, blacklist, group_defs, source_records)
    collect_unsupported_tags(report, source_records)
    collect_orphaned_symbols(report, functions, group_titles, blacklist)
    collect_blacklisted(report, blacklist, group_titles, by_group)

    if not args.validate_only:
        error_values = run_error_probe(error_macros)
        symbol_index, duplicates = build_symbol_index(
            group_pages,
            by_group,
            macros,
            typedefs,
            enums,
            structs,
            error_macros,
            blacklist,
        )
        pages = write_outputs(
            group_titles,
            group_pages,
            by_group,
            macros,
            typedefs,
            enums,
            structs,
            error_macros,
            symbol_index,
            duplicates,
            blacklist,
            report,
            error_values,
        )
        validate_markdown(pages, report)
    else:
        pages = list(MD_ROOT.rglob("*.md"))
        validate_markdown(pages, report)

    report.write()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())