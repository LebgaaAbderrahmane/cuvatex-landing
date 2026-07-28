# CUVATEX landing — audit / fix backlog

Audited 2026-07-27 against commit `b471be8` (branch `fix/hero-illustration-contrast`).

> **Update 2026-07-28 — P0 fix pass.** Items **1, 2, 3, 6** are fixed and re-verified in
> the browser, plus item **9** (a one-liner living inside the same code as item 6).
> Item **4** was left alone on purpose — placeholder copy, to be replaced later.
> Item **5** was fixed and then **reverted at the owner's request**; the picsum URLs are
> back and the item stays open. Item numbers are kept stable so the cross-references
> below still resolve. Each fixed item keeps its original description and gains a
> **RESOLVED** block.
>
> Re-verification: 21 automated browser checks against the production preview build
> (`vite build` + `vite preview`, Playwright, 320/375/768/1440 px × `en-US`/`fr-DZ`/`ar-DZ`,
> both themes), plus a separate 5-check run against a build made with **no**
> `VITE_WEB3FORMS_KEY`. All 26 pass. `oxlint` still reports exactly one warning (item 28).

**Method:** full read of all ~4,200 lines of source; `vite build`; `oxlint`; Playwright
driving the **production preview build** (`vite preview`) at 320 / 375 / 768 / 1024 /
1440 px × en / fr / ar, light + dark theme, region-coded locales (`ar-DZ`, `fr-DZ`,
`en-US`), `prefers-reduced-motion: reduce`, keyboard tab order, `picsum.photos` blocked,
and a mocked web3forms `{success:false}` response.

Each item is tagged **(measured)** — observed in the browser — or **(from code)** —
reasoned from reading the source, not reproduced live.

Placeholder copy is deliberately excluded, with one exception: item 4 is about
*fabricated specifics*, which is a different problem from lorem ipsum.

---

## P0 — breaks for real visitors

### 1. Mobile menu links change the URL but never scroll (measured) — ✅ RESOLVED

**Fixed in `src/components/Header.jsx`.** The mobile links no longer rely on the browser's
own fragment scroll. `handleMobileNavClick` calls `preventDefault()`, closes the panel,
pushes the hash with `history.pushState` (so the back button still works), and then calls
`scrollIntoView({ behavior: 'smooth' })` on the target section — which is never the element
being unmounted. `href` is kept on the anchor so right-click / open-in-new-tab / no-JS still
behave.

Re-measured at 375 px, en: click `#mobile-nav a[href="#work"]` → `scrollY` **0 → 5671**
(section was 5751 px down), hash `#work`, panel closed, `#work h2` lands **108 px** below the
header bottom. Back button returns to `scrollY = 0`.

<details><summary>original finding</summary>

The whole site is unnavigable on a phone. Tap any link in the hamburger panel: the hash
updates, the panel closes, the page stays exactly where it was. Tapping the same link a
second time does nothing either.

Isolated at 375 px, en:

| action | result |
|---|---|
| click `#mobile-nav a[href="#work"]` | `location.hash = "#work"`, `scrollY` **0 → 0** |
| same click, second attempt | `scrollY` still **0** |
| `location.hash = "#team"` set directly | `scrollY` → **10112** ✓ |
| desktop nav link at 1440 | `scrollY` → **10668** ✓ |
| mobile link with `scroll-behavior: auto` forced | `scrollY` → **12162** ✓ |
| plain `<a href="#faq">` injected outside the panel | `scrollY` → **12162** ✓ |

Traced `scrollY` for 25 frames after the click — flat 0 the whole way, and still 0 after
3 s, so it is not a slow smooth-scroll.

Cause: `src/components/Header.jsx:223` runs `onClick={() => setMenuOpen(false)}`. The
anchor lives inside the `AnimatePresence` panel, so React unmounts the clicked element in
the same tick the browser starts its smooth scroll to the fragment, and the browser drops
the scroll. It only reproduces with `src/index.css:11` `scroll-behavior: smooth` active —
which is why the desktop nav, whose links are never unmounted, works fine.

