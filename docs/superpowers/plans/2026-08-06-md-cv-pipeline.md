# Markdown CV Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the docx-source CV workflow with a Markdown source of truth plus a single build script that generates a styled .docx and a pixel-perfect .pdf, packaged as a shareable public repo with a Jane Doe MD sample.

**Architecture:** A standalone repo `C:\md-cv` (→ github.com/rauscha/md-cv) holds the canonical `build_cv.py` (parse Markdown → python-docx → PDF via Word COM with LibreOffice fallback), tests, and the Jane Doe sample. The site repo `C:\rauscha.github.io` vendors the script under `cv/` next to Andrew's real CV Markdown; outputs keep their current root-level names so no site links change.

**Tech Stack:** Python 3.11, python-docx, pypdf, pywin32 (Windows only), pytest. Word COM primary PDF exporter, headless LibreOffice fallback.

**Spec:** `docs/superpowers/specs/2026-08-06-md-cv-pipeline-design.md` (site repo).

## Global Constraints

- All visual styling lives in ONE constants block at the top of `build_cv.py` — nothing styled inline elsewhere.
- Dated entry syntax: line starts with a 4-digit year and contains `|` → `dates | description`. Everything else is a plain paragraph.
- Any line containing `[TBC]` is kept in Markdown source but stripped from all output.
- A `###` subsection with no items renders as a paragraph reading `None`.
- Output filenames: `<markdown-stem>.docx` and `<markdown-stem>.pdf` (Andrew's MD is named `Andrew_Rausch_CV.md` so root outputs keep today's names).
- Site repo serves ONLY the PDF: `_config.yml` must exclude `cv/` and `Andrew_Rausch_CV.docx`.
- Dependencies: `python-docx`, `pypdf`, `pywin32; sys_platform == "win32"`. No others.
- Working branch in both repos: `master` (site) / `main` (new repo). Solo dev — land on the working branch, no PRs.

---

### Task 1: md-cv repo scaffold + Markdown parser

**Files:**
- Create: `C:\md-cv\build_cv.py`
- Create: `C:\md-cv\requirements.txt`
- Create: `C:\md-cv\.gitignore`
- Test: `C:\md-cv\tests\test_parser.py`

**Interfaces:**
- Produces: `parse_cv(text: str) -> CV`; dataclasses `CV(name: str, contact: list[str], sections: list[Section])`, `Section(title: str, items: list)`, `Subsection(title: str, items: list)`, `Entry(dates: str, text: str)`, `Para(text: str)`. Items lists hold `Entry | Para | Subsection` in source order.

- [ ] **Step 1: Scaffold the repo**

```powershell
New-Item -ItemType Directory -Force C:\md-cv\tests
Set-Location C:\md-cv
git init -b main
pip install python-docx pypdf pywin32 pytest
```

`requirements.txt`:
```
python-docx
pypdf
pywin32; sys_platform == "win32"
```

`.gitignore`:
```
__pycache__/
*.pyc
```

- [ ] **Step 2: Write the failing parser tests**

`C:\md-cv\tests\test_parser.py`:
```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from build_cv import parse_cv, Entry, Para, Subsection

SAMPLE = """# Jane Doe, MD

Some University
Email: jane@example.edu

## ACADEMIC APPOINTMENTS

2018-2021 | Clinical Instructor, Some University
2021-present | Assistant Professor, Some University

## PUBLICATIONS

### (a) Peer-reviewed Publications

1. Doe J. A paper. *Journal*: 1-2. 2024
2020-2024 | This starts with a year and has a pipe

### (b) Book Chapters

## SCAFFOLD

Real line
Gather old talks [TBC]
"""


def test_name_and_contact():
    cv = parse_cv(SAMPLE)
    assert cv.name == "Jane Doe, MD"
    assert cv.contact == ["Some University", "Email: jane@example.edu"]


def test_sections_and_entries():
    cv = parse_cv(SAMPLE)
    s = cv.sections[0]
    assert s.title == "ACADEMIC APPOINTMENTS"
    assert s.items == [
        Entry("2018-2021", "Clinical Instructor, Some University"),
        Entry("2021-present", "Assistant Professor, Some University"),
    ]


def test_subsections_capture_following_items():
    cv = parse_cv(SAMPLE)
    pubs = cv.sections[1]
    sub_a, sub_b = pubs.items
    assert isinstance(sub_a, Subsection) and sub_a.title == "(a) Peer-reviewed Publications"
    assert sub_a.items[0] == Para("1. Doe J. A paper. *Journal*: 1-2. 2024")
    assert sub_a.items[1] == Entry("2020-2024", "This starts with a year and has a pipe")
    assert isinstance(sub_b, Subsection) and sub_b.items == []


def test_tbc_lines_stripped():
    cv = parse_cv(SAMPLE)
    scaffold = cv.sections[2]
    assert scaffold.items == [Para("Real line")]
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd C:\md-cv; python -m pytest tests -v`
Expected: FAIL / collection error — `ModuleNotFoundError: No module named 'build_cv'`

