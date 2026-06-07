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

**`Andrew_Rausch_CV.pdf`** — at the repo root; linked from `resume.html` and the sidebar (`js/sidebar.js`). A stray copy also exists at `images/Andrew_Rausch_CV.pdf` — the live links use the root copy. Update `resume.html` and `js/sidebar.js` if the file is renamed.

## Easter Egg

Konami code (↑↑↓↓←→←→BA) triggers a fake ultrasound terminal readout. Logic lives in `js/konami.js` (shared across all pages).