Fix direction: do not unmount the link out from under the browser. Either scroll
explicitly in the handler (`e.preventDefault()` + `getElementById(id).scrollIntoView()`,
then close), or defer `setMenuOpen(false)` until after the scroll starts.

</details>

### 2. Arabic renders left-to-right for actual Algerian visitors (measured) — ✅ RESOLVED

**Fixed in two layers**, because the config layer alone is not observable from source.

1. `src/i18n/index.js` — added `supportedLngs: ['en','fr','ar']`, `load: 'languageOnly'`
   and `detection: { convertDetectedLanguage: lng => lng.split('-')[0] }`.
   ⚠️ **`convertDetectedLanguage` must be a function.** The audit's suggested string form
   (`'languageOnly'`) is not valid in `i18next-browser-languagedetector@8`: the detector
   only special-cases the literal `'Iso15897'` and otherwise *calls* the value, so any
   other string throws `this.options.convertDetectedLanguage is not a function` during
   init and **the entire app renders blank**. This was caught by the browser run, not by
   `vite build` — the build passes either way.
2. The four comparison sites now read `i18n.resolvedLanguage`, which is always one of the
   three supported codes, instead of `i18n.language`, which can keep a region suffix:
   `src/App.jsx`, `src/components/Hero.jsx`, `src/components/CtaBanner.jsx`,
   `src/components/LanguageSwitcher.jsx`.

Re-measured on a fresh load, no language button clicked:

| locale  | `dir` | `documentElement.lang` | CTA arrow | switcher shows |
|---------|-------|------------------------|-----------|----------------|
| `ar-DZ` | rtl ✓ | `ar` ✓                 | ← ✓       | AR ✓           |
| `fr-DZ` | ltr ✓ | `fr` ✓                 | → ✓       | FR ✓           |
| `en-US` | ltr ✓ | `en` ✓                 | → ✓       | EN ✓           |

<details><summary>original finding</summary>

Real browsers send `ar-DZ`, not `ar`. `src/i18n/index.js` sets no `supportedLngs`, no
`load`, and no `convertDetectedLanguage`, so `i18n.language` keeps the region suffix.
Translations still resolve (i18next falls back `ar-DZ` → `ar`), but every exact comparison
against a bare two-letter code fails.

Measured on a fresh load, no language button clicked:

| locale  | `dir`   | h1 text | CTA arrow | switcher shows |
|---------|---------|---------|-----------|----------------|
| `ar-DZ` | **ltr** | Arabic  | **→**     | **EN**         |
| `fr-DZ` | ltr     | French  | →         | **EN**         |
| `en-US` | ltr     | English | →         | EN             |
| `ar`    | rtl     | Arabic  | ←         | AR             |

Broken by this:
- `src/App.jsx:25` — `lang === 'ar' ? 'rtl' : 'ltr'` → `'ar-DZ' !== 'ar'` → LTR layout
- `src/components/Hero.jsx:118` and `src/components/CtaBanner.jsx:37` — `dirArrow['ar-DZ']` undefined
- `src/components/LanguageSwitcher.jsx:12` — falls back to `'en'`, so the button reads
  **EN** while the page is in Arabic
- `document.documentElement.lang` is set to the raw `ar-DZ` / `fr-DZ`

Result: Arabic text inside a left-to-right layout, labelled English. Reads as
half-finished rather than broken, which is worse.

Fix direction: normalise the detected language in `i18n/index.js` (`supportedLngs:
['en','fr','ar']` + `load: 'languageOnly'`), then all four call sites work unchanged.

</details>

### 3. Clients stats row overflows the viewport on every phone width (measured) — ✅ RESOLVED

**Fixed in `src/components/Clients.jsx`.** The stats row now wraps: `flexWrap: 'wrap'` +
`rowGap: clamp(20px, 3vw, 28px)` on the container, `whiteSpace: 'nowrap'` dropped from the
labels, and the per-item side padding lowered to `clamp(12px, 3vw, 36px)`. The 1 px dividers
are kept. Nothing changes at ≥ 768 px, where overflow already measured 0.