- [ ] **Step 4: Implement the parser**

`C:\md-cv\build_cv.py`:
```python
#!/usr/bin/env python3
"""Build a styled .docx and .pdf academic CV from a Markdown source.

Canonical home: https://github.com/rauscha/md-cv
Usage: python build_cv.py path/to/CV.md [-o OUTDIR]

Format: `# Name` then contact lines; `## SECTION`; `### (a) Subsection`;
dated entries as `2018-2021 | description` (must start with a 4-digit year);
everything else is a plain paragraph. `**bold**` / `*italic*` inline.
Lines containing [TBC] stay in the source but are stripped from output.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass
class Entry:
    dates: str
    text: str


@dataclass
class Para:
    text: str


@dataclass
class Subsection:
    title: str
    items: list = field(default_factory=list)


@dataclass
class Section:
    title: str
    items: list = field(default_factory=list)


@dataclass
class CV:
    name: str
    contact: list
    sections: list


DATE_ENTRY_RE = re.compile(r"^(\d{4}[^|]*)\|(.*)$")


def parse_cv(text: str) -> CV:
    name = ""
    contact: list[str] = []
    sections: list[Section] = []
    section: Section | None = None
    sub: Subsection | None = None
    for raw in text.splitlines():
        line = raw.strip()
        if not line or "[TBC]" in line:
            continue
        if line.startswith("### "):
            sub = Subsection(line[4:].strip())
            section.items.append(sub)
        elif line.startswith("## "):
            section = Section(line[3:].strip())
            sub = None
            sections.append(section)
        elif line.startswith("# "):
            name = line[2:].strip()
        else:
            m = DATE_ENTRY_RE.match(line)
            item = Entry(m.group(1).strip(), m.group(2).strip()) if m else Para(line)
            if sub is not None:
                sub.items.append(item)
            elif section is not None:
                section.items.append(item)
            else:
                contact.append(line)
    return CV(name, contact, sections)
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd C:\md-cv; python -m pytest tests -v`
Expected: 4 passed

- [ ] **Step 6: Commit**

```bash
cd /c/md-cv
git add build_cv.py requirements.txt .gitignore tests/test_parser.py
git commit -m "feat: Markdown CV parser (sections, subsections, dated entries, [TBC] stripping)"
```

---

### Task 2: Inline bold/italic tokenizer

**Files:**
- Modify: `C:\md-cv\build_cv.py` (append after parser)
- Test: `C:\md-cv\tests\test_runs.py`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `tokenize_runs(text: str) -> list[tuple[str, bool, bool]]` — ordered `(text, bold, italic)` segments.

- [ ] **Step 1: Write the failing tests**

`C:\md-cv\tests\test_runs.py`:
```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from build_cv import tokenize_runs


def test_plain_text():
    assert tokenize_runs("Hello world") == [("Hello world", False, False)]


def test_bold_and_italic():
    assert tokenize_runs("**Doe J**, Smith A. *J Med*: 1-5. 2024") == [
        ("Doe J", True, False),
        (", Smith A. ", False, False),
        ("J Med", False, True),
        (": 1-5. 2024", False, False),
    ]


def test_lone_asterisk_left_alone():
    assert tokenize_runs("p < 0.05 * significant") == [("p < 0.05 * significant", False, False)]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd C:\md-cv; python -m pytest tests/test_runs.py -v`
Expected: FAIL — `ImportError: cannot import name 'tokenize_runs'`

- [ ] **Step 3: Implement**

Append to `build_cv.py`:
```python
TOKEN_RE = re.compile(r"(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)")


