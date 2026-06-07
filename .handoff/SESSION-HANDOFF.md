# Session hand-off — 2026-06-07 (machine: Windows 11 / andre)

## STATE (read this first)
- Branch: `master` — clean and **synced with origin** (HEAD `dc59b42`).
- One worktree only; nothing stranded. Site is live at andrewrausch.com.
- This session de-duplicated the sidebar into one shared file and cleared two loose ends
  (deleted AGENTS.md, confirmed GA4 works). All committed and pushed.

## Done this session
- **Sidebar de-duplicated** into `js/sidebar.js` (commit `dc59b42`). The nav, contact links, and
  CV button now live in ONE file, injected into an `<aside id="site-sidebar">` shell on each page
  via a classic `<script>` include (chosen over fetch so a page opened from disk via file:// still
  renders). The active nav link is set automatically from the page filename. Verified with a
  headless DOM render (all 4 pages pass) + live-site curl (js/sidebar.js serves 200).
- Deleted `AGENTS.md` (stale Codex helper file).
- Confirmed GA4 (`G-BWSX87WFZ6`) is reporting — analytics working.

## Next up
1. **Podcast RSS feeds: ensure all are available / discoverable.** Pin down scope first: how many
   feeds and where they live; what "available" means — linked on the Apps page,
   `<link rel="alternate" type="application/rss+xml">` in page heads, feed validation, and/or
   submission to Apple/Spotify. (Only the "Asynchronous" / Dialog-podcast `feed.xml` is known so far.)
2. Optional: the GA4 snippet, the year script, and the Konami easter egg are still duplicated in all
   4 pages — could be folded into a shared js file the same way the sidebar was, if wanted.

## Watch out for
- To edit the sidebar now, change `js/sidebar.js` ONCE (not the 4 HTML files). A new page needs the
  `<aside class="site-sidebar" aria-label="Site navigation" id="site-sidebar"></aside>` +
  `<script src="js/sidebar.js"></script>` shell where the sidebar goes.
- The nav is now JS-rendered — it won't appear with JavaScript disabled (fine for this site; the
  main content is still static HTML).
- User is often **remote** and CANNOT see local browser preview windows — verify visual/behavioral
  changes with a headless render check (jsdom) + a live-site curl, not by opening previews.
- `NEXT_STEPS.md` is **git-ignored** (local only) — does NOT sync to the desktop; forward items are
  mirrored here.
- Apps serve from the custom-domain path (e.g. `andrewrausch.com/SleepApp/`), not `rauscha.github.io/...`.