Re-measured — `documentElement.scrollWidth` vs `window.innerWidth`:

| viewport | en | fr | ar |
|---|---|---|---|
| 320 | 320 = 320 ✓ | 320 = 320 ✓ | 320 = 320 ✓ |
| 375 | 375 = 375 ✓ | 375 = 375 ✓ | 375 = 375 ✓ |

All four stat numbers sit fully inside the viewport at both widths (at 375/en they span
45→153, 74→155, 204→301, 202→305 px). Known cosmetic leftover: on a wrapped row a divider
can land at a row edge — see item 29.

<details><summary>original finding</summary>

`src/components/Clients.jsx:72-116` lays four stats in a `display:flex` row with no
`flexWrap`, `whiteSpace:'nowrap'` on every label, `padding: 0 clamp(16px,3vw,36px)` per
item and 1 px dividers between them. It cannot fit under ~600 px, so it pushes past both
edges of the document and the whole page scrolls sideways.

| viewport | en | fr | ar |
|---|---|---|---|
| 320 | **+136 px** | **+151 px** | **+91 px** |
| 375 | **+109 px** | **+123 px** | **+64 px** |
| 768 / 1024 / 1440 | 0 | 0 | 0 |

At 375/en the row spans −108 px … +484 px against a 375 px viewport: "Projects
delivered" is cut off on the left and "Satisfaction rate" on the right — 2 of the 4 stats
are unreadable (screenshot confirms `…ed` and `S` clipped at the edges). This is also a
regression: the previous audit measured zero horizontal overflow at every width.

Fix direction: `flexWrap: 'wrap'` + `justifyContent: 'center'`, or a 2×2 grid below
600 px, and drop `whiteSpace: 'nowrap'`.

</details>

### 4. The site advertises fabricated numbers, clients and testimonials (from code; contradictions measured)

This is not placeholder copy — it is specific, checkable claims that are not true, on a
page meant to sell to real Algerian businesses. It is a launch blocker and a
false-advertising exposure, not a copy TODO.

Currently live in `src/i18n/{en,fr,ar}.json`:
- `clientStats` — "40+ Projects delivered", "30+ Happy clients", "98% Satisfaction rate",
  "4 Years in business"
- `services[].badge` — "50+ shipped", "99.9% uptime"
- `clientTypes[].stat` — "40% of projects", "25+ delivered", "15+ clinics", "10+ MVPs",
  "30+ sites"
- `testimonials` — three named people at named businesses ("Sarah K., Cosy Corner Café";
  "Mehdi L., MediCare Clinics"; "Amine B., Boulevard Shop"), each rendered with a hard-coded
  5-star rating (`src/components/Testimonials.jsx:117`)

They also contradict each other in ways a visitor can spot: `clientStats` claims 40+
projects while the services badge claims "50+ shipped" and the `clientTypes` figures sum
past 80. `en` says "4" years in business; `fr` and `ar` both say "4+".

Fix direction: replace with real figures or remove the numbers entirely. Testimonials
should be pulled until there are real ones with permission to publish.

### 5. Hero, Services and Work depend on picsum.photos at runtime (measured) — ⏸ STILL OPEN

**A fix was implemented and then reverted at the owner's request** on 2026-07-28. Six local
SVG wireframes were added under `public/placeholders/` (≈2 kB each, 13.8 kB total against
903 kB from picsum) and wired into `HeroShowcase`, `Services` and `data/projects.js`. The
production bundle then contained zero picsum references and the page rendered with picsum
fully blocked. The owner asked to keep the remote placeholders until real screenshots exist,
so all of it was reverted — `HeroShowcase.jsx` and `Services.jsx` are byte-identical to
`b471be8` again, and `data/projects.js` is back to its picsum helpers.