def tokenize_runs(text: str) -> list:
    out = []
    for part in TOKEN_RE.split(text):
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            out.append((part[2:-2], True, False))
        elif part.startswith("*") and part.endswith("*") and len(part) > 2:
            out.append((part[1:-1], False, True))
        else:
            out.append((part, False, False))
    return out
```

- [ ] **Step 4: Run all tests**

Run: `cd C:\md-cv; python -m pytest tests -v`
Expected: 7 passed

- [ ] **Step 5: Commit**

```bash
cd /c/md-cv
git add build_cv.py tests/test_runs.py
git commit -m "feat: inline bold/italic tokenizer"
```

---

### Task 3: docx renderer with style constants block

**Files:**
- Modify: `C:\md-cv\build_cv.py` (style constants at top, renderer after tokenizer)
- Test: `C:\md-cv\tests\test_renderer.py`

**Interfaces:**
- Consumes: `parse_cv`, `tokenize_runs`, the dataclasses from Task 1.
- Produces: `render_docx(cv: CV, path: Path) -> None`. Style constants `FONT_NAME, BODY_SIZE, NAME_SIZE, INDENT, SPACE_BEFORE_SECTION, SPACE_AFTER_SECTION, SPACE_BEFORE_SUBSECTION, SPACE_AFTER_PARA` (module-level; the "light refresh" design surface).

- [ ] **Step 1: Write the failing tests**

`C:\md-cv\tests\test_renderer.py`:
```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from docx import Document
from docx.shared import Emu

from build_cv import parse_cv, render_docx, INDENT

MD = """# Jane Doe, MD

Email: jane@example.edu

## APPOINTMENTS

2021-present | Assistant Professor, **Some University**

## PUBLICATIONS

### (a) Peer-reviewed Publications

1. Doe J. A paper. *Journal*: 1-2. 2024

### (b) Book Chapters
"""


def build(tmp_path):
    out = tmp_path / "cv.docx"
    render_docx(parse_cv(MD), out)
    return Document(str(out))


def texts(doc):
    return [p.text for p in doc.paragraphs]


def test_structure_in_order(tmp_path):
    t = texts(build(tmp_path))
    assert t[0] == "Jane Doe, MD"
    assert "APPOINTMENTS" in t
    assert "2021-present\tAssistant Professor, Some University" in t
    assert "(a) Peer-reviewed Publications" in t


def test_dated_entry_hanging_indent(tmp_path):
    doc = build(tmp_path)
    p = next(p for p in doc.paragraphs if p.text.startswith("2021-present\t"))
    pf = p.paragraph_format
    assert pf.left_indent == INDENT
    assert pf.first_line_indent == -INDENT
    assert pf.tab_stops[0].position == INDENT


def test_bold_italic_runs(tmp_path):
    doc = build(tmp_path)
    entry = next(p for p in doc.paragraphs if "Some University" in p.text)
    assert any(r.bold and r.text == "Some University" for r in entry.runs)
    cite = next(p for p in doc.paragraphs if p.text.startswith("1. Doe J"))
    assert any(r.italic and r.text == "Journal" for r in cite.runs)


def test_empty_subsection_renders_none(tmp_path):
    t = texts(build(tmp_path))
    i = t.index("(b) Book Chapters")
    assert t[i + 1] == "None"


def test_name_is_large_bold(tmp_path):
    doc = build(tmp_path)
    run = doc.paragraphs[0].runs[0]
    assert run.bold
    assert run.font.size.pt > 12
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd C:\md-cv; python -m pytest tests/test_renderer.py -v`
Expected: FAIL — `ImportError: cannot import name 'render_docx'`

- [ ] **Step 3: Implement**

Add near the top of `build_cv.py` (immediately after the imports — this block is the entire design surface):
```python
from pathlib import Path

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.shared import Emu, Pt

