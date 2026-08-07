# Project Pitch — 3 Candidate Ideas

Date: 2026-08-08
Status: awaiting user decision (per skill section 3, building requires explicit approval)

Research basis: live SERP review (DuckDuckGo/Bing) of 8 tool niches on 2026-08-08:
QR generator, image compressor, add watermark, SVG→PNG, age calculator, JSON formatter,
number→words, time zone converter, online timer, invoice generator, HEIC→JPG.

Key finding: every classic tool niche is now crowded, BUT the top-10 SERPs in almost
every niche contain multiple young, thin, ad-heavy sites — proof that well-executed new
sites still rank here within weeks-to-months. The openings are: dated/cluttered UI,
server-upload privacy concerns, forced signup/watermarks, and slow load.

---

## Candidate 1 — Online Timer + Stopwatch suite (volume play)

**What it does:** a single fast page that is a fullscreen countdown timer, stopwatch,
and Pomodoro timer — with quick presets, custom time, keyboard shortcuts, audio+visual
alerts, multiple display styles, and shareable URL presets (`/t/25m`). Installable PWA,
works offline. Pure static HTML/JS/CSS, no backend.

**Why it beats the current #1:** current leaders (vclock.com, bestonlineclock.com,
timer-tab.com) are dated, ad-cluttered, and slow. "online timer" is ~1M searches/month
globally and is inherently repeat-use — exactly the behavior that ranks and monetizes.
No one has built a genuinely polished, fast, offline-capable timer; several thin new
domains already rank, so the bar to pass is low.

**Monetization:** AdSense later (low-ish CPC ~$0.5–1) but volume-driven; plus a tip link.

**Effort:** ~3–5 days to build + polish. Lowest ranking risk. Best for social traction
(r/Productivity, Product Hunt — easy to demo in a gif).

**Risk:** low CPC; competition is real but beatable on quality.

## Candidate 2 — No-signup Invoice generator (value play)

**What it does:** browser-only invoice builder — logo upload, live preview, line items,
multi-currency, tax/discount, autosave to localStorage, one-click PDF download, QR
"pay" link optional. No signup, no watermark, files never leave the device.

**Why it beats the current #1:** the classic invoice-generator.com is clunky and dated;
Zoho/Wave/FreshBooks all force signup. Freelancers and micro-businesses search this
with commercial intent (best ad CPC of the three, ~$1–3) and return every month.

**Monetization:** AdSense (business audience), tip link, and a legitimate later upgrade
path (cloud save/paid templates) once there's an audience.

**Effort:** ~4–6 days. Hardest to rank (big brands own the head term) — plan is to win
long-tail ("invoice generator no sign up", "free invoice pdf maker") first.

**Risk:** biggest revenue ceiling but slowest ranking. Also invoice accuracy matters to
people (correctness/legal-ish formatting is a QA priority, but it's a tool, not advice).

## Candidate 3 — HEIC→JPG converter (intent play)

**What it does:** 100% client-side HEIC/HEIF decoder (libheif via WASM) → JPG/PNG/WebP.
Drag-drop, batch, quality slider, EXIF strip/rotate, ZIP download. No upload, unlimited,
works offline. Solves the real "iPhone photos won't open on Windows" problem.

**Why it beats the current #1:** iLoveIMG/FreeConvert/Convertio upload to servers with
free-tier limits and wait times; existing browser-based HEIC tools are thin. A fast,
private, unlimited client-side converter is a clean win on the one axis users care
about: speed + privacy.

**Monetization:** AdSense + tip. High intent but mostly one-time use per user (less
repeat traffic than Candidates 1–2).

**Effort:** ~3–5 days (WASM bundling is the fiddly part). Fastest to a shippable product.

**Risk:** weakest repeat-use; WASM payload must be kept small or first load is slow.

---

## Recommendation

**Build Candidate 1 (Timer suite) first.**

Reasoning: it best satisfies the skill's two filters at once — repeat-use behavior
(returns daily, ranks, monetizes) and a beatable current #1 (dated, ad-heavy, slow).
It's the most shareable (growth via legitimate community posts), pure-static so the
"24/7 free hosting" story is honest, and the least risky to rank. Candidate 2 has the
higher revenue ceiling and is the best long-run pivot after Candidate 1 is live, since
they share the same static-infra and SEO setup.

Honest timeline framing (per skill): this is a weeks-to-months marathon. Even a
perfect tool won't earn meaningful money before ~2–3 months of indexing, submissions,
and community presence. I won't oversell that.

## What I need from you

1. Which candidate to build (1 / 2 / 3), or a modified idea.
2. Brand identity: a working tool name (I'll propose a few when we start) and whether
   to publish under a neutral brand rather than your personal name.
3. Later (not now): custom domain choice and GitHub repo hosting need separate approval.