**The bug below is therefore unfixed.** Note it is now *worse* than measured: the case-study
overlay added since this audit calls `heroImage()` and `shotImage()`, so the full-screen
case-study hero is also picsum-dependent.

Every image on the page except `whoWeAre.jpg` and the logo is fetched from
`picsum.photos` at page load — including the hero, which is the LCP element.

Measured at 1440/en:
- **16 third-party image requests before any scrolling**, 24 after a full scroll
  (`HeroShowcase` renders all 6 desktop + all 6 mobile frames stacked with `opacity`, so
  `loading="lazy"` buys nothing — all 12 fetch immediately)
- **903 kB** of the page's 1,630 kB of images comes from `fastly.picsum.photos`
- no `preconnect` for that origin, unlike the Google Fonts origins

With picsum blocked (`route.abort()`): 18 aborted requests, **25 broken `<img>` elements**,
and the hero renders as empty white rectangles with `ShopFlow` alt text where the product
mockups should be. Screenshot: `hero-no-picsum.png`.

Any CSP, ad-blocker, corporate proxy or picsum outage empties the entire above-the-fold
visual. Fix direction: ship local placeholder assets in `public/` until real screenshots
exist.

### 6. Contact form dies silently in a clean production build — ✅ RESOLVED

Three changes:

1. **`Dockerfile`** — `ARG VITE_WEB3FORMS_KEY`, `ARG VITE_UMAMI_SCRIPT_URL`,
   `ARG VITE_UMAMI_WEBSITE_ID` declared **inside the `build` stage**, above `RUN pnpm build`.
   `ARG` is per-stage — putting them in `base` would not have reached the build, which is the
   easy way to get this wrong. `ARG` is already visible to `RUN` as an env var, so no `ENV`
   line is needed. `docker-compose.yml` only builds `target: dev` (no `pnpm build`), so it
   needs no change.
2. **Runtime guard** (`src/components/Contact.jsx`) — if `VITE_WEB3FORMS_KEY` is missing the
   form fails immediately with a `console.error` naming both fixes, instead of POSTing
   `access_key="undefined"`. `{success:false}` responses and thrown errors are now logged too,
   and both fire a `contact_form_error` analytics event.
3. **Visible fallback** — the error state renders `mailto:` and WhatsApp links. This sits in
   the error *render*, not in one specific branch, so it covers all three causes. No new i18n
   keys were needed: `t('error')` already ends "…or email us directly." in all three locales.

Verified against a build made with an **empty** `VITE_WEB3FORMS_KEY`: zero requests reach
web3forms, the error state appears immediately, `mailto:hello@cuvatex.com` and the WhatsApp
link both render, and the console carries the misconfiguration message. Separately verified
with a mocked `{success:false}` on a normal build: same fallback UI, response body logged.

<details><summary>original finding</summary>

`src/components/Contact.jsx:6` reads `import.meta.env.VITE_WEB3FORMS_KEY`, which Vite
inlines at build time. `Dockerfile` has no `ARG` / `ENV` for it before `RUN pnpm build`,
so on CI — or any machine without a local `.env` — the POST carries
`access_key="undefined"`, web3forms rejects it, and the visitor sees the generic
`t('error')`.

Verified the failure path end to end with a mocked `{success:false}`: the user gets
"Something went wrong…" and nothing is logged anywhere. Leads just vanish, with no
server-side visibility. There is no build-time guard and no runtime guard.

</details>

---

## P1 — visible defects

### 7. The header height is hardcoded as 56 px; it is actually 67 / 73 px (measured)

`56` appears as a magic number in eight places — `Services.jsx` lines 42, 43, 44, 49, 113,
121, 122 (`top`, `cardSpace`, `lastCardStickyTop`, `translateRange`, container height,
card `top`, card `height`), `Hero.jsx:21` and `Clients.jsx:19`
(`minHeight: calc(100dvh - 56px)`). The real header is **67 px on desktop and 73 px on
mobile** (14 px padding × 2 + the tallest child: 38 px theme button, 44 px hamburger).