# ---------------------------------------------------------------------------
# STYLE CONSTANTS — the entire visual design lives here. "Light refresh" =
# conservative academic layout, Calibri, tidy consistent spacing.
# ---------------------------------------------------------------------------
FONT_NAME = "Calibri"
BODY_SIZE = Pt(11)
NAME_SIZE = Pt(16)
INDENT = Emu(914400)            # 1" hanging indent + tab stop for dated entries
SPACE_BEFORE_SECTION = Pt(12)
SPACE_AFTER_SECTION = Pt(4)
SPACE_BEFORE_SUBSECTION = Pt(6)
SPACE_AFTER_PARA = Pt(2)
```

Append the renderer after `tokenize_runs`:
```python
def _add_runs(p, text: str):
    for t, bold, italic in tokenize_runs(text):
        r = p.add_run(t)
        r.bold = bold
        r.italic = italic
    return p


def _render_items(doc, items):
    for item in items:
        if isinstance(item, Subsection):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = SPACE_BEFORE_SUBSECTION
            p.add_run(item.title).bold = True
            if item.items:
                _render_items(doc, item.items)
            else:
                doc.add_paragraph("None")
        elif isinstance(item, Entry):
            p = doc.add_paragraph()
            pf = p.paragraph_format
            pf.left_indent = INDENT
            pf.first_line_indent = -INDENT
            pf.tab_stops.add_tab_stop(INDENT, WD_TAB_ALIGNMENT.LEFT)
            p.add_run(item.dates + "\t")
            _add_runs(p, item.text)
        else:
            _add_runs(doc.add_paragraph(), item.text)


def render_docx(cv: CV, path: Path) -> None:
    doc = Document()
    normal = doc.styles["Normal"]
    normal.font.name = FONT_NAME
    normal.font.size = BODY_SIZE
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = SPACE_AFTER_PARA

    p = doc.add_paragraph()
    r = p.add_run(cv.name)
    r.bold = True
    r.font.size = NAME_SIZE

    for line in cv.contact:
        _add_runs(doc.add_paragraph(), line)

    for section in cv.sections:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = SPACE_BEFORE_SECTION
        p.paragraph_format.space_after = SPACE_AFTER_SECTION
        p.add_run(section.title).bold = True
        _render_items(doc, section.items)

    doc.save(str(path))
```

- [ ] **Step 4: Run all tests**

Run: `cd C:\md-cv; python -m pytest tests -v`
Expected: 12 passed

- [ ] **Step 5: Commit**

```bash
cd /c/md-cv
git add build_cv.py tests/test_renderer.py
git commit -m "feat: docx renderer with single style-constants block"
```

---

### Task 4: PDF export, self-checks, diff, and CLI

**Files:**
- Modify: `C:\md-cv\build_cv.py` (append exporter + `main`)
- Test: `C:\md-cv\tests\test_build_e2e.py`

**Interfaces:**
- Consumes: `parse_cv`, `render_docx`.
- Produces: `export_pdf(docx_path: Path, pdf_path: Path) -> str` (returns `"word"` or `"libreoffice"`), `extract_pdf_text(pdf_path: Path) -> tuple[str, int]` (text, page count), `main(argv=None)`. CLI: `python build_cv.py CV.md [-o OUTDIR]`.

- [ ] **Step 1: Write the failing e2e test**

`C:\md-cv\tests\test_build_e2e.py`:
```python
import shutil
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build_cv

MD = """# Jane Doe, MD

Email: jane@example.edu

## APPOINTMENTS

2021-present | Assistant Professor
Old job to confirm [TBC]
"""


def _has_exporter():
    try:
        import win32com.client  # noqa: F401
        return True
    except ImportError:
        pass
    return bool(
        shutil.which("soffice")
        or Path(r"C:\Program Files\LibreOffice\program\soffice.exe").exists()
    )


@pytest.mark.skipif(not _has_exporter(), reason="no Word or LibreOffice available")
def test_end_to_end_build(tmp_path, capsys):
    md = tmp_path / "cv.md"
    md.write_text(MD, encoding="utf-8")
    build_cv.main([str(md)])
    assert (tmp_path / "cv.docx").exists()
    pdf = tmp_path / "cv.pdf"
    assert pdf.exists()
    text, pages = build_cv.extract_pdf_text(pdf)
    assert "Jane Doe" in text
    assert "TBC" not in text
    assert pages >= 1
    assert "Built" in capsys.readouterr().out
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd C:\md-cv; python -m pytest tests/test_build_e2e.py -v`
Expected: FAIL — `AttributeError: module 'build_cv' has no attribute 'main'`

- [ ] **Step 3: Implement exporter and CLI**

Append to `build_cv.py` (also add `import argparse, difflib, shutil, subprocess, sys` to the top imports):
```python
def _export_via_word(docx_path: Path, pdf_path: Path) -> bool:
    try:
        import win32com.client
    except ImportError:
        return False
    try:
        word = win32com.client.DispatchEx("Word.Application")
    except Exception:
        return False
    try:
        word.Visible = False
        doc = word.Documents.Open(str(docx_path.resolve()))
        doc.SaveAs2(str(pdf_path.resolve()), FileFormat=17)  # wdFormatPDF
        doc.Close(False)
    finally:
        word.Quit()
    return True


