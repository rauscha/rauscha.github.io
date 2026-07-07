# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic website for Andrew C. Rausch, MD (Maternal-Fetal Medicine, University of Chicago). Served via GitHub Pages at andrewrausch.com. Pure static HTML/CSS/JS — no build pipeline, no dependencies, no preprocessing.

## Deployment

Push to `master` → GitHub Pages auto-deploys. No build step required. The `CNAME` file sets the custom domain (`andrewrausch.com`).

## Architecture

Four HTML pages (`index.html`, `publications.html`, `resume.html`, `apps.html`) share a common layout: a fixed sidebar (avatar, name/tagline, navigation, social links with inline SVG icons) and a grid-based semantic main column.

**Shared chrome lives in `js/`, not duplicated in each page.** Every page is a thin shell that pulls the common pieces in via classic `<script src>` includes (chosen over `fetch` so pages still render when opened from disk via `file://`). Edit these once — never per page:

- **`js/sidebar.js`** — injects the sidebar into the `<aside id="site-sidebar">` shell; sets the active nav link automatically from the page filename.
- **`js/footer.js`** — injects the footer into the `<footer id="site-footer">` shell; also stamps the current year.
- **`js/analytics.js`** — GA4 loader (measurement ID `G-BWSX87WFZ6`), included in each `<head>`; skips `file://` and localhost so local previews don't pollute analytics.
- **`js/konami.js`** — the easter egg (see below).

A new page needs: the `<head>` boilerplate + `<script src="js/analytics.js">`; an `<aside id="site-sidebar">` + `<script src="js/sidebar.js">` shell; a `<footer id="site-footer">` + `<script src="js/footer.js">` shell; and `<script src="js/konami.js">` before `</body>`. The per-page `<head>` link tags (fonts, stylesheet, favicon) and the page `<title>`/`description` stay in each file — sharing those would require a build step, which this project deliberately avoids.

**`params.json`** — central metadata (name, tagline, bio, GA4 ID). Do not delete; used for page regeneration context.

**`stylesheets/stylesheet.css`** — single consolidated stylesheet. Uses CSS custom properties (`--color-*`, `--font-*`, `--layout-*`) for theming. Includes dark mode via `@media (prefers-color-scheme: dark)` and responsive breakpoints. Typography via Google Fonts (Lato).

**`Andrew_Rausch_CV.pdf`** — at the repo root; linked from `resume.html` and the sidebar (`js/sidebar.js`). A stray copy also exists at `images/Andrew_Rausch_CV.pdf` — the live links use the root copy. Update `resume.html` and `js/sidebar.js` if the file is renamed. **`Andrew_Rausch_CV.pdf` is generated — never hand-edit it. Edit `Andrew_Rausch_CV.docx` and re-export (see CV Maintenance below).**

## CV Maintenance

The CV is maintained as a Word document and served as a PDF:

- **`Andrew_Rausch_CV.docx`** — the editable **source of truth**. `_config.yml` excludes it from the published GitHub Pages site (`exclude: [Andrew_Rausch_CV.docx]`), so it lives in the repo for editing but is never served — only the PDF is linked/downloadable. If Andrew sends a newer `.docx`, replace this file and re-export.
- **`Andrew_Rausch_CV.pdf`** — generated from the docx; the only CV served to visitors.

**When a publication changes (new paper, in-press → published, etc.), update BOTH** `publications.html` **and the CV docx**, then re-export the PDF. The CV lists publications under `(a) Peer-reviewed Publications`; works not yet out live under `(h) Works in review, preparation, etc.` (an empty subsection reads `None`, matching sections b–e). The CV omits PMIDs/DOIs by convention — keep those on the website only. A published paper must be moved out of `(h)`; don't leave it listed in two states.

**Editing the docx** — use `python-docx` (`pip install python-docx`). Edit `run.text` (not just `paragraph.text`) to preserve formatting; a paragraph may split across runs (e.g. an italic "pre-print" trailing run — clear it). Match sibling entries' citation style, e.g. `Journal: <pages>. <year>`.

**Exporting the PDF** — LibreOffice headless (Word itself is unavailable):
```bash
# One-time environment setup (deps are NOT preinstalled and don't persist across sessions):
apt-get update && apt-get install -y libreoffice-writer fonts-crosextra-carlito
#   libreoffice-writer: base LibreOffice ships without the Writer module here → "source file
#     could not be loaded" on any .docx until it's installed.
#   fonts-crosextra-carlito: metric-compatible Calibri substitute → preserves Word's line breaks
#     and page count. Without it, substitution reflows the layout.
HOME=/tmp/lohome soffice --headless -env:UserInstallation=file:///tmp/loprof \
  --convert-to pdf --outdir /tmp/out "$PWD/Andrew_Rausch_CV.docx"
cp /tmp/out/Andrew_Rausch_CV.pdf Andrew_Rausch_CV.pdf
```

**Working placeholders (`[TBC]`).** The docx doubles as Andrew's working draft, so it may contain `[TBC]` ("to be completed") scaffold lines/sections for material he still needs to gather. The docx is never served (see above), but the **PDF is** — so strip every paragraph containing `[TBC]` before exporting, then collapse any doubled blank lines. Do the strip on a throwaway copy (e.g. `/tmp/cv_pub.docx`) and convert *that* to the PDF; never hand the scaffolded docx straight to LibreOffice. Confirm the result with `"TBC" not in extracted_text`.

**Post-export checks (the PDF is `pdfplumber`-readable):**
- **Page count = 5.** A stray blank page usually means trailing empty paragraphs at the end of the docx — remove them (`el.getparent().remove(el)`).
- **Column alignment.** Date/description lines use a tab plus a `left_indent` of `914400` EMU (1"). If one line's description doesn't line up, that paragraph is missing the indent — set `paragraph_format.left_indent = Emu(914400)` to match its siblings.
- **Content diff.** Compare extracted text against the previous PDF and confirm only the intended lines changed. Everything else may differ only as cosmetic line-wrap reflow (LibreOffice vs. Word) — words identical, break points shifted. That reflow is expected and accepted.

## Easter Egg

Konami code (↑↑↓↓←→←→BA) triggers a fake ultrasound terminal readout. Logic lives in `js/konami.js` (shared across all pages).