Consequences, all measured:

| symptom | desktop | mobile |
|---|---|---|
| Hero extends past the fold | 11 px | 17 px |
| Services sticky title tucked under the header | 11 px | 17 px |

`Clients.jsx:19` carries the same wrong constant; it was not measured separately, and
because it is a `minHeight` the section is content-taller than the fold anyway.

The Services title block's top padding absorbs the overlap so no text is actually clipped,
but the block slides *under* the translucent blurred header instead of meeting it.

Worse on short phones: at 375 × 667 (iPhone SE) the hero is 712 px tall against a 667 px
viewport — **118 px past the fold**, so the "scroll to services" cue sits below the fold on
the exact devices it exists for.

Fix direction: measure the header once and expose it as a CSS variable
(`--header-h`), then use `var(--header-h)` everywhere instead of `56`.

### 8. Theme and RTL flash on load (measured)

`ThemeProvider` writes the CSS variables in a `useEffect`. With `studio-theme=dark`
stored, `body` background is sampled as `rgb(246,245,242)` (light) for ~300 ms, then flips
to `rgb(19,18,16)`. Every dark-mode return visit starts with a white flash.

Same class of bug for Arabic: `index.html:2` hardcodes `lang="en"` with no `dir`, so an
Arabic visitor gets a full LTR first paint before `App.jsx` corrects it.

Fix direction: a small inline script in `index.html` that reads `localStorage` and sets the
variables plus `dir` before first paint.

### 9. The error message is brand green (measured) — ✅ RESOLVED

Fixed alongside item 6, since it is the same paragraph. A `--danger` token was added to
**both** theme maps in `src/theme/ThemeContext.jsx` (`#b3261e` light, `#f2857c` dark — the
light red is unreadable on `#131210`), and the `role="alert"` block now uses it.

Re-measured on a failed submit: `rgb(179, 38, 30)`, no longer `rgb(14, 122, 105)`. Confirmed
`--danger` also resolves in dark theme, so theme switching is not broken.

<details><summary>original finding</summary>

`src/components/Contact.jsx:271` colours the `role="alert"` with `var(--accent)`. Measured
computed colour on a failed submit: `rgb(14, 122, 105)` — identical to `--accent`. A
submission failure reads as a success. No danger token exists in either theme map in
`src/theme/ThemeContext.jsx`.

</details>

### 10. The third hero orb is not centred (measured)

`src/components/HeroBackground.jsx:67-89` sets `transform: 'translate(-50%, -50%)'` in the
inline style *and* `animate={{ x, y }}`. Framer Motion writes its own `transform`, so the
centring offset is silently dropped.

Measured at 1440: orb rect `left=748, width=240` → centre at **868 px**, against a viewport
centre of 720 px. The orb hangs off to the right of where the code says it should be.
Fix direction: move the centring into `left/top` offsets, or into Motion's own
`x: '-50%', y: '-50%'` initial values.

### 11. The phone mockup covers a quarter of the laptop screen (measured; the verdict is a judgment call)

In `HeroShowcase`, the phone (`bottom:3%; right:3%; width:30%`) overlaps the laptop screen
by a constant **27 % of its width** at every breakpoint, and stands **135–155 px taller**
than the laptop screen it is supposed to sit in front of:

| viewport | laptop screen | phone | overlap | phone taller by |
|---|---|---|---|---|
| 1440 | 736 → 1240 | 1102 → 1282 | 138 px (27 %) | 135 px |
| 1024 | 204 → 792 | 631 → 841 | 161 px (27 %) | 155 px |
| 375 | 40 → 321 | 244 → 345 | 77 px (27 %) | 82 px |

The ratio is constant across breakpoints, so this is the intended composition rather than a
responsive break. The call to change it is a judgment: the laptop's right edge, its rounded
corner and the right third of the browser chrome are never visible at any width, which
reads as clipped rather than layered. At 375 px the whole
showcase is 335 × 223 px and the mockup's inner text (`shop.app`, `9:41`, `Mobile`) renders
at 7–8 px — unreadable, but still costing 12 image requests.