def _export_via_soffice(docx_path: Path, pdf_path: Path) -> bool:
    soffice = shutil.which("soffice")
    if not soffice:
        for candidate in (
            Path(r"C:\Program Files\LibreOffice\program\soffice.exe"),
            Path("/usr/bin/soffice"),
        ):
            if candidate.exists():
                soffice = str(candidate)
                break
    if not soffice:
        return False
    subprocess.run(
        [soffice, "--headless", "--convert-to", "pdf",
         "--outdir", str(pdf_path.parent), str(docx_path)],
        check=True,
    )
    produced = pdf_path.parent / (docx_path.stem + ".pdf")
    if produced != pdf_path:
        produced.replace(pdf_path)
    return True


def export_pdf(docx_path: Path, pdf_path: Path) -> str:
    if _export_via_word(docx_path, pdf_path):
        return "word"
    if _export_via_soffice(docx_path, pdf_path):
        return "libreoffice"
    raise RuntimeError(
        "No PDF exporter found. Install Microsoft Word (plus `pip install pywin32`) "
        "or LibreOffice."
    )


def extract_pdf_text(pdf_path: Path):
    from pypdf import PdfReader

    reader = PdfReader(str(pdf_path))
    text = "\n".join((page.extract_text() or "") for page in reader.pages)
    return text, len(reader.pages)


def main(argv=None):
    ap = argparse.ArgumentParser(description="Build a .docx and .pdf CV from Markdown.")
    ap.add_argument("markdown", type=Path)
    ap.add_argument("-o", "--outdir", type=Path, default=None)
    args = ap.parse_args(argv)

    outdir = args.outdir or args.markdown.parent
    outdir.mkdir(parents=True, exist_ok=True)
    docx_path = outdir / (args.markdown.stem + ".docx")
    pdf_path = outdir / (args.markdown.stem + ".pdf")

    old_text = extract_pdf_text(pdf_path)[0] if pdf_path.exists() else None

    cv = parse_cv(args.markdown.read_text(encoding="utf-8"))
    render_docx(cv, docx_path)
    engine = export_pdf(docx_path, pdf_path)

    new_text, pages = extract_pdf_text(pdf_path)
    if "TBC" in new_text:
        sys.exit("ERROR: [TBC] content leaked into the PDF")
    print(f"Built {docx_path.name} and {pdf_path.name} via {engine}; {pages} page(s).")
    if old_text is not None:
        diff = list(difflib.unified_diff(
            old_text.splitlines(), new_text.splitlines(),
            "previous.pdf", "new.pdf", lineterm=""))
        print("\n".join(diff) if diff else "No text changes vs previous PDF.")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run all tests**

Run: `cd C:\md-cv; python -m pytest tests -v`
Expected: 13 passed (e2e uses Word COM on this machine; if Word is busy it may fall back to LibreOffice — both fine)

- [ ] **Step 5: Commit**

```bash
cd /c/md-cv
git add build_cv.py tests/test_build_e2e.py
git commit -m "feat: PDF export (Word COM + LibreOffice fallback), self-checks, diff, CLI"
```

---

### Task 5: Jane Doe sample, README, publish repo

**Files:**
- Create: `C:\md-cv\sample\Jane_Doe_CV.md`
- Create: `C:\md-cv\sample\Jane_Doe_CV.docx` + `C:\md-cv\sample\Jane_Doe_CV.pdf` (build outputs, committed on purpose)
- Create: `C:\md-cv\README.md`

**Interfaces:**
- Consumes: the full CLI from Task 4.
- Produces: the shareable bundle; nothing downstream imports from it.

