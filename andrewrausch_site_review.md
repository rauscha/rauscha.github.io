# andrewrausch.com — Site Review
**Prepared for:** Andrew C. Rausch, MD  
**Date:** May 13, 2026  
**Reviewer:** Design/Code Consultant via Claude  

---

## Executive Summary (Candid)

The good news: the site has a clean, professional, minimalist design that suits a senior academic physician perfectly. It's hand-coded HTML/CSS with no unnecessary bloat, loads fast, and the easter egg is genuinely delightful — conceptually perfect for an MFM doc and technically well-implemented.

The bad news: **the site has a critical, visitor-visible security failure right now.** Anyone who types `https://andrewrausch.com` into a browser gets a TLS certificate error — the SSL certificate is issued for a different hostname and doesn't cover your domain. This is a first-impression disaster for a physician at a major academic institution. It needs to be fixed before anything else.

On top of that, the Google Analytics tracking ID in your live HTML is still the template placeholder `G-XXXXXXXXXX` — meaning you have zero analytics data being collected, ever.

These two issues are fixable in under an hour. Everything else is polish.

---

## Score Card

| Area | Grade | Notes |
|---|---|---|
| Design / Aesthetic | A− | Clean and professional; minor polish opportunities |
| Content | A | Accurate, well-structured, up to date |
| HTML Code Quality | B+ | Semantic, accessible; sidebar duplication is debt |
| Security & HTTPS | **F** | Certificate hostname mismatch — live security failure |
| Analytics | F | Placeholder GA4 ID — no data ever collected |
| Easter Egg | A | Excellent — concept, execution, and theming |

---

## Part 1: Design & Appearance

### What Works Well — Keep It

**The layout is right for you.** A fixed sidebar with your identity/nav/links on the left and clean main content on the right is exactly the pattern used by strong academic personal sites. It's information-dense without being cluttered.

**The typography is solid.** Lato is an excellent choice — readable, professional, slightly warmer than the sterile system fonts common on academic sites.

**The inline SVG icons are a great call.** No icon font to load, no external dependency, crisp at any resolution, and accessible with proper `aria-hidden` attributes throughout. This is how it should be done.

**The accessibility is notably good.** Skip link for screen readers, `aria-label` on every external link, `aria-current="page"` on the active nav item, semantic `<main>`, `<aside>`, `<footer>`, `<nav>`. Most personal sites skip all of this. Yours doesn't.

**The content itself is strong.** The bio paragraph on the home page is well-written — not a dry CV recitation. The astronomy/physics background paragraph in particular does real work in establishing your intellectual profile. Keep all of it.

### What to Improve

**The headshot is 48×48 pixels.** On a retina or HiDPI display (which is the majority of modern laptops and all Apple hardware), this will be rendered at 96×96 CSS pixels from a 48px source image and will look noticeably soft or blurry. Replace it with a version at 2× or higher resolution — 160×160px minimum for a 80px display size. PNG or WebP.

**Sidebar HTML is copied in all three files.** Your `CLAUDE.md` notes this correctly: any change to the sidebar (new social link, phone number, title update) must be made identically in `index.html`, `publications.html`, and `resume.html`. This is technical debt that will cause a mismatch bug at some point. See the fix section for how to address this.

**Publications page numbering looks reversed.** The list renders with "12" at the top descending to "1" — the intent appears to be to show a counter, but presenting it with the most recent publication labeled "12" and a 2011 paper labeled "1" reads as a descending ordinal rather than a reverse-chronological number. Consider just removing the numbers entirely (your PubMed link is right there) or reversing the display so your most recent work is "1."

**No `robots.txt` or `sitemap.xml`.** Not critical for a simple 3-page personal site, but Google recommends it and it helps search engines index you correctly.

---

## Part 2: Security & Infrastructure — Critical Issues

### 🔴 Issue #1: SSL Certificate Hostname Mismatch (CRITICAL)

**What's happening:** When anyone navigates to `https://andrewrausch.com`, they receive a TLS handshake error. My fetch tool confirmed it explicitly: `certificate verify failed: Hostname mismatch, certificate is not valid for 'andrewrausch.com'`. This means the certificate GitHub Pages provisioned doesn't match your domain. Chrome and Firefox will show a full-screen red warning page blocking access.

**Why it happens:** GitHub Pages provides free SSL certificates via Let's Encrypt for custom domains, but only if two conditions are met:
1. DNS A records (or CNAME for www) point correctly to GitHub Pages servers, **and**
2. "Enforce HTTPS" is enabled in your GitHub repository settings.

**How to fix it:** See the step-by-step in Part 3 below.

**Impact:** This is the equivalent of a "Not Secure" padlock on every page for anyone who types the https:// version or clicks a secure link. For a University of Chicago physician with professional contacts, this undermines trust immediately.