### 12. `prefers-reduced-motion` is ignored almost everywhere (measured)

With `reducedMotion: 'reduce'`:
- `ScrollReveal` fades 0 → 1 and translates 24 px → 0 over ~700 ms, tracking the
  `no-preference` curve sample for sample (`0.28 / 0.65 / 0.83 / 0.92 / 0.96` vs
  `0.35 / 0.69 / 0.83 / 0.92 / 0.97`)
- the hero background orbs keep drifting (transform changes between samples)
- the hero scroll-down button keeps bouncing
- `HeroShowcase` keeps auto-advancing (label went `ShopFlow` → `Pulse` within 4.2 s)
- the Clients marquee still runs `marquee 40s` — it is a CSS animation in
  `src/index.css:37`, so Framer's setting cannot reach it at all

`Process.jsx` is the only component that calls `useReducedMotion`.

Fix direction: wrap the app in `<MotionConfig reducedMotion="user">` for the Framer side,
plus an `@media (prefers-reduced-motion: reduce)` block in `index.css` for the marquee, and
gate the `HeroShowcase` interval.

### 13. The nav omits four sections that exist (from code)

`src/components/Header.jsx:7` lists `services, process, work, team, faq, contact`.
`#pricing`, `#about`, `#clients` and `#testimonials` all render but are unreachable from
the header. Pricing especially — it is the first thing a non-technical buyer looks for.

### 14. "Show less" is hardcoded English (from code)

`src/components/Work.jsx:215` renders the literal string `Show less`, so French and Arabic
visitors who expand the project grid get an English button. Every other label in that
component goes through `t()`.

### 15. Focus ring is the UA default only (measured)

First tab stop in dark theme reports `outline: rgb(16, 16, 16) auto 1px` — near-invisible
against the `#131210` background. There is also no skip-to-content link. `src/index.css`
is the right place for `:focus-visible`, and it does not touch the design.

### 16. Eight touch targets under 44 px (measured)

Counted at 375 px in `ar` (the count shifts slightly per language, since label width
changes): language button 44 × 38, theme toggle 38 × 38, "View all projects" 143 × 42,
the CTA banner link (75 × 23), both `hello@cuvatex.com` links (~20 px tall) and the
WhatsApp link (35 × 20).

---

## P2 — code and repo quality, no user impact yet

### 17. `HeroIllustration.jsx` is 691 lines of dead code

Never imported anywhere (`grep` finds only its own `export default`). It is the single
largest source file in the project.

### 18. Content hardcoded in JSX, against the CLAUDE.md rule

- `src/components/Team.jsx:5` — `names = ['Alex Morgan', 'Sam Rivera', 'Jordan Lee']`;
  Arabic needs transliterated names, so these have to move into the locale files
- `src/components/Work.jsx:6` — `projectDefs`
- `src/components/HeroShowcase.jsx:4-11` — six fake project names and categories
  (`ShopFlow / E-Commerce Platform`, `Pulse / Analytics Dashboard`, …) rendered directly
  into the hero in all three languages

### 19. `Work` has no per-project data array in i18n

Unlike `services` / `steps` / `faq`, there is no array — all 8 cards render the same
`projectTitle` / `projectDesc` and the same `imgLabel` alt text. Putting real case studies
in means restructuring the component, so **design the JSON shape before writing any copy.**

### 20. Duplicate `id="top"` (measured)

`src/App.jsx:29` (the wrapper `div`) and `src/components/Hero.jsx:18` (the hero `section`).
Invalid HTML; `document.getElementById('top')` resolves to the `div`. The logo link and the
BackToTop button both still land at `scrollY = 0`, so nothing visibly breaks today — but
any code that queries `#top` silently gets the wrong element.

### 21. Payload

- `dist/assets/index-*.js` is a single **464 kB / 143 kB gzip** chunk (was 425/132 before
  `lucide-react` and the redesigns). Mostly framer-motion. No code splitting.