- [ ] **Step 1: Write the Jane Doe sample**

`C:\md-cv\sample\Jane_Doe_CV.md` — a complete fictional academic-physician CV mirroring Andrew's real structure. Must include every section type the tool supports: contact block; `## ACADEMIC APPOINTMENTS`, `## ACADEMIC TRAINING`, `## BOARD CERTIFICATION & LICENSURE`, `## HONORS & AWARDS`, `## PUBLICATIONS` with lettered subsections `(a)`–`(e)` where at least one is deliberately empty (to show the `None` convention) and `(h) Works in review, preparation, etc.` has one entry; `## INVITED TALKS`; and at least one `[TBC]` line (to show scaffolding). Use fictional but realistic content — Jane Doe, MD, "General Hospital", plausible OB/GYN journal citations with `**Doe J**` bolded author and `*journal names*` italicized. Roughly 60–80 lines. No real people, institutions styled generically.

- [ ] **Step 2: Build the sample and eyeball it**

Run: `cd C:\md-cv; python build_cv.py sample\Jane_Doe_CV.md`
Expected: `Built Jane_Doe_CV.docx and Jane_Doe_CV.pdf via word; N page(s).`
Open the PDF; verify: date column aligns at 1", empty subsection reads `None`, no `[TBC]` text, bold/italic render.

- [ ] **Step 3: Write the README**

`C:\md-cv\README.md` — written for a non-technical academic. Required sections, in this order:
1. **What this is** — "Keep your CV as a plain-text Markdown file; one command produces a formatted Word doc and PDF." One paragraph on why: updating via Claude/ChatGPT becomes 'paste the citation, done'; git-friendly diffs; no Word surgery.
2. **See the sample** — link to `sample/Jane_Doe_CV.md` and its committed `.docx`/`.pdf` outputs.
3. **Setup** — install Python 3.11+, then `pip install -r requirements.txt`. PDF export needs Microsoft Word (Windows) or LibreOffice (any OS) installed.
4. **Build** — `python build_cv.py sample/Jane_Doe_CV.md`, outputs land next to the Markdown; `-o` to redirect.
5. **Format reference** — table covering: `# Name`, contact lines, `## SECTION`, `### (a) Subsection`, `2018-2021 | entry` (must start with a 4-digit year), `**bold**`, `*italic*`, `[TBC]` scaffold lines (kept in source, stripped from output), empty subsection → `None`.
6. **Updating with an AI assistant** — 3-sentence recipe: open the `.md`, tell Claude what changed ("add this paper, it was just accepted"), rebuild, review the printed diff.

- [ ] **Step 4: Commit and publish**

```bash
cd /c/md-cv
git add sample README.md
git commit -m "feat: Jane Doe MD sample CV and colleague-facing README"
gh repo create rauscha/md-cv --public --source . --push
```

Expected: repo visible at github.com/rauscha/md-cv. (Creating this new public repo was approved in the design; if `gh` is missing or unauthenticated, STOP and report rather than working around.)

---

### Task 6: Migrate Andrew's real CV (site repo) — ends in a USER CHECKPOINT

**Files:**
- Create: `C:\rauscha.github.io\cv\Andrew_Rausch_CV.md` (extracted from the docx)
- Create: `C:\rauscha.github.io\cv\build_cv.py` (vendored copy)
- Modify: `C:\rauscha.github.io\_config.yml`
- Modify (generated): `C:\rauscha.github.io\Andrew_Rausch_CV.docx`, `C:\rauscha.github.io\Andrew_Rausch_CV.pdf`
- Scratch: extraction script in the session scratchpad (not committed)

**Interfaces:**
- Consumes: the complete `build_cv.py` from Tasks 1–4.
- Produces: the live site's CV served from the new pipeline.

- [ ] **Step 1: Extract the docx to Markdown**

