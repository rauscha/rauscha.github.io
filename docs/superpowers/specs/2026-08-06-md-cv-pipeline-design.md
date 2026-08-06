# Markdown CV Pipeline — Design

**Date:** 2026-08-06
**Status:** Approved pending user review
**Decisions made:** Approach B (custom build script). Outputs: PDF + Word doc from one Markdown source. Light visual refresh. Shareable Jane Doe MD sample distributed as a standalone public repo.

## Problem

The CV is currently maintained as `Andrew_Rausch_CV.docx` (source of truth) and exported to PDF via headless LibreOffice. Every update requires run-level python-docx surgery, a throwaway-copy dance to strip `[TBC]` scaffold lines, font-substitution workarounds, and manual post-export checks (page count, indents, content diff). The documented export recipe is Linux-only (`apt-get`) and doesn't work on the Windows desktop. The binary source also produces useless git diffs.

## Goal

Markdown becomes the single source of truth. One command builds both a styled `.docx` and a pixel-perfect `.pdf`, with the CV's conventions (`[TBC]` stripping, empty-subsection `None`, section ordering) enforced by code instead of prose warnings in CLAUDE.md. The tooling is packaged so colleagues can adopt the same workflow with a sample CV.

## Architecture

Two repos:

### 1. New standalone public repo: `github.com/rauscha/md-cv` (name adjustable)

The canonical, shareable tool. Contents:

- `build_cv.py` — the build script (canonical copy)
- `sample/Jane_Doe_CV.md` — a complete, realistic academic CV for "Jane Doe, MD" in the Markdown format, mirroring Andrew's CV structure (appointments, training, licensure, publications with lettered subsections, invited talks, etc.), including a `[TBC]` line and an empty subsection so the sample demonstrates both conventions
- `sample/Jane_Doe_CV.docx` / `sample/Jane_Doe_CV.pdf` — committed build outputs so colleagues see the result without running anything
- `README.md` — written for a non-technical academic: what this is, why Markdown ("update your CV by telling Claude what changed"), install steps (Python + `pip install python-docx pywin32`), how to build, and the Markdown format reference
- `requirements.txt`

### 2. This repo (`rauscha.github.io`)

- `cv/Andrew_Rausch_CV.md` — Andrew's real CV source
- `cv/build_cv.py` — vendored copy of the script, with a header comment noting the canonical copy lives in `rauscha/md-cv` (vendoring keeps cloud sessions self-contained; sync manually on material script changes)
- `Andrew_Rausch_CV.docx` and `Andrew_Rausch_CV.pdf` — build outputs, unchanged names/locations so no site links change
- `_config.yml` exclude list must cover `Andrew_Rausch_CV.docx` (already excluded today) and the new `cv/` directory — only the PDF is served

## Markdown format

Designed to read like the CV itself:

- Line 1: `# Andrew C Rausch, MD`; following plain lines up to the first `##` are the contact block
- `## SECTION NAME` — top-level sections (rendered as the current ALL-CAPS headers)
- `### (a) Peer-reviewed Publications` — lettered subsections
- Dated entries: `2018-2021 | Assistant Professor, Obstetrics & Gynecology, University of Chicago` — the `|` becomes tab + 1" hanging indent
- Non-dated content (contact lines, numbered publication citations): plain paragraphs, in order
- Inline `**bold**` and `*italic*` supported everywhere (author names, journal titles)
- Any line containing `[TBC]` is kept in the source as working scaffold and stripped from both outputs
- A lettered subsection with no entries renders as `None` (matches current sections b–e convention)

## Build script (`build_cv.py`)

Single command: `python build_cv.py <cv.md> [-o outdir]` — the Markdown path is a required argument; outputs default to the Markdown file's directory. The site repo invocation is `python cv/build_cv.py cv/Andrew_Rausch_CV.md -o .` so outputs land at the repo root.

1. **Parse** the Markdown per the format above.
2. **Generate docx** with python-docx. All styling lives in one constants block at the top: font family/sizes, section-header treatment, spacing, `Emu(914400)` hanging indent + tab stop for dated entries. This block is the entire surface of the "light refresh."
3. **Export PDF from the generated docx** so the two outputs can never diverge:
   - Primary: Word COM automation via `pywin32` (Word is installed on the desktop)
   - Fallback (no Word, e.g. Linux cloud sessions): headless LibreOffice (`soffice --convert-to pdf`), auto-detected
4. **Self-checks** (via `pdfplumber` or `pypdf`):
   - Assert `TBC` does not appear in extracted PDF text
   - Report page count
   - Print a text-level diff of extracted PDF text vs. the previous PDF so the operator sees exactly what changed

## Light refresh

Confined to the style constants block: conservative structure preserved (academic CV conventions untouched), improvements limited to spacing consistency and section-header typography. The first build produces a before/after comparison for approval before the new PDF replaces the live one.

## Migration (one-time)

1. Script-extract the current `Andrew_Rausch_CV.docx` into `cv/Andrew_Rausch_CV.md` (tabs → `|`, runs → inline markup), then hand-check.
2. Build with the new pipeline.
3. Parity gate: extracted text of old PDF vs. new PDF must match word-for-word, allowing only (a) line-wrap reflow and (b) intended refresh changes explicitly listed at review time.
4. After approval, the docx flips from source-of-truth to build output.

## Documentation updates (after migration passes)

- Rewrite the **CV Maintenance** section of `CLAUDE.md`: edit the MD, run the build, done. Remove the python-docx surgery notes, LibreOffice/apt-get recipe, `[TBC]` throwaway-copy procedure, and manual post-export checks (now automated).
- Update the global **`update-cv` skill** to the new flow (it currently teaches the docx choreography).

## Testing / verification

- Migration parity gate (above) is the primary correctness test.
- Round-trip sanity: build the Jane Doe sample in both export paths (Word COM on desktop; LibreOffice fallback) and confirm both produce valid PDFs.
- Site check: `resume.html` and sidebar CV links unchanged and working after the new PDF lands.

## Out of scope

- No change to `publications.html` workflow (still edited alongside the CV, per existing convention).
- No redesign of the CV structure or content.
- No automated cross-repo sync of the vendored script.
