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

**`Andrew_Rausch_CV.pdf`** — at the repo root; linked from `resume.html` and the sidebar (`js/sidebar.js`). A stray copy also exists at `images/Andrew_Rausch_CV.pdf` — the live links use the root copy. Update `resume.html` and `js/sidebar.js` if the file is renamed. **`Andrew_Rausch_CV.pdf` is generated from `cv/Andrew_Rausch_CV.md` — never hand-edit it or the `.docx` (see CV Maintenance below).**

## CV Maintenance

The CV is maintained as Markdown and built into both served formats:

- **`cv/Andrew_Rausch_CV.md`** — the **source of truth**. Plain Markdown: `## SECTION`,
  `### (a) Subsection`, dated entries as `2018-2021 | description` (must start with a
  4-digit year, or `Current` in place of a year — e.g. `Current | Society - Member`), and
  `**bold**`/`*italic*` inline. A blank line between entries renders as vertical spacing
  (used between publication citations). Lines containing `[TBC]` are working scaffold: kept
  in the source, automatically stripped from output.
- **`cv/build_cv.py`** — vendored build script (canonical copy:
  github.com/rauscha/md-cv — sync manually if that repo's script materially changes).
- **`Andrew_Rausch_CV.docx` / `Andrew_Rausch_CV.pdf`** — GENERATED at the repo root;
  never hand-edit either. Only the PDF is served (`_config.yml` excludes the rest).

**To update the CV:** edit `cv/Andrew_Rausch_CV.md`, then:

```bash
python cv/build_cv.py cv/Andrew_Rausch_CV.md -o .
```

The build regenerates both files, exports the PDF via Word (LibreOffice fallback on
machines without Word), asserts no `[TBC]` leaked, reports the page count (expect 6),
and prints a text diff against the previous PDF — review it to confirm only the
intended lines changed. An empty lettered subsection renders as `None` automatically.

**Content conventions (apply when editing the Markdown):** en-dash, no spaces, for
numeric ranges (`2018–2021`, `2021–present`, page ranges); spaced en-dash ` – ` for
"X – Y" separators; no em-dashes, no spaced hyphens; phone numbers keep plain hyphens.
When ingesting a future docx from Andrew, beware `run / hyperlink / run` paragraphs
(e.g. the APAOG entry): python-docx's `paragraph.runs` skips hyperlinks — verify URLs
survived extraction.

**When a publication changes** (new paper, in-press → published), update BOTH
`publications.html` and `cv/Andrew_Rausch_CV.md`, then rebuild. Publications live under
`## Bibliography` → `### (a) Peer-reviewed Publications`; not-yet-published works under
`### (i) Works in review, preparation, etc.` — a published paper must move out of `(i)`,
never listed in both. The CV omits PMIDs/DOIs by convention — keep those on the website
only.

## Easter Egg

Konami code (↑↑↓↓←→←→BA) triggers a fake ultrasound terminal readout. Logic lives in `js/konami.js` (shared across all pages).