Write this one-time script to the scratchpad and run it from `C:\rauscha.github.io`:
```python
"""One-time: extract Andrew_Rausch_CV.docx -> cv/Andrew_Rausch_CV.md"""
import re
from pathlib import Path

from docx import Document


def para_md(p):
    segs = []
    for r in p.runs:
        fmt = (bool(r.bold), bool(r.italic))
        if segs and segs[-1][0] == fmt:
            segs[-1] = (fmt, segs[-1][1] + r.text)
        else:
            segs.append((fmt, r.text))
    out = ""
    for (bold, italic), t in segs:
        if not t:
            continue
        if bold and italic:
            out += f"***{t}***"
        elif bold:
            out += f"**{t}**"
        elif italic:
            out += f"*{t}*"
        else:
            out += t
    return out


doc = Document("Andrew_Rausch_CV.docx")
lines = []
seen_name = False
for p in doc.paragraphs:
    plain = p.text.strip()
    if not plain:
        lines.append("")
        continue
    if plain == "None":
        continue  # renderer re-adds None for empty subsections
    md = para_md(p)
    if not seen_name:
        lines.append(f"# {plain}")
        seen_name = True
    elif re.match(r"^\([a-z]\)", plain):
        lines.append(f"### {md.strip('*').strip()}" if md.startswith("*") else f"### {md}")
    elif plain == plain.upper() and len(plain) > 3 and not plain[0].isdigit():
        lines.append(f"## {plain}")
    elif "\t" in p.text:
        dates, rest = md.split("\t", 1)
        lines.append(f"{dates.strip()} | {rest.strip()}")
    else:
        lines.append(md)

out = Path("cv/Andrew_Rausch_CV.md")
out.parent.mkdir(exist_ok=True)
out.write_text("\n".join(lines).strip() + "\n", encoding="utf-8")
print(f"Wrote {out} ({len(lines)} lines)")
```

- [ ] **Step 2: Hand-check the extraction**