### 🔴 Issue #2: Google Analytics Placeholder ID

**What's happening:** Your deployed `index.html` contains this in the `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

`G-XXXXXXXXXX` is the template placeholder — it's not your real Measurement ID. The GA script loads on every page view, but all the data fires into a void and is not recorded anywhere. You have collected zero analytics data, ever.

**How to fix it:** See Part 3.

### 🟡 Issue #3: No HTTPS Redirect

Once the certificate is fixed, you'll also want to ensure that visitors who go to `http://` (plain HTTP) are automatically redirected to `https://`. GitHub Pages handles this automatically once "Enforce HTTPS" is enabled — but it only works after the certificate is properly provisioned.

### 🟡 Issue #4: Institutional Email Exposed as Plain Text

`ARausch@bsd.uchicago.edu` is in the HTML source as a visible `mailto:` link. This is standard practice and expected for an academic contact page — but it means automated harvesters will collect it. No immediate action needed unless you're getting significant spam through this channel, in which case there are obfuscation techniques available.

---

## Part 3: Code Quality

### What's Good

- **No external JavaScript dependencies.** Everything runs on vanilla JS. This is excellent for security, performance, and longevity. No jQuery, no npm packages, no supply-chain risk.
- **Relative asset paths throughout.** All images, stylesheets, and internal links use relative paths (`href="index.html"`, `src="images/..."`) rather than hardcoded absolute URLs. This is correct and portable.
- **Modern JavaScript patterns in the easter egg.** Uses `e.key` (not the deprecated `e.keyCode`), IIFE scoping, and `{ once: true }` event listener options — all current best practices.
- **Footer auto-year via JS.** `document.getElementById('year').textContent = new Date().getFullYear()` — small but professional touch.

### What Needs Fixing

**The `publications.html` and `resume.html` pages don't have the easter egg.** The Konami code triggers nothing on those pages. This may be intentional, but it's worth a decision: either add it to all pages or leave it home-only by design.

**The `CLAUDE.md` has a path inconsistency.** It references the CV as `images/Andrew_Rausch_CV.pdf` but it actually lives at the repo root as `Andrew_Rausch_CV.pdf`. Not a user-facing bug, but it would confuse Claude when editing.

---

## Part 4: Easter Egg — Detailed Review

### Verdict: Excellent

The Konami code (↑↑↓↓←→←→BA) triggers a fake ultrasound terminal readout in a green-on-black CRT-style overlay. This is thematically *perfect* — an MFM physician specializing in ultrasound hiding a fake ultrasound scan in a cheat code is inspired. It's clever without being trying-too-hard.

### What's Working Well

- **Concept:** 10/10. The connection to your specialty is obvious and delightful to anyone who catches it.
- **Scope isolation:** Wrapped in an IIFE — no global variable pollution.
- **Duplicate prevention:** The `if (document.getElementById('us-overlay')) return;` guard prevents stacking overlays if the code is entered rapidly.
- **Animation timing:** The variable `LINE_PAUSE` array creates a satisfying dramatic effect — lines 9–10 ("Scanning... Scanning...") have 500ms and 700ms pauses respectively, building tension before the measurements appear. Nice.
- **CRT aesthetic:** The scanline overlay via `repeating-linear-gradient` and text glow via `text-shadow` are well-executed without being over-engineered.
- **Dismissal:** Works on any keydown or any click. Clean. Uses `{ once: true }` correctly.
- **The comment `<!-- ↑↑↓↓←→←→BA -->`** above the script in the HTML: this is a clue visible in page source. Whether this is intentional or accidental is a design decision — if you want the easter egg to require discovery, you might remove the comment. If you want source-code readers to find it, it's a charming nod.

### Minor Issues

**Early dismiss:** The close listener is attached the moment the overlay opens, so pressing any key while the animation is still typing will dismiss the overlay mid-animation. Someone excited by triggering the Konami code who then presses a key to "see what happens next" will close it accidentally. You could fix this by attaching the close listener only after the animation completes (move it to run after `li >= LINES.length`).

**The easter egg is only on `index.html`.** The code is not included in `publications.html` or `resume.html`. This means visitors who land on those pages directly — which is common from Google search results — can't trigger it. Easy fix: copy the script block to the other two pages.

**`LINE_PAUSE` array vs. `LINES` array alignment:** These are 21 and 21 elements respectively, but the indexing pattern means LINE_PAUSE[0] is never used (the pause is applied *after* a line finishes). This is harmless and works correctly — just slightly confusing to read if you're maintaining it later.

---

## Part 5: What to Fix and How — Step-by-Step

### Fix #1 — SSL Certificate (30 minutes, do this first)

This requires actions in two places: GitHub Pages settings, and verification that your DNS records are correct.

