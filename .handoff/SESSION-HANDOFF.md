# Session hand-off — 2026-06-07 (machine: Windows 11 / andre)

## STATE (read this first)
- Branch: `master` — clean and **synced with origin** (HEAD `e194a46`).
- One worktree only; nothing stranded. Site is live at andrewrausch.com and verified.
- This session: added 3 podcast digest feeds to the Apps page, then de-duplicated the
  last of the cross-page boilerplate (GA4, footer, Konami egg) into shared `js/` files.
  Everything committed, pushed, and confirmed live.

## Done this session
- **Podcast digest cards** (commit `089c79d`): added **MFM Rounds**, **The Fetal Frontier**, and
  **Signal in the Scan** to the Podcast section of `apps.html`, each mirroring the Asynchronous
  card (Listen + Subscribe via RSS). Feeds:
  `andrewrausch.com/Dialog-podcast/feed-{mfm,fetal,ai}.xml` (all 200, valid RSS).
- **De-duplicated GA4 / footer / Konami** into shared files (commit `e194a46`), matching the
  existing `js/sidebar.js` pattern. New: **`js/analytics.js`**, **`js/footer.js`**, **`js/konami.js`**.
  ~115 lines removed per page. `analytics.js` now **skips `file://` and localhost** so local
  previews don't pollute GA4. Verified with a headless jsdom render of all 4 pages (sidebar,
  footer, year stamp, Konami all wire up) + live curl (all shared JS serve 200, zero inline
  leftovers). `CLAUDE.md` updated to describe the shared-JS layout and the 4th page (apps.html).

## Next up
1. **Submit sitemap to Google Search Console** — no code change needed; a one-time action on
   Google's side. `sitemap.xml` (all 4 pages) and `robots.txt` are already correct. Easiest:
   add `andrewrausch.com` at search.google.com/search-console, verify via the **Google Analytics**
   method (GA4 `G-BWSX87WFZ6` is already sitewide → one click), then **Sitemaps → submit
   `sitemap.xml`**. (Only needs code if the meta-tag verification method is chosen instead.)
2. Optional / likely-moot: `app.andrewrausch.com` subdomain — apps now serve from path URLs
   (andrewrausch.com/SleepApp/, /Dialog-podcast/, etc.), so the subdomain is probably unnecessary.

## Watch out for
- **All shared chrome now lives in `js/`** — `sidebar.js`, `footer.js`, `analytics.js`, `konami.js`.
  Edit ONCE, never per page. A new page needs the two shells
  (`<aside ... id="site-sidebar">`, `<footer ... id="site-footer">`) + the four `<script src>`
  includes. See `CLAUDE.md` → Architecture.
- The page `<head>` font/stylesheet/favicon links are the only remaining cross-page repetition —
  sharing them would need a build step (Jekyll), which this project deliberately avoids. Leave as-is.
- User is often **remote** and CANNOT see local browser previews — verify visual/behavioral changes
  with a headless jsdom render + a live-site curl. jsdom is NOT installed in-repo (no-dependency
  project); install it to a throwaway temp dir for the check, don't add it to the repo.
- HTML files are CRLF, JS files are LF (`autocrlf=true`) — the "LF will be replaced by CRLF" warning
  on `git add` is benign.
- `NEXT_STEPS.md` is **git-ignored** (local only) — does NOT sync to the other machine; forward
  items are mirrored here.
- Apps/podcast serve from the custom-domain path (`andrewrausch.com/Dialog-podcast/...`), not
  `rauscha.github.io/...`.
