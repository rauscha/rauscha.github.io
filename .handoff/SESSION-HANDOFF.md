# Session hand-off — 2026-08-07 (machine: laptop)

## STATE (read this first)
- Branch: `master`, clean, pushed. One worktree; nothing stranded.
- The CV is now **Markdown-source**: edit `cv/Andrew_Rausch_CV.md`, build with
  `python cv/build_cv.py cv/Andrew_Rausch_CV.md -o .` (see CLAUDE.md "CV Maintenance" —
  fully rewritten, trust it). Served PDF is 6 pages, carries the July content updates,
  parity-verified. The old docx-editing workflow is dead.

## Done this session
- Built + published the CV toolchain: canonical repo **github.com/rauscha/md-cv** (public,
  colleague-facing, Jane Doe sample; 30 tests). Vendored here as `cv/build_cv.py`.
- Migrated the real CV to Markdown (word-for-word parity gate), merged 12 upstream commits
  of July CV content (Teaching/Clinical sections, new abstracts) into the Markdown, adopted
  the 1.15" column + sub-bullet + en-dash conventions, scaffold-section `[TBC]` semantics.
- `update-cv` global skill rewritten for the new pipeline. Deleted stale remote branch
  `claude/docx-cv-access-08vyls`.
- Distribution to partners: zip/bat approach ABANDONED (email filters + hospital AV — and
  never host executables on this domain, owner ruling). Replacement: hosted converter at
  **cv.mfm.media** — being built in the `C:\mfm.media` project (see its hand-off/NEXT-STEPS).

## Next up
- Nothing blocking in this repo. Two small open decisions parked in NEXT_STEPS.md
  ("New / open items"): Rotation Director on resume/index pages; CV name-header style.
- When cv.mfm.media goes live (mfm.media project), nothing changes here — md-cv's README
  already points colleagues at it.

## Watch out for
- `Andrew_Rausch_CV.docx`/`.pdf` at root are GENERATED — never hand-edit; rebuilds happen
  through the Markdown only.
- Publication changes still touch BOTH `publications.html` and the CV Markdown (CLAUDE.md
  has the current lettering: works-in-review is subsection **(i)**).
- md-cv repo is public: no personal data beyond the intended fictional sample.
