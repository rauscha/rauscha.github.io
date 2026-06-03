# Session hand-off — 2026-06-03 (machine: Windows 11 / andre)

## STATE (read this first)
- Branch: `master` — clean and **synced with origin** (fast-forwarded this session; HEAD `275bbfc`).
- No code was authored on this machine this session. It was 3 commits behind work done on another
  machine; those are now pulled in. Only one worktree exists — nothing is stranded.
- Site is live at andrewrausch.com. Notable change made elsewhere: **Google Analytics 4 was
  re-added** (property `G-BWSX87WFZ6`) across all four pages.

## Done this session
- Re-checked worktrees: only the main one remains (the old Codex worktree stayed removed).
- Fast-forwarded local `master` to origin — 3 commits done on another machine, now synced:
  - `3fdd5d3` minor `apps.html` edit
  - `5b73f43` added GA4 tracking (`G-BWSX87WFZ6`) to index / publications / resume / apps
  - `275bbfc` minor `resume.html` edit
- Refreshed this hand-off and the local next-steps notes.

> The prior session's substantive work (new Apps page, CV swap, sidebar + Twitter changes) is in
> git history around commit `6d414dd`.

## Next up
1. Decide on `AGENTS.md` (still untracked in repo root): update + track, git-ignore, or delete.
2. Verify GA4 (`G-BWSX87WFZ6`) is actually reporting traffic in the Google Analytics dashboard.
3. Optional: de-duplicate the sidebar HTML (copied across all 4 pages) via a shared snippet.

## Watch out for
- `NEXT_STEPS.md` is **git-ignored** (local only) — it does NOT sync to the desktop. Forward items
  are mirrored here.
- GA4 was *removed* during the earlier site review and is now *back* — `CLAUDE.md`'s analytics
  notes may be stale; trust the live HTML.
- Apps serve from the custom-domain path (e.g. `andrewrausch.com/SleepApp/`), not `rauscha.github.io/...`.
- `AGENTS.md` stays untracked, so it won't reach the desktop unless you choose to track it.