**Step 1: Check GitHub Pages settings**
1. Go to `https://github.com/rauscha/rauscha.github.io`
2. Click **Settings** (top right of the repo)
3. In the left sidebar, click **Pages**
4. Under "Custom domain," confirm `andrewrausch.com` is entered
5. Look for a checkbox labeled **"Enforce HTTPS"** — check if it's enabled. If it's grayed out with a message about the certificate, proceed to Step 2.

**Step 2: Verify DNS A records at Gandi**
Log into your Gandi account and check your DNS zone for `andrewrausch.com`. You need four A records pointing to GitHub Pages:
```
@   A   185.199.108.153
@   A   185.199.109.153
@   A   185.199.110.153
@   A   185.199.111.153
```
And optionally a www CNAME:
```
www CNAME rauscha.github.io
```
If these aren't set, add them. DNS propagation takes 1–48 hours.

**Step 3: Wait for certificate provisioning**
Once the DNS is confirmed and saved in GitHub Pages settings, GitHub will auto-provision a Let's Encrypt certificate within 30 minutes to a few hours. Watch the Pages settings page — it will show "Certificate: Active" when done.

**Step 4: Enable "Enforce HTTPS"**
Once the certificate shows as Active, check the "Enforce HTTPS" box. This redirects all `http://` requests to `https://` automatically.

---

### Fix #2 — Google Analytics (10 minutes)

**Step 1: Create or find your GA4 property**
1. Go to `https://analytics.google.com`
2. Sign in with your Google account
3. Create a new **GA4 property** for andrewrausch.com if you don't have one, or find an existing one
4. Under **Data Streams → Web**, get your **Measurement ID** — it will look like `G-XXXXXXXXX` (where X's are actual letters/numbers, e.g., `G-7F3NK2PQ1X`)

**Step 2: Update the HTML in all three pages**
In `index.html`, `publications.html`, and `resume.html`, find the two occurrences of `G-XXXXXXXXXX` and replace both with your real Measurement ID. The section looks like:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
Replace both `G-XXXXXXXXXX` strings with your actual ID.

**Step 3: Commit and push**
```
git add -A
git commit -m "Fix GA4 tracking ID"
git push origin master
```

---

### Fix #3 — Headshot Resolution (10 minutes)

Replace `images/me_48px.jpg` with a higher-resolution version.

1. Find a clean headshot photo (professional, well-lit)
2. Resize it to **160×160 pixels** at minimum (or 200×200) using any photo editor or https://squoosh.app
3. Export as **WebP** (smaller file, better quality) or JPEG at 85% quality
4. Name it `me_160px.webp` (or whatever makes sense)
5. In all three HTML files, update the `<img>` tag:
```html
<img
  class="site-avatar"
  src="images/me_160px.webp"
  alt="Andrew C. Rausch, MD — headshot"
  width="80"
  height="80"
>
```
Note: If you want the avatar to display at 80px on-screen (double the current 48px, which would help visual presence), set `width="80" height="80"` in the HTML and update the CSS to match. The source image at 160px provides 2× resolution for retina.

---

### Fix #4 — Add Easter Egg to All Three Pages (5 minutes)

Copy the entire `<!-- ↑↑↓↓←→←→BA -->` block and the `<script>` that follows it from `index.html`, and paste it in the same position (just before `</body>`) in `publications.html` and `resume.html`.

---

### Fix #5 — Optional: Reduce Sidebar Duplication

This is medium-effort but worth doing. The cleanest approach for a pure static site with no build pipeline is to use a tiny inline JavaScript snippet to inject the shared sidebar HTML from a single source file, loaded before the page renders. Alternatively, GitHub Pages supports Jekyll, which has native includes — but that would require converting your site to Jekyll, which is more work than it's likely worth.

The simplest option: create a file called `_sidebar.html` containing only the sidebar HTML, then use a 5-line JS fetch to load and inject it. This is a reasonable weekend project once the critical fixes are done.

---

## Summary of Priority Actions

| Priority | Action | Time | Where |
|---|---|---|---|
| 🔴 Now | Fix SSL certificate (check GitHub Pages + DNS) | 30 min | GitHub + Gandi |
| 🔴 Now | Replace GA4 placeholder ID with real ID | 10 min | All 3 HTML files |
| 🟡 Soon | Replace 48px headshot with 160px+ version | 10 min | `images/` + all 3 HTML |
| 🟡 Soon | Add easter egg to publications + resume pages | 5 min | publications.html, resume.html |
| 🟢 Later | Fix publications page numbering display | 15 min | publications.html |
| 🟢 Later | Add robots.txt and sitemap.xml | 20 min | repo root |
| 🟢 Later | Reduce sidebar HTML duplication | 1–2 hrs | all 3 HTML files |
