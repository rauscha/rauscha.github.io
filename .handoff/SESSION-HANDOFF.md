# Session hand-off — 2026-06-20 (machine: Windows 11 / andre)

## STATE (read this first)
- Branch: `master` — clean and **synced with origin** (HEAD `3f7bc0c`).
- One worktree only; nothing stranded. Site is live at andrewrausch.com.
- This session: built **two new global skills** for maintaining the site, then used one of
  them (`update-cv`) to refresh the site from a new CV. Everything committed and pushed.
- ⚠️ The new skills live in `C:\Users\andre\.claude\skills\` — **outside this repo** — so they
  do NOT sync to the desktop via this repo's git. See "Watch out for".

## Done this session
- **Two new global skills created** (in `C:\Users\andre\.claude\skills\`):
  - **`update-cv`** — hand it a CV PDF; it swaps the downloadable `Andrew_Rausch_CV.pdf` and
    propagates notable changes across `resume.html`, `publications.html`, `index.html`, and
    meta/`params.json`, then shows a diff and waits for approval before commit/push.
  - **`add-app-card`** — adds an app or podcast card to `apps.html` matching house markup
    (live URL if deployed at `andrewrausch.com/<repo>/`, else `github.com/rauscha/<repo>`;
    podcasts get Listen + RSS). Also approval-gated.
- **Validated `update-cv`** with a cold-agent dry run in an isolated worktree, then folded 4
  fixes back into the skill: PDF text extraction via `pypdf` (the Read tool hits a `pdftoppm`
  error on Windows), accepted/in-press article handling, a `pub-index` renumber-and-verify
  caution, and a committee-vs-directorship threshold for the resume.
- **Ran `update-cv` for real** (commit `3f7bc0c`) from `Downloads\Andrew Rausch CV.pdf`:
  swapped the CV PDF; added Burns et al. "Unintentional Extensions of the Cesarean Hysterotomy
  Incision" as **in-press peer-reviewed #1**; added **ENDORAMA 2023** invited talk (#6); added
  **FBC Policy Committee** role to the resume; added the **Quantitative Ultrasound Biomarkers**
  trial to the home "Currently" list. `pub-index` renumbered. Pushed live.

## Next up
1. **`add-app-card` is untested** — dry-run it (cold agent + worktree, same as `update-cv`)
   the next time there's a real or sample app/podcast, to prove it before relying on it.
2. Optional: **fix the stale `CLAUDE.md` line** that still references a
   `images/Andrew_Rausch_CV.pdf` "stray copy" — that file no longer exists.
3. Optional: run the skill **description-optimizer** to tune triggering on both new skills.
4. Carried over from 2026-06-07 (status unverified): **submit `sitemap.xml` to Google Search
   Console** — one-time action on Google's side, verify via the GA4 method. Check whether this
   was ever done.

## Watch out for
- **The two new skills are NOT in this repo.** They're in `C:\Users\andre\.claude\skills\
  {update-cv,add-app-card}\`. To use them on the desktop, that folder must be synced/copied
  there separately — pulling this repo will NOT bring them over.
- **All shared chrome lives in `js/`** (`sidebar.js`, `footer.js`, `analytics.js`, `konami.js`)
  — edit ONCE, never per page. See `CLAUDE.md` → Architecture.
- **User is often remote and CANNOT see local browser previews** — verify visual/behavioral
  changes with a headless jsdom render + a live-site curl. jsdom is not installed in-repo
  (no-dependency project); install it to a throwaway temp dir if needed, don't add it to the repo.
- **CV PDF filename `Andrew_Rausch_CV.pdf` is hard-linked** from `resume.html` and
  `js/sidebar.js` — keep it stable. There is no `images/` copy.
- HTML files are CRLF, JS files are LF (`autocrlf=true`) — the "LF will be replaced by CRLF"
  warning on `git add` is benign.
- Apps/podcast serve from the custom-domain path (`andrewrausch.com/Dialog-podcast/...`), not
  `rauscha.github.io/...`.