- `public/whoWeAre.jpg` is **716 kB** for a `4/3` box that renders at ~560 px wide — the
  single heaviest first-party asset, unoptimised and not served as WebP/AVIF.
- Images total **1,630 kB** across 26 files on a full-page scroll.

### 22. Docker / secrets — 🟡 HALF RESOLVED

- ✅ `Dockerfile` now declares `ARG VITE_WEB3FORMS_KEY` / `VITE_UMAMI_SCRIPT_URL` /
  `VITE_UMAMI_WEBSITE_ID` inside the `build` stage — the other half of item 6.
- ⏸ `.dockerignore` still does not exclude `.env`, and was **left alone deliberately**: the
  file carries an explicit comment saying the omission is intentional, so reversing it is the
  owner's call, not a silent fix. Worth noting the ARG path above now makes the
  `.env`-in-image workaround unnecessary — passing `--build-arg` is enough — so `.env` can be
  added to `.dockerignore` whenever the owner wants. (The web3forms key is not really a secret
  either way: Vite inlines it into the shipped JS bundle.)

### 23. Breakpoint mismatch at exactly 768 px (measured)

`Header.jsx:11` uses `max-width: 767px`; `Process.jsx:9` and `Work.jsx:14` use
`max-width: 768px`. At exactly 768 px you get the desktop nav together with the mobile
Process layout (measured: `desktopNav=true, hamburger=false, processGrid="691.219px"`,
i.e. one column and no sticky visual panel). Harmless today, but the two numbers should
come from one place.

### 24. Services measures its title height once and never re-measures on content change (from code)

`Services.jsx:25-32` reads `titleRef.getBoundingClientRect().height` on mount and on
`window.resize`. Neither the web-font swap (IBM Plex arrives async from Google Fonts) nor a
runtime language change re-triggers it, and every card `top` / `height` in the sticky stack
is derived from that one number. Did not reproduce at 900 px — the en and ar titles are both
147 px there — but any width where the translated heading wraps differently will offset the
whole stack. A `ResizeObserver` on the title removes the whole class of problem.

### 25. SEO / metadata gaps (measured)

- `<title>` and `<meta name="description">` stay English on the Arabic and French pages
- no `<link rel="canonical">`, no `hreflang` alternates, no JSON-LD (`0` of each)
- no `robots.txt` and no `sitemap.xml` — neither file exists in `public/`. (`vite preview`
  masks this by answering `200 text/html` from its SPA fallback; the production nginx image
  has no such fallback and would 404.)
- favicon is the raw 10 kB `Cuvatex_logo.png`; there is no `apple-touch-icon`
- `og:url` / `og:image` point at `https://cuvatex.com/`, which may not be the real domain

### 26. Repo hygiene

- `CUVATEX Portfolio.html` (**621 kB**) is tracked — looks like a leftover mockup
- root `Cuvatex_logo.png` duplicates `public/Cuvatex_logo.png`
- `public/favicon.svg` and `public/icons.svg` are referenced by nothing

### 27. CLAUDE.md is stale

Its section list (`Hero, Services, Process, Work, About, Team, Contact`) predates Clients /
Testimonials / CtaBanner / Faq / Pricing / Footer / BackToTop, and it still describes
`Contact.jsx` as "frontend-only" when it already POSTs to web3forms.

### 28. oxlint warning

`src/theme/ThemeContext.jsx:53` — mixed exports break fast refresh. The only lint output.
(Still the only one after the P0 pass; the line number moved to 58.)

### 29. Stats-row divider can land at a wrapped row edge (cosmetic, from code)

Introduced by the item 3 fix. The 1 px dividers between stats are separate elements, so when
the row wraps on a narrow phone one can end up at the end of a row with nothing after it. It
is a hairline and easy to miss; removing the dividers entirely, or switching the row to a
`repeat(auto-fit, minmax(...))` grid, would clear it.

