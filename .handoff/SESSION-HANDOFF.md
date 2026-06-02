# Session hand-off — 2026-06-01 (machine: Windows 11 / andre)

## STATE (read this first)
- Branch: `master` — clean and **synced with origin** (pushed at end of session).
- Latest commit: `6d414dd` "Add Apps page; refresh bio, CV, and sidebar".
- The site gained a new **Apps** page (live at andrewrausch.com/apps.html), a refreshed
  homepage, a new CV PDF, and the Twitter/X link removed sitewide. Everything is committed
  and pushed; GitHub Pages auto-deploys from `master`.
- One open item needs your call: a stale **Codex worktree** is still on disk with edits that
  are already superseded by master (see "Watch out for"). Nothing valuable is stranded.

## Done this session
- New `apps.html`: cards linking **SleepApp**, **Critter Radar** (Dreamlight Valley companion),
  **Parallax** (Braids synth playground, WIP), and the **Asynchronous** podcast (+ RSS feed).
  Added "Apps" to the sidebar nav on all four pages; added a scoped `.app-card` component to the stylesheet.
- Homepage: interests line "3D imaging/printing" → "AI and machine learning in obstetrics";
  trimmed the "Currently" list (removed the book-chapters line and the "(2026)" on Director of
  Ultrasound); changed Research & Interests tags from rounded pills to squared corners.
- Replaced the CV with the current PDF (from `C:\GDrive\Andrew Rausch CV.pdf`) and **deleted**
  the redundant `images/Andrew_Rausch_CV.pdf` duplicate.
- Removed the Twitter/X link from the sidebar on all pages; registered `apps.html` in `sitemap.xml`.
- Integrated 4 remote CNAME commits (custom-domain toggling) via rebase — no conflicts.

## Next up
1. **Remove the stale Codex worktree** at `C:\Users\andre\.codex\worktrees\237f\rauscha.github.io`
   — its edits are superseded by master, so it's safe: `git worktree remove --force <path>`.
2. **Decide on `AGENTS.md`** (untracked root file): update + track it, git-ignore it, or delete it.
3. Optional polish: reduce sidebar HTML duplication (now copied across **4** pages) by extracting
   a shared snippet; submit `sitemap.xml` to Google Search Console.

## Watch out for
- `NEXT_STEPS.md` is **git-ignored** ("local instructions only") — it does NOT sync to the desktop.
  Its still-relevant items are captured here instead.
- The apps serve from the **custom-domain path** (e.g. `andrewrausch.com/SleepApp/`), not
  `rauscha.github.io/...`, because the user-page repo has a CNAME. All four app/podcast URLs
  returned HTTP 200 this session.
- The Codex worktree is the classic "edits hiding in a worktree" trap: detached at `4847bfe`
  with a superseded CV blob and a redundant params.json (GA-ID removal already on master).
  Safe to discard — but confirm before deleting.
- DNS/SSL (the old NEXT_STEPS Cloudflare runbook, Steps 1–4) appear complete: the site loads
  over HTTPS without cert errors.
