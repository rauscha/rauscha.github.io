# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic website for Andrew C. Rausch, MD (Maternal-Fetal Medicine, University of Chicago). Served via GitHub Pages at andrewrausch.com. Pure static HTML/CSS/JS — no build pipeline, no dependencies, no preprocessing.

## Deployment

Push to `master` → GitHub Pages auto-deploys. No build step required. The `CNAME` file sets the custom domain (`andrewrausch.com`).

## Architecture

Three HTML pages share a common layout pattern:

- **Sidebar (fixed, 260px):** avatar, name/tagline, navigation, social links with inline SVG icons
- **Main content:** grid-based semantic sections
- All three pages (`index.html`, `publications.html`, `resume.html`) duplicate the sidebar HTML — changes to sidebar elements (nav links, social icons, contact info) must be made in all three files.

**`params.json`** — central metadata (name, tagline, bio, GA4 ID). Do not delete; used for page regeneration context.

**`stylesheets/stylesheet.css`** — single consolidated stylesheet. Uses CSS custom properties (`--color-*`, `--font-*`, `--layout-*`) for theming. Includes dark mode via `@media (prefers-color-scheme: dark)` and responsive breakpoints. Typography via Google Fonts (Lato).

**`Andrew_Rausch_CV.pdf`** — at the repo root; linked directly from `resume.html` and the sidebar. A stray copy also exists at `images/Andrew_Rausch_CV.pdf` — the live links use the root copy. Update both HTML files if the file is renamed.

## Easter Egg

Konami code (↑↑↓↓←→←→BA) triggers a fake ultrasound terminal readout. Logic is inline in `index.html`.