### 30. Duplicated language/direction logic between `App.jsx` and `LanguageSwitcher.jsx`

Both write `documentElement.lang` and `dir` (CLAUDE.md already flags that these two must stay
in sync). Both are now correct after item 2, but the `App.jsx` effect already fires on
language change, so the `LanguageSwitcher.setLang` copy is redundant and is the obvious place
for the two to drift apart again.

---

## Missing — conversion gaps, not bugs

For non-technical visitors, roughly in order of payoff:

- **Floating WhatsApp button.** Highest-converting channel locally; right now WhatsApp is
  one buried text link in Contact — and it still points at
  `https://wa.me/PHONE_NUMBER_PLACEHOLDER` (`Contact.jsx:115`).
- **Booking link** (Cal.com / Calendly). Lower friction than a form for a non-technical
  buyer.
- ~~**Analytics**~~ — ✅ done. Umami loads from `src/analytics.js` via `main.jsx`, production
  builds only, with `track()` conversion events (`contact_form_submit`, `whatsapp_click`,
  and now `contact_form_error`). Config lives in `.env.example`.
- **JSON-LD `Organization` + `FAQPage`.** The FAQ copy already exists and maps straight
  to Google rich results. Cheapest SEO win available here.
- **Footer is a single line.** Non-technical visitors scroll to the bottom looking for
  phone, address, hours.
- Business / location / legal info (Algiers) for local trust.
- Contact form has no phone field and sends no confirmation email to the sender.

---

## Checked and clean

Re-verified against this commit, not carried over:

- **The mobile header does not wrap.** Measured 73 px at 320 / 375 and 67 px at
  768 / 1024 / 1440 in all three languages; the six nav links sit behind the hamburger
  (`Header.jsx:163`).
- **Anchor targets clear the header.** Navigating by hash, every section heading lands
  60–111 px below the header bottom at 375, and 98–175 px at 1440. (Getting there on
  mobile is item 1.)
- **No horizontal overflow at any width.** Re-measured after the item 3 fix: 320 and 375 px
  are now clean in all three languages too, not just 768 / 1024 / 1440. The `auto-fit`
  `minmax` grids collapse correctly.
- **Services cards do not clip their content.** Inner content is 551–627 px inside a
  649 px card at 375 across all three languages, including the longer French strings.
- All three locale files have **identical key structure**, arrays included — no silent
  English fallbacks.
- `vite build` passes; `oxlint` reports exactly one warning (item 28).
- **Zero console errors and zero page errors** across all 15 viewport × language
  combinations.
- RTL `dir` flips correctly for **both** `ar` and `ar-DZ` since the item 2 fix, and logical
  properties hold up — no physical `left`/`right` leaks found.
- `CtaBanner` renders once (`App.jsx:38`).
- Back-to-top and the logo link both land at `scrollY = 0` despite item 20.

---

## Suggested fix order

Items 1, 2, 3, 6 and 9 are done. What is left, in order:

1. **Item 4** — decide what the real numbers are, or delete them. Blocks launch, not code.
2. **Item 5** — ship local placeholder assets. Reverted once by choice; still the single
   biggest runtime dependency on a third party, and it now covers the case-study overlay too.
3. **Item 7** — one `--header-h` variable replaces eight hardcoded `56`s.
4. **Items 8, 10, 20** — near one-liners, batch them.
5. **Item 12** — `<MotionConfig reducedMotion="user">` plus one media query.
6. **Item 17** — delete `HeroIllustration.jsx`.
7. **Item 22** — decide whether `.env` belongs in `.dockerignore` now that `--build-arg`
   works.

> Note: items 14 (`Show less` hardcoded), 19 (no per-project i18n array) and part of 15
> (focus ring) look addressed by the case-study work that landed in the tree separately —
> `Work.jsx` now uses `t('workCtaLess')` and per-slug `projects.<slug>` keys, and
> `index.css` has a `.focus-ring:focus-visible` rule. Not verified in this pass; re-audit
> them rather than trusting this note.