Read `cv/Andrew_Rausch_CV.md` end to end against the docx. Checklist: every `##` section present and correctly detected (watch for headers that aren't all-caps); all `(a)`–`(h)` subsections present; dated entries all converted to `dates | text` (grep for remaining literal tabs: `grep -P "\t" cv/Andrew_Rausch_CV.md` → no hits); bold/italic markers look sane (no `**` doubling artifacts); any `[TBC]` scaffold lines from the working docx preserved. Fix by hand as needed.

- [ ] **Step 3: Vendor the script and build**

```powershell
Copy-Item C:\md-cv\build_cv.py C:\rauscha.github.io\cv\build_cv.py
```
Then edit the vendored copy's docstring first line to add: `Vendored from https://github.com/rauscha/md-cv — sync manually on material changes.`

Run: `cd C:\rauscha.github.io; pip install pypdf; python cv\build_cv.py cv\Andrew_Rausch_CV.md -o .`
Expected: `Built Andrew_Rausch_CV.docx and Andrew_Rausch_CV.pdf via word; ~5 page(s).` followed by the text diff vs the previous PDF.

- [ ] **Step 4: Parity gate**

The printed diff is the gate. Acceptable differences ONLY: (a) line-wrap reflow (same words, different break points), (b) the intended light-refresh spacing/typography, (c) `[TBC]` lines absent from the new PDF. Any missing or altered content word = extraction bug; fix the Markdown (or extraction) and rebuild until clean. Also confirm page count is ~5 and spot-open the PDF: date column at 1", sections styled, name header correct.

- [ ] **Step 5: Update `_config.yml`**

```yaml
exclude:
  - Andrew_Rausch_CV.docx
  - docs/
  - cv/
```
Also rewrite the stale comment block above it (it still says "Edit the .docx, re-export the PDF") to: `Keeps non-site files out of the published pages: the CV source (cv/) and generated .docx are excluded; only Andrew_Rausch_CV.pdf is served.`

- [ ] **Step 6: USER CHECKPOINT — before/after review**

STOP. Present to Andrew: the old vs new PDF (side by side or attached), the parity diff summary, and the list of intentional refresh changes. Do NOT commit or push until he approves. On approval:

```bash
cd /c/rauscha.github.io
git add cv/ _config.yml Andrew_Rausch_CV.docx Andrew_Rausch_CV.pdf
git commit -m "feat: CV now built from Markdown source (cv/) via vendored build_cv.py"
```

---

### Task 7: Documentation updates and push

**Files:**
- Modify: `C:\rauscha.github.io\CLAUDE.md` (CV Maintenance section)
- Modify: the global `update-cv` skill (locate via `Glob C:\Users\andre\.claude\**\update-cv\SKILL.md`)

**Interfaces:**
- Consumes: the shipped pipeline from Task 6.
- Produces: docs matching reality; no code.

- [ ] **Step 1: Rewrite CLAUDE.md's CV sections**

Replace the body of `## CV Maintenance` (keeping the "update BOTH publications.html and the CV" convention paragraph, which still applies) and the docx bullet in `## Architecture` with:

````markdown
## CV Maintenance

The CV is maintained as Markdown and built into both served formats:

- **`cv/Andrew_Rausch_CV.md`** — the **source of truth**. Plain Markdown: `## SECTION`,
  `### (a) Subsection`, dated entries as `2018-2021 | description` (must start with a
  4-digit year), `**bold**`/`*italic*` inline. Lines containing `[TBC]` are working
  scaffold: kept in the source, automatically stripped from output.
- **`cv/build_cv.py`** — vendored build script (canonical copy:
  github.com/rauscha/md-cv — sync manually if that repo's script materially changes).
- **`Andrew_Rausch_CV.docx` / `Andrew_Rausch_CV.pdf`** — GENERATED at the repo root;
  never hand-edit either. Only the PDF is served (`_config.yml` excludes the rest).

**To update the CV:** edit `cv/Andrew_Rausch_CV.md`, then:

```bash
python cv/build_cv.py cv/Andrew_Rausch_CV.md -o .
```

The build regenerates both files, exports the PDF via Word (LibreOffice fallback on
machines without Word), asserts no `[TBC]` leaked, reports the page count (expect ~5),
and prints a text diff against the previous PDF — review it to confirm only the
intended lines changed. An empty lettered subsection renders as `None` automatically.

**When a publication changes** (new paper, in-press → published), update BOTH
`publications.html` and `cv/Andrew_Rausch_CV.md`, then rebuild. Publications live under
`(a) Peer-reviewed Publications`; not-yet-published works under `(h) Works in review,
preparation, etc.` — a published paper must move out of `(h)`, never listed in both.
The CV omits PMIDs/DOIs by convention — keep those on the website only.
````

Delete the now-obsolete python-docx editing notes, the LibreOffice/apt-get export recipe, the `[TBC]` throwaway-copy procedure, and the manual post-export checks subsection (all automated now).

- [ ] **Step 2: Update the update-cv skill**

Read the skill file first. Preserve its trigger description and site-propagation workflow (resume.html, publications.html, index.html, meta descriptions — all still correct). Replace only its CV-file mechanics: the source of truth is now `cv/Andrew_Rausch_CV.md`; when Andrew hands over a new CV PDF/docx, its content gets merged INTO the Markdown (not installed as the source), then `python cv/build_cv.py cv/Andrew_Rausch_CV.md -o .` regenerates both served files. Remove any python-docx/LibreOffice export instructions in favor of that one command.

- [ ] **Step 3: Final verification**

Run: `cd C:\rauscha.github.io; python cv\build_cv.py cv\Andrew_Rausch_CV.md -o .`
Expected: clean rebuild, "No text changes vs previous PDF."
Check site links still point at existing files: `grep -rn "Andrew_Rausch_CV" resume.html js/sidebar.js` → both reference `Andrew_Rausch_CV.pdf`, which exists at root.

- [ ] **Step 4: Commit and push**

```bash
cd /c/rauscha.github.io
git add CLAUDE.md
git commit -m "docs: CV maintenance now Markdown-source via cv/build_cv.py"
git push origin master
```
(The skill file lives outside this repo — no commit needed there unless it's under its own VCS.)
Then verify the live site serves the new PDF after Pages deploys.

---

## Self-Review Notes

- Spec coverage: parser/format (T1–T2), renderer + refresh surface (T3), export/checks/diff/CLI (T4), sample + README + public repo (T5), migration + parity gate + `_config.yml` + user checkpoint (T6), CLAUDE.md + update-cv skill (T7). Round-trip LibreOffice-fallback path is exercised only if Word is unavailable at test time; acceptable — the code path is small and the e2e test covers whichever engine the machine resolves.
- Names cross-checked: `parse_cv`, `tokenize_runs`, `render_docx`, `export_pdf`, `extract_pdf_text`, `main`, `INDENT` consistent across tasks.
