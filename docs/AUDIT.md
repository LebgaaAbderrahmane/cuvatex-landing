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

> **Update 2026-07-29 — P1 fix pass.** The whole P1 block is now closed:
> **7, 8, 10, 12, 13, 15, 16** fixed; **9** and **14** were found already fixed by work
> that landed after the audit was written (source-verified, no code needed); **11** closed
> as **won't fix — by design**, at the owner's decision.
>
> Item 13 was scoped down with the owner: **Pricing only**, not all four missing links.
> Ten desktop nav links would wrap the header onto a second row around 768–900 px, and
> About / Clients / Testimonials are already passed while scrolling. `#about`, `#clients`
> and `#testimonials` stay reachable by hash but absent from the nav — deliberate, not a
> leftover.
>
> ⚠️ **Item 1 (P0) was found still broken** and is re-fixed here — see item 1. It was
> verified broken against a clean worktree of `7073d6c`, so the 2026-07-28 "RESOLVED" was
> wrong, not a regression from this pass. The other three P0 fixes (2, 3, 6) were re-run
> against `vite preview` as a result and all hold — see the fix-order section.
>
> Re-verification: **513 automated browser checks** against the production preview build
> (`vite build` + `vite preview`, Playwright) — see the *P1 responsive sweep* section near
> the bottom for the matrix and what each check asserts. All 513 pass. `oxlint` still
> reports exactly one warning (item 28); `vite build` passes.

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

### 1. Mobile menu links change the URL but never scroll (measured) — ⚠️ REOPENED 2026-07-29, then ✅ RESOLVED

> **The 2026-07-28 fix did not work in a production build.** Found while adding a mobile-nav
> regression guard during the P1 pass. Verified against a clean **worktree of `7073d6c`**
> (the commit the "RESOLVED" note was written for) — so this was not caused by the P1
> changes; it was never actually fixed:
>
> | build | click `#mobile-nav a[href="#work"]` |
> |---|---|
> | `7073d6c` (claimed fixed) | hash `#work` ✓, `scrollY` **0 → 0** ✗ |
> | P1 branch before this fix | hash `#work` ✓, `scrollY` **0 → 0** ✗ |
>
> The 2026-07-28 re-measurement was presumably taken against the dev server, where the
> timing differs. **This is why P0 items need re-verifying against `vite preview`.**

**Root cause, measured — it is not an interrupted scroll, the scroll never starts.**
Sampling `scrollY` every 60 ms for 2.5 s after the click gives a flat `0,0,0,…` — no
movement at any point. Isolation:

| experiment | result |
|---|---|
| `scrollIntoView({behavior:'smooth'})` from outside React | 6840 ✓ |
| same, with the panel left **open** | 6840 ✓ |
| same, after closing the panel and waiting 600 ms | 6840 ✓ |
| same, retried **after** a failed nav click | 6840 ✓ |
| desktop nav link click | 7378 ✓ |
| **mobile nav link click** | **0 ✗** |

So the panel is not the problem and smooth scrolling is not broken — only a scroll requested
*from inside that click handler* dies. The 2026-07-28 fix moved `scrollIntoView` into the
handler, but React **batches** `setMenuOpen(false)` and commits after the handler returns:
the scroll request and the panel teardown still land in the same task, and the scroll is
discarded before its first frame. Reordering the two lines cannot help, because the commit
is not where the line sits.

**Fixed** by deferring the scroll one frame:

```js
setMenuOpen(false);
history.pushState(null, '', `#${section}`);
requestAnimationFrame(() => {
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});
```

`requestAnimationFrame` puts the scroll after React's commit and after `AnimatePresence` has
started the panel's exit, at which point nothing remains to cancel it.

Re-measured at 375 px against `vite preview`, in `en` and `ar`, with **and** without
`prefers-reduced-motion` (the reduced-motion branch takes `behavior: 'auto'` and had never
been executed by any test): `scrollY` **0 → > 100** in all four, hash correct, panel closed,
and the target heading lands at or below the header bottom.

<details><summary>the 2026-07-28 fix, which did not hold</summary>

**Fixed in `src/components/Header.jsx`.** The mobile links no longer rely on the browser's
own fragment scroll. `handleMobileNavClick` calls `preventDefault()`, closes the panel,
pushes the hash with `history.pushState` (so the back button still works), and then calls
`scrollIntoView({ behavior: 'smooth' })` on the target section — which is never the element
being unmounted. `href` is kept on the anchor so right-click / open-in-new-tab / no-JS still
behave.

Re-measured at 375 px, en: click `#mobile-nav a[href="#work"]` → `scrollY` **0 → 5671**
(section was 5751 px down), hash `#work`, panel closed, `#work h2` lands **108 px** below the
header bottom. Back button returns to `scrollY = 0`.

</details>

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

### 4. The site advertises fabricated numbers, clients and testimonials (from code; contradictions measured) — ✅ RESOLVED

This is not placeholder copy — it is specific, checkable claims that are not true, on a
page meant to sell to real Algerian businesses. It is a launch blocker and a
false-advertising exposure, not a copy TODO.

Currently live in `src/i18n/{en,fr,ar}.json`:
- ~~`clientStats` — "40+ Projects delivered", "30+ Happy clients", "98% Satisfaction rate",
  "4 Years in business"~~ **Fixed 2026-08-22**: replaced with figures the owner can
  defend — `15+ Projects delivered`, `4+ Years of experience`, `3 Engineers, no
  middlemen`, `100% Code you own`. Also fixes the `en` (`"4"`) vs `fr`/`ar` (`"4+"`)
  years mismatch — all three now agree.
- ~~`services[].badge` — "50+ shipped"~~ **Fixed 2026-08-22**: replaced with
  `Works on any phone` (the same claim the Hero already uses as a badge —
  deliberate repetition, and the one fact that matters most to a mobile-first
  local audience). `99.9% uptime` was checked separately and confirmed accurate
  by the owner, not a placeholder — nothing left to fix on that one.
- ~~`clientTypes[].stat` — "40% of projects", "25+ delivered", "15+ clinics", "10+ MVPs",
  "30+ sites"~~ **Fixed 2026-08-22**: removed. No true number existed for these,
  and the `desc` line already covers what each card is for.
- ~~`testimonials` — three named people at named businesses~~ **Fixed 2026-08-22**:
  replaced with real testimonials (Hadj Messaoud, Kara Saddek); rating is now an
  optional per-entry field (`rating` in `src/i18n/{en,fr,ar}.json`), not hard-coded

Fix direction: `clientStats`, `services[].badge`, `clientTypes[].stat` and
testimonials are all done. No fabricated or contradicting number remains live
on the site.

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

### 7. The header height is hardcoded as 56 px; it is actually 67 / 73 px (measured) — ✅ RESOLVED

**Fixed by publishing the measured height as a CSS variable.** `Header.jsx` now holds a
`ref` on its `<motion.header>` and a `ResizeObserver` that writes the real border-box
height to `--header-h` on `documentElement`, on mount and on every resize. Consumers:

| site | before | after |
|---|---|---|
| `Hero.jsx` `minHeight` | `calc(100dvh - 56px)` | `calc(100dvh - var(--header-h, 73px))` |
| `Clients.jsx` `minHeight` | `calc(100dvh - 56px)` | same |
| `Process.jsx` sticky `top` | `NAV_H = 67` | `var(--header-h, 73px)` |
| `Services.jsx` sticky `top` | already measured, fallback `67` | unchanged mechanism, fallback `73` |

`Services.jsx` kept its own `ResizeObserver` rather than reading the variable: its
`cardSpace` / card `top` / card `height` are **JS arithmetic**, and a CSS variable cannot
feed that. It observes the same `<header>` element, so the two agree by construction.

Re-measured: `--header-h` equals the live header height (within 1 px) at **all 36**
viewport × language × theme combinations, and the Services sticky title now lands
**0 px** from the header bottom at 320 / 375 / 768 / 1440 in all three languages — it used
to sit 11–17 px under it.

Two things deliberately left alone, both noted rather than silently changed:

- **The hero is still taller than a short phone screen.** At 375 × 667 it was 712 px; the
  correct constant only buys back ~6 px. That is a spacing decision about the hero, not a
  wrong constant, and is out of scope for this item.
- `Process.jsx:15` `TITLE_BAR_CLEAR = 206` is still a literal. It is a derived number
  ("bottom of the sticky title bar (185) + a gap"), not a header height.

<details><summary>original finding</summary>

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

</details>

### 8. Theme and RTL flash on load (measured) — ✅ RESOLVED

**Fixed by moving the colour tokens out of JS and into CSS**, which is what makes a
before-paint fix possible without duplicating a single hex value into the HTML.

1. `src/index.css` gained `:root { … }` and `:root[data-theme='dark'] { … }` holding the
   ten tokens verbatim. This is now the single source of truth for the colours.
2. `src/theme/ThemeContext.jsx` no longer writes ten inline custom properties; it sets
   `document.documentElement.dataset.theme`. The `useTheme()` API is unchanged, so **no
   component needed editing** — every `var(--token, fallback)` inline style still works.
3. `index.html` gained a blocking inline `<script>` in `<head>` that reads
   `localStorage['studio-theme']` and `localStorage['i18nextLng']` and sets `data-theme`,
   `dir` and `lang` before the first paint. It falls back to `navigator.language` so a
   first-time Algerian visitor also gets RTL on frame one. `<html>` now carries an explicit
   `dir="ltr"` default.

⚠️ The script must be **inline and blocking**. `defer`, `type="module"` or an external file
all paint first, which is the entire bug.

Verified by aborting the app bundle (`route('**/assets/*.js', abort)`) so only the inline
script has run, with `studio-theme=dark` + `i18nextLng=ar` in storage:

| sampled before any React code | result |
|---|---|
| `body` background | `rgb(19, 18, 16)` — dark ✓ |
| `documentElement.dir` | `rtl` ✓ |
| `documentElement.lang` | `ar` ✓ |

Plus theme correctness re-checked across all 36 viewport × language × theme cells.

Deliberately **not** added: `prefers-color-scheme` defaulting. It would change what
first-time visitors see, which is a design decision this item did not ask for.

Note this makes the CLAUDE.md theming section stale in one respect — updated there too:
tokens live in `index.css`, `ThemeContext.jsx` owns the choice.

<details><summary>original finding</summary>

`ThemeProvider` writes the CSS variables in a `useEffect`. With `studio-theme=dark`
stored, `body` background is sampled as `rgb(246,245,242)` (light) for ~300 ms, then flips
to `rgb(19,18,16)`. Every dark-mode return visit starts with a white flash.

Same class of bug for Arabic: `index.html:2` hardcodes `lang="en"` with no `dir`, so an
Arabic visitor gets a full LTR first paint before `App.jsx` corrects it.

Fix direction: a small inline script in `index.html` that reads `localStorage` and sets the
variables plus `dir` before first paint.

</details>

### 9. The error message is brand green (measured) — ✅ RESOLVED (re-verified 2026-07-29)

Re-verified in the P1 pass, since the closing note asked for it rather than trusting the
record: with a mocked `{success:false}`, the `role="alert"` block computes to
`rgb(179, 38, 30)` in `en` / `fr` / `ar`, and both fallback links render. No code change.

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

### 10. The third hero orb is not centred (measured) — ✅ RESOLVED

**Fixed in `src/components/HeroBackground.jsx`.** The `transform: 'translate(-50%, -50%)'`
is gone; centring is now done with `marginTop` / `marginLeft` of
`calc(clamp(120px, 18vw, 240px) / -2)` — half the orb's own width, expressed with the same
`clamp()` so it stays correct at every breakpoint. Margins are a separate CSS property from
`transform`, so Framer Motion's `x`/`y` animation can no longer clobber them.

Re-measured at 1440: orb centre **720 px** against a viewport centre of 720 px (was 868 px).

<details><summary>original finding</summary>

`src/components/HeroBackground.jsx:67-89` sets `transform: 'translate(-50%, -50%)'` in the
inline style *and* `animate={{ x, y }}`. Framer Motion writes its own `transform`, so the
centring offset is silently dropped.

Measured at 1440: orb rect `left=748, width=240` → centre at **868 px**, against a viewport
centre of 720 px. The orb hangs off to the right of where the code says it should be.
Fix direction: move the centring into `left/top` offsets, or into Motion's own
`x: '-50%', y: '-50%'` initial values.

</details>

### 11. The phone mockup covers a quarter of the laptop screen — ⛔ CLOSED, WON'T FIX

**Closed by the owner's decision on 2026-07-29 as intended composition, not a defect.**
The audit's own measurement is the argument: the overlap is a constant **27 % of the phone
width at every breakpoint** (1440 / 1024 / 375), which is the signature of a deliberate
layered composition rather than a responsive break. Changing it would be a design change to
the hero, not a bug fix.

The two sub-observations stay on record and are *not* closed by this:
- at 375 px the mockup's inner text renders at 7–8 px and is unreadable
- the showcase still costs 12 image requests at that size (this is really item 5)

Original measurements below.

<details><summary>original finding</summary>

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

</details>

### 12. `prefers-reduced-motion` is ignored almost everywhere (measured) — ✅ RESOLVED

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

**Fixed in four layers**, because no single mechanism reaches all of it:

1. `src/main.jsx` — `<App/>` is wrapped in `<MotionConfig reducedMotion="user">`. This
   covers the bulk of the Framer animations: `ScrollReveal`'s 24 px slide, the orb drift,
   the scroll-down bounce, the header slide-in, the burger morph, `BackToTop`, and every
   `whileHover`/`whileTap` transform.
2. **`MotionConfig` alone is not enough** — it strips *transform and layout* animations but
   deliberately lets **opacity** through, and it cannot see non-Framer code at all. So:
   - `Hero.jsx` — the kicker dot pulses `opacity`, which `MotionConfig` would keep running.
     Explicitly gated on `useReducedMotion()`.
   - `HeroShowcase.jsx` — the `setInterval` is gated. Without this the cross-fade dies but
     the content still swaps, turning a fade into a **jump cut**, which is worse than the
     original.
   - `index.css` — an `@media (prefers-reduced-motion: reduce)` block neutralises the CSS
     `marquee` (Framer cannot reach a CSS animation) and sets `scroll-behavior: auto`.
   - the three `scrollIntoView` call sites (`Header.jsx` desktop + mobile nav, `Hero.jsx`)
     pass `behavior: reduceMotion ? 'auto' : 'smooth'`. **The scroll itself is kept** —
     only its smoothness is dropped. Skipping the scroll would re-break item 1.

Re-measured with Playwright's `reducedMotion: 'reduce'`, sampling 4.5 s apart:

| | before | after |
|---|---|---|
| marquee `transform` | changing | identical ✓ |
| hero orb `transform` | changing | identical ✓ |
| `HeroShowcase` label | `ShopFlow` → `Pulse` | unchanged ✓ |
| `scroll-behavior` | `smooth` | `auto` ✓ |

<details><summary>original finding</summary>

Fix direction: wrap the app in `<MotionConfig reducedMotion="user">` for the Framer side,
plus an `@media (prefers-reduced-motion: reduce)` block in `index.css` for the marquee, and
gate the `HeroShowcase` interval.

</details>

### 13. The nav omits four sections that exist (from code) — ✅ RESOLVED (scoped)

**Pricing added; the other three left out on purpose.** `Header.jsx:7` is now
`['services','process','work','pricing','team','faq','contact']`, with `nav.pricing` added
to all three locale files (`Pricing` / `Tarifs` / `الأسعار`). `Pricing.jsx` already had
`id="pricing"`.

`#about`, `#clients` and `#testimonials` were **deliberately not added**, at the owner's
decision: ten desktop links in a `flexWrap` bar wrap onto a second row around 768–900 px —
which would grow the very header height item 7 just made dynamic — and all three sections
are passed while scrolling anyway. They stay reachable by hash.

⚠️ **Adding the 7th link wrapped the header at 768 px** — caught only by adding a check for
it. At `gap: 22` / `fontSize: 15` the bar needs ~467 px of nav against ~425 px available at
768 px, so it wrapped onto a second row: header **121 px** instead of 73. That is worse than
the missing link, because every section uses `scrollMarginTop: 80`, so a 121 px header puts
every anchor target back *under* the header — the exact defect item 7 had just closed.

Note the ordinary overflow and `--header-h` checks **cannot see this**: the page still has
no horizontal overflow, and `--header-h` still equals the (now doubled) header height, so
both pass. It needs its own assertion, comparing the bar height against its tallest child.

Fixed by tapering the nav in `Header.jsx`: `gap: 'clamp(12px, 1.8vw, 22px)'` and
`fontSize: 'clamp(13px, 1.15vw, 15px)'`. Both clamps sit at their maximum from ~1300 px up,
so the desktop appearance is unchanged; only 768–1300 px tightens.

Re-measured: `header nav a[href="#pricing"]` present with non-empty text in `en` / `fr` /
`ar`, and the header is a single row at **768 / 820 / 900 / 1024 / 1280 / 1440** px in all
three languages (73 px, never 121).

<details><summary>original finding</summary>

`src/components/Header.jsx:7` lists `services, process, work, team, faq, contact`.
`#pricing`, `#about`, `#clients` and `#testimonials` all render but are unreachable from
the header. Pricing especially — it is the first thing a non-technical buyer looks for.

</details>

### 14. "Show less" is hardcoded English (from code) — ✅ ALREADY FIXED (verified 2026-07-29)

**No code change needed.** Verified in the source rather than trusted from the closing
note: `Work.jsx:350` renders `{t('workCtaLess')}`, and the key exists in all three locale
files at `en/fr/ar.json:63` — `Show less` / `Voir moins` / `عرض أقل`. Fixed by the
case-study work that landed after this audit was written.

### 15. Focus ring is the UA default only (measured) — ✅ RESOLVED

Two separate problems; both fixed.

**Focus ring.** `.focus-ring:focus-visible` existed but was applied to only 6 elements, all
in `Work.jsx` / `CaseStudy.jsx`. It is now on every interactive element on the page —
`Header` (logo, 7 desktop links, theme toggle, burger, 7 mobile links), `LanguageSwitcher`
(trigger + 3 options), `Hero` (CTA, scroll-down), `CtaBanner`, `Contact` (4 links, 3 form
fields, submit), `Footer`, `BackToTop`, `Faq` (accordion triggers).

A second class, `.focus-ring-inset`, was added for controls inside an `overflow: hidden`
container, where the 4 px offset ring would be clipped: the language dropdown options and
the FAQ accordion rows.

**Skip link.** Did not exist. `App.jsx` now renders `<a href="#main" class="skip-link">` as
the first child — the first tab stop on the page — and `<main>` gained `id="main"` and
`tabIndex={-1}` so focus actually lands there rather than only the scroll position moving.
`.skip-link` lives in `index.css` (positioned off-screen until `:focus`, never
`display: none`, which would make it unfocusable). Its own ring is `--fg`, not `--accent`,
because the accent ring would be invisible on the link's accent background. `main:focus`
outline is suppressed so the skip does not draw a box around the whole page. New i18n key
`skipToContent` in all three locales.

Re-measured in **dark** theme, where the UA default was worst: first `Tab` focuses
`a[href="#main"]`, it becomes visible (`x = 0`, was off-screen), its ring computes to
`rgb(243, 239, 232)`; the next stop (logo) rings `rgb(51, 172, 156)` = `--accent`, replacing
the old `rgb(16, 16, 16) auto 1px`. Pressing Enter moves `document.activeElement` to `main`.

<details><summary>original finding</summary>

First tab stop in dark theme reports `outline: rgb(16, 16, 16) auto 1px` — near-invisible
against the `#131210` background. There is also no skip-to-content link. `src/index.css`
is the right place for `:focus-visible`, and it does not touch the design.

</details>

### 16. Eight touch targets under 44 px (measured) — ✅ RESOLVED

Two different fixes, because standalone buttons and inline text links cannot be treated the
same way.

**Standalone controls** — grown directly:

| control | before | after |
|---|---|---|
| theme toggle (`Header.jsx`) | 38 × 38 | 44 × 44 |
| language button (`LanguageSwitcher.jsx`) | 44 × 38 | 44 × 44 |
| language dropdown options | ~44 × 33 | ≥ 44 × 44 (`padding: '12px 14px'`) |
| footer mail link (`Footer.jsx`) | ~21 tall | `minHeight: 44` (it is a flex item, so this is layout-safe) |

The header consequently grows 67 → 73 px on desktop. That is **only safe because item 7
landed first** — every consumer now reads the measured `--header-h`, so nothing had to be
re-tuned. This is the reason for the ordering.

**Inline links inside a sentence** (`Contact` mail + WhatsApp, `Contact` error-state mail +
WhatsApp, `CtaBanner`) — these cannot be made block-level without moving the text around
them. They use `padding` plus a matching negative `marginInline` instead: on an *inline*
element, padding grows the hit box while the negative margin cancels the layout shift, so
the rendered sentence is byte-identical while the tap target reaches 44 px.

Two things this only caught in the browser, not from the code:

- `padding: '10px 0'` gives **40 px**, not 44 — an inline box is sized by the glyph box
  (~20 px at 16 px font), not by `line-height`. It needs 12 px.
- **Width matters too.** The Arabic WhatsApp label is short: 35 px wide with vertical-only
  padding, and 43 px at 14 px font in the error block. Horizontal padding (6 px) is what
  clears 44, which is why the negative `marginInline` is needed.
- **The two error-state links could not use this trick.** Side by side across a `·`
  separator only ~10 px wide, two boxes each grown 8 px per side **overlapped by 5 px** —
  measured — so a tap near the boundary hits the wrong link. Growing them apart is not
  possible in that space, so they were **stacked one per row** instead, which also reads
  better at 320 px. Once stacked they need no inline trickery at all:
  `display: inline-flex` + `minHeight: 44` + `minWidth: 44`.

The Contact paragraph gap was widened 12 → 20 px so the two enlarged hit boxes meet rather
than overlap; the footer's vertical padding dropped 32 → 22 px so the taller link row keeps
the footer at roughly its previous height.

Re-measured at 320 / 375 / 768 / 1440 × `en`/`fr`/`ar`: every listed control is ≥ 44 × 44,
and the two Contact links do not overlap. "View all projects" and "Show less" measured
≥ 44 already at `padding: '12px 26px'` — they were listed in the original finding but were
not actually offenders.

<details><summary>original finding</summary>

Counted at 375 px in `ar` (the count shifts slightly per language, since label width
changes): language button 44 × 38, theme toggle 38 × 38, "View all projects" 143 × 42,
the CTA banner link (75 × 23), both `hello@cuvatex.com` links (~20 px tall) and the
WhatsApp link (35 × 20).

</details>

### 31. Services cards spill over the Clients section at any width under 950 px (measured) — ✅ RESOLVED

**Reported from the browser, not caught by the sweep.** In a half-width window the last
service card's text printed *on top of* the "CLIENTS" heading — several lines stacked over
each other.

Cause: each card is pinned at `height: calc(100dvh - header - title)`. That only holds while
the image and the text sit **side by side**. Below 950 px they wrap into a column and the
content becomes ~950 px tall, which does not fit in any viewport-derived height. The card
has a background but no `overflow`, so the excess simply painted over the next section.

Measured before the fix — worst card content vs its own box:

| viewport | card | content | overflow |
|---|---|---|---|
| 375 × 700 | 538 | 603 | **+65 px** |
| 700 × 850 | 665 | 801 | **+136 px** |
| 768 × 900 | 711 | 850 | **+139 px** |
| 900 × 800 | 604 | 950 | **+345 px** |
| 950 × 700 | 502 | 310 | ok |
| 1440 × 900 | 697 | 416 | ok |

So this was **not** a narrow-window edge case — it was broken on every phone, tablet and
small laptop, and only correct at desktop width. The break is sharp between 900 and 950 px,
which is where the two columns stop fitting.

**Fixed in `src/components/Services.jsx`** in two parts:

1. **Below 950 px the sticky stack is dropped entirely** (`STACK_QUERY`, `useIsStacked`).
   The scope wrapper, the title and the cards all switch to `position: static` /
   `height: auto`, so the section renders as an ordinary stacked list and the content
   decides its own height. There is no card height that could have worked, so the mechanism
   itself had to go at that size.
2. **A measured floor under `cardSpace`** for the widths that keep the stack. A short window
   produced the same defect at desktop width — 1440 × 600 gave a 397 px card holding 416 px
   of content. `cardSpace` is now
   `max(calc(100dvh - navH - titleH), tallestContent + 64px)`, with `tallestContent` from a
   `ResizeObserver` over every card's inner box (`useMaxContentHeight`). Measured, not a
   constant, because it moves with language, font swap and width.

Re-verified at **18 viewport sizes × 3 languages**, deliberately including short windows
(950 × 600, 1024 × 600, 1200 × 560, 1440 × 600): no card is shorter than its content, and
`#services`' bottom edge never crosses `#clients`' top edge.

### 32. The Clients marquee runs the wrong way in Arabic (measured) — ✅ RESOLVED

In RTL the strip left a growing empty band on the right of the row while the cards bunched
at the left. Measured at 1440/ar: **199 px** of empty row, and the first card clipped.

Cause: the strip is a flex row with `width: max-content`, so in RTL it is laid out from the
right edge leftwards. The single `marquee` keyframe translates **negatively** regardless, so
in RTL it walks the strip off the left and uncovers the right.

Fixed in `src/index.css` with a mirrored keyframe plus a direction-scoped override:

```css
@keyframes marquee-rtl { 0% { transform: translateX(0%); } 100% { transform: translateX(50%); } }
[dir='rtl'] .marquee { animation-name: marquee-rtl; }
```

⚠️ The `animation` shorthand also had to move **out of the inline style** in `Clients.jsx`
and into the `.marquee` class. An inline `animation` outranks any stylesheet rule, so
neither this RTL override nor the item 12 reduced-motion `animation: none` could ever have
taken effect from there — the reduced-motion rule only worked because it carried
`!important`.

Re-measured at 375 / 768 / 1440 in both directions: correct keyframe selected, and the strip
covers the full row with no gap on either side.

### 33. "40+" paints as "+40" in Arabic (measured) — ✅ RESOLVED

The stats read `+40`, `+4`, `+30` on the Arabic page. The DOM text was always correct
(`"40+"`); the bidi algorithm moves a trailing neutral character like `+` to the other side
inside an RTL paragraph.

Fixed on the number span in `Clients.jsx` with `direction: 'ltr'` + `unicodeBidi: 'isolate'`,
which pins the number and its sign as one left-to-right run without affecting the Arabic
label under it. Re-verified: renders `40+` / `4+` / `30+` / `98%` in Arabic.

---

## P2 — code and repo quality, no user impact yet

### 17. `HeroIllustration.jsx` is 691 lines of dead code — ✅ RESOLVED 2026-08-09

Never imported anywhere (`grep` finds only its own `export default`). It is the single
largest source file in the project.

**Fixed in the 2026-08-09 refactor.** File deleted. Re-verified before deleting that nothing
imports it. Note for expectations: the bundle only moved 507.75 kB → 507.66 kB, because the
file was already being tree-shaken out and never reached visitors. The win is maintenance,
not payload.

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

### 20. Duplicate `id="top"` (measured) — ✅ RESOLVED 2026-08-09

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

### 23. Breakpoint mismatch at exactly 768 px (measured) — ✅ RESOLVED 2026-08-09

`Header.jsx:11` uses `max-width: 767px`; `Process.jsx:9` and `Work.jsx:14` use
`max-width: 768px`. At exactly 768 px you get the desktop nav together with the mobile
Process layout (measured: `desktopNav=true, hamburger=false, processGrid="691.219px"`,
i.e. one column and no sticky visual panel). Harmless today, but the two numbers should
come from one place.

**Fixed in the 2026-08-09 refactor.** `Process` and `Work` moved to `max-width: 767px`, so
all three read the same rule. Both now go through the shared `useMediaQuery` hook, though the
query deliberately stays at the call site — `Services` uses `949px` for a different reason
(its sticky stack) and must not be swept into the same constant.

Verified by driving the real page at 766 / 767 / 768 / 769 px and asserting that the burger
and the desktop nav are never both present, and that the Work card count matches the same
side of the breakpoint:

```
width  burgerVisible  desktopNav  workCards   verdict
766    true           false       3           OK
767    true           false       3           OK
768    false          true        6           OK
769    false          true        6           OK
```

This is the one refactor change with a deliberate visual diff: at exactly 768 px the page
grows (en: 15589 → 16624 px tall) because Work now shows 6 cards instead of 3. 390 px and
1440 px are pixel-identical to before.

### 24. Services measures its title height once and never re-measures on content change (from code) — ✅ RESOLVED

**Fixed by removing the mechanism, not the bug.** `Services.jsx` is a homepage teaser now
(3 cards, `Section` + `SectionHeader`, no sticky stack) — the full 6-service detail moved to
`/services` (`src/pages/ServicesList.jsx`), which is natural-height, not sticky. There is no
`titleRef`, no measured height, and no card `top`/`height` derived from one anymore, so this
class of bug has nothing left to happen to.

<details><summary>original finding</summary>

`Services.jsx:25-32` reads `titleRef.getBoundingClientRect().height` on mount and on
`window.resize`. Neither the web-font swap (IBM Plex arrives async from Google Fonts) nor a
runtime language change re-triggers it, and every card `top` / `height` in the sticky stack
is derived from that one number. Did not reproduce at 900 px — the en and ar titles are both
147 px there — but any width where the translated heading wraps differently will offset the
whole stack. A `ResizeObserver` on the title removes the whole class of problem.

</details>

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

### 29. Stats-row divider can land at a wrapped row edge (cosmetic, from code) — ✅ RESOLVED

**Fixed in `src/components/Clients.jsx`**, alongside item 4's 2026-08-22 pass. The
divider is now gated on `!isMobile` — it renders on the ≥768 px row (which never
wraps) and is dropped entirely below that breakpoint, where the row wraps and a
divider can no longer promise to land next to its own stat. Confirmed in the browser
at 390 px in `en`, `fr` (which wraps its longer labels into an uneven 2+1+1 before
this fix, stranding two dividers) and `ar` — no dangling hairline in any of them.

<details><summary>original finding</summary>

Introduced by the item 3 fix. The 1 px dividers between stats are separate elements, so when
the row wraps on a narrow phone one can end up at the end of a row with nothing after it. It
is a hairline and easy to miss; removing the dividers entirely, or switching the row to a
`repeat(auto-fit, minmax(...))` grid, would clear it.

</details>

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

## P1 responsive sweep — 2026-07-29

The P1 block had no whole-page responsive check of its own (the audit's responsive work
lived in P0), and the case-study overlay had never been responsive-tested at all. Run
against the **production preview build** — `vite build` + `vite preview`, not `vite dev`,
because dev injects CSS through JS and would have given a false reading on the item 8
first-paint test.

Playwright is present in `node_modules` but **not declared in `package.json`**, so the
scripts were kept outside the repo (scratchpad) — no new dependency, no `tests/` directory,
no `playwright.config.js` added to a shared two-person repo. Re-running means re-writing
them; the matrix below is the spec.

**Matrix:** 320 / 375 / 414 / 768 / 1024 / 1440 px × `en-US` / `fr-DZ` / `ar-DZ` ×
light / dark = 36 cells, plus targeted passes. **634 checks, all pass.**

> **Round 2, same day.** Three further defects (items **31, 32, 33**) were reported from an
> ordinary browser session and were **not** caught by any of the checks above. Two lessons
> that changed the matrix:
>
> - **The width grid had a hole.** It jumped 768 → 1024, and the Services break sits at
>   **950 px**. A defect that only exists between two sampled widths is invisible.
> - **Viewport *height* was never varied** — every cell used 900 px. Item 31's desktop half
>   needed a short window (1440 × 600) to show up.
>
> The item 31 checks therefore sweep **18 width × height pairs**, including deliberately
> short windows, and assert section-to-section overlap rather than only page overflow.

Per cell (36 × 8 = 288):
- `documentElement.scrollWidth <= innerWidth` — no sideways scroll
- no element wider than the viewport **unless a clipping ancestor contains it**. The naive
  version of this check fails everywhere: the Clients marquee track is legitimately
  2 980 px wide inside a 335 px `overflow: hidden` box. The check walks ancestors.
- `--header-h` matches the live header height within 1 px (item 7)
- `body` background matches the requested theme exactly (item 8)
- `documentElement.dir` matches the locale (item 2 regression guard)
- theme toggle / language button / footer mail / hero CTA all ≥ 44 × 44 (item 16)
- zero console errors and zero page errors

Targeted passes:
- **First paint (item 8)** — app bundle aborted so only the inline `<head>` script has run;
  dark + RTL + `lang=ar` all correct before any React code executes
- **Reduced motion (item 12)** — marquee, orb and showcase sampled 4.5 s apart, all static;
  `scroll-behavior: auto`
- **Keyboard (item 15)** — first tab stop is the skip link, it becomes visible, its ring and
  the next control's accent ring both render in dark theme, Enter moves focus to `main`
- **Nav (item 13)** — `#pricing` link present with translated text in all three languages
- **Orb (item 10)** — centre within 60 px of the viewport centre at 1440 (actual: exact)
- **Case-study overlay** — opened at 320 / 375 / 768 / 1440 × 3 languages: no horizontal
  overflow, no console errors
- **Sticky title (item 7)** — Services title lands 0 px from the header bottom at
  320 / 375 / 768 / 1440 × 3 languages
- **Error state (items 9 + 16)** — web3forms mocked to `{success:false}`: alert computes to
  `rgb(179, 38, 30)`, both fallback links render and both are ≥ 44 × 44 in all 3 languages
- **Contact link overlap** — the two enlarged inline hit boxes meet without overlapping

Later additions, after a review pointed out that the checks above are all blind to them —
each of the three found a real defect:

- **Header must stay one row** at 768 / 820 / 900 / 1024 / 1280 / 1440 × 3 languages,
  asserted by comparing the bar height to its tallest child. *Neither* the overflow check
  nor the `--header-h` check can detect a wrapped header. → found the 768 px wrap under
  item 13.
- **Mobile nav must actually scroll** — open the burger, click a panel link, assert
  `scrollY > 100`, correct hash, panel closed, heading clears the header. Run with and
  without `prefers-reduced-motion`. → found item 1 still broken, including at `7073d6c`.
- **Error-state links must not overlap**, on whichever axis they are laid out. → found the
  5 px overlap under item 16.

Run with `picsum.photos` **reachable**: item 5 is deliberately still open, and blocking it
would have flooded the results with broken-image noise unrelated to this pass.

**Five defects were found by the sweep and fixed rather than waived**, none of them visible
from reading the code: the 40 px inline links, the 35 px / 43 px Arabic WhatsApp labels, the
5 px error-link overlap (all item 16), the 768 px header wrap (item 13), and item 1 —
which the previous pass had recorded as resolved.

Two lessons worth keeping:

1. **Verify against `vite preview`, not `vite dev`.** Item 1's false "RESOLVED" is what that
   difference costs.
2. **A check that passes in both states is not a check.** `--header-h` matching the header
   height stays true when the header doubles in height. Assert the property you actually
   care about.

---

## Checked and clean

Re-verified against this commit, not carried over:

- **The header does not wrap** — re-measured 2026-07-29 after the 7th nav link and the
  44 px controls landed: a single row at 320 / 375 / 414 / 768 / 820 / 900 / 1024 / 1280 /
  1440 in all three languages (73 px throughout). It *did* wrap at 768 px in between; see
  item 13.
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

**P0 and P1 are both closed.** Done: 1 (re-fixed), 2, 3, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16.
Closed won't-fix: 11. Still open from P0: 5 — an owner decision, not code. Item 4
is fully resolved as of 2026-08-22.

Item 1's false "RESOLVED" raised the question of whether the other P0 re-measurements hold.
Three of the four were incidentally re-covered by this pass's sweep, against `vite preview`:

- **Item 2** — `dir` asserted per locale with region-coded `ar-DZ` / `fr-DZ` / `en-US`
  across all 36 cells. Holds.
- **Item 3** — horizontal overflow asserted at 320 and 375 in all three languages. Holds.
- **Item 6** — both branches re-verified. `{success:false}`: fallback links render, alert is
  red. **Empty `VITE_WEB3FORMS_KEY`** (separate build): **0** requests reach web3forms, the
  error state appears immediately, both fallback links render at 44 px tall, and the console
  carries the misconfiguration message naming both fixes. Holds.

So item 1 was the only false "RESOLVED". No P0 claim is now resting on an unverified
measurement.

What is left, in order:

1. **Item 5** — ship local placeholder assets. Reverted once by choice; still the single
   biggest runtime dependency on a third party, and it covers the case-study overlay too.
2. **Item 38** — the WhatsApp number. A one-liner in `src/lib/contact.js` once the real
   number exists, and the only thing still shipping a placeholder to visitors.
3. **Item 21 / 25** — payload and SEO. `whoWeAre.jpg` at 716 kB and the missing
   `robots.txt` / `sitemap.xml` / JSON-LD are the cheapest remaining wins.
4. **Item 22** — decide whether `.env` belongs in `.dockerignore` now that `--build-arg`
   works.
5. **Items 18, 19, 24, 26, 27, 28, 30, 39** — P2 cleanup, no user impact.

> **Updated 2026-08-09.** Items 17, 20 and 23 were resolved by the structural refactor and
> have been removed from this list rather than left prescribing finished work. Item 39 is
> new and deliberately deferred; item 40 was withdrawn after review. See the
> 2026-08-09 section above.

> The 2026-07-28 note about items 14, 19 and 15 has now been checked rather than trusted.
> **14 is genuinely fixed** (`t('workCtaLess')`, key in all three locales) and **19 is
> fixed** (per-slug `projects.<slug>` keys). **15 was only half true** — the
> `.focus-ring:focus-visible` rule existed but reached just 6 elements and there was no
> skip link; that gap is what the P1 pass closed.

---

## P2 — found during the structural refactor, 2026-08-09

Found while deduplicating components. The refactor itself was **structure only**: verified by
Playwright screenshots across 3 languages × 2 themes × 3 viewports plus the Contact form and
Header menu states, requiring a **zero-pixel diff** at every step. Items already listed above
were updated in place rather than re-reported — see 17, 20 and 23.

Two behaviour fixes did ship, in their own commits after the refactor commits, so that a
pixel change could always be attributed to a fix and never to a mistake: item 23 above and
item 35 below.

### 31–33 are taken by the 2026-07-29 responsive sweep. New items start at 34.

### 34. `getInitials` was defined twice with different behaviour — ✅ RESOLVED 2026-08-09

`Team.jsx:7` had `name.split(' ').map(n => n[0]).join('')`. `Testimonials.jsx:5` also
`.filter(Boolean)`, `.toUpperCase()` and `.slice(0, 2)`. Same name, same job, different
output for any lowercase name, any name with a double space, and any name of three or more
words — the two sections would have disagreed as soon as one was added.

Both produce identical output for the three names currently in the app (`Alex Morgan`,
`Sam Rivera`, `Jordan Lee` → `AM`, `SR`, `JL`), which is why nothing looked wrong. Merged
into `src/lib/text.js` on the stricter Testimonials version. Zero pixel diff, as expected.

### 35. Mobile first paint rendered the desktop layout for one frame — ✅ RESOLVED 2026-08-09

`Process.jsx:35` and `Work.jsx:15` initialised their media-query state as `useState(false)`
and corrected it in an effect. On a phone the first committed frame therefore used the
desktop branch — for Work that is 6 cards where 3 belong — before snapping to the mobile
layout. `Header.jsx:13` and `Services.jsx:23` already read `matchMedia` synchronously in a
lazy initialiser and did not have the bug.

All four now share `src/hooks/useMediaQuery.js`, which reads the value synchronously. The
transient frame is not visible in a post-load screenshot, so this one is verified by
reading the code path rather than by the image diff.

### 36. `HeroShowcase` declared a `projects` const shadowing the real one — ✅ RESOLVED 2026-08-09

`HeroShowcase.jsx:4` exported nothing but declared `const projects` — the same name as the
real case-study registry exported from `src/data/projects.js` and imported under that name in
`Work.jsx` and `CaseStudy.jsx`. Nothing was broken; the hazard was that reading the two files
in sequence implied a relationship that does not exist. Renamed to `showcaseProjects`.

### 37. Services recomputed `isEven` inline — ✅ RESOLVED 2026-08-09

`Services.jsx:185` computed `const isEven = i % 2 === 0` and used it once at `:215`, while
`:196` recomputed `i % 2 === 0` inline for the background instead of reusing it. Reused.

### 38. WhatsApp link still ships an unresolved placeholder — ⏸ OPEN, needs the real number

`https://wa.me/PHONE_NUMBER_PLACEHOLDER` is live in three places now — `ContactPage.jsx`
(`/contact`, the direct link — moved here from the now-deleted `Contact.jsx`),
`ContactForm.jsx` (the error fallback, which is exactly where a visitor lands when the form
has already failed them), and `Footer.jsx` (the new footer's WhatsApp link, item 42). All are
marked with a `TODO(docs/AUDIT.md item 38)`.

Not fixable without the number. **This is a live defect on a shipped page, not code
tidiness** — it is listed under P2 only because it was found here.

### 39. Services re-measures a header height that Header already publishes — ✅ RESOLVED (overlapped item 24, same fix)

**Fixed the same way as item 24**: `Services.jsx` no longer has a sticky stack, so it no
longer needs the header's height for anything — no second `ResizeObserver`, no `useState(73)`
fourth copy of the fallback. It reads `var(--header-h, 73px)` nowhere at all now, same as
`Work.jsx`, the teaser it's modeled on.

<details><summary>original finding</summary>

`Services.jsx:88-101` runs its own `ResizeObserver` on `document.querySelector('header')` to
get a height that `Header.jsx` already measures and publishes as `--header-h`. Two observers,
one number, and Services keeps it in `useState(73)` — a fourth copy of the `73` fallback that
appears as `var(--header-h, 73px)` in Hero, Clients and Process.

**Deliberately not fixed** at the time this was written. Services' sticky card stack was
driven by JS arithmetic over that measurement, and the screenshot suite used for that
refactor captured at scroll 0, where the sticky behaviour does not appear. Changing it
without scroll-scripted coverage would have been a change nothing could verify. Same reason
`Services`, `Process`, `Work` and `CaseStudy` were not split internally at the time.

</details>

### 40. `console.error` in the production bundle — ⛔ CLOSED, WON'T FIX

Three calls, originally in `Contact.jsx`, now in `ContactPage.jsx` (`/contact`) since that
component moved there whole. Originally listed as cleanup for this
pass; **withdrawn after reading them.** The first reports a build with no
`VITE_WEB3FORMS_KEY`, which is otherwise an invisible misconfiguration that silently breaks
every form submission — the code comment above it says so explicitly. The other two report
why a submission failed. All three are deliberate operator-facing diagnostics on a form whose
failure mode is a lost lead. Removing them would make a real problem harder to find.

### 41. One `scrollIntoView` still ignores `prefers-reduced-motion` — ✅ FIXED

`CaseStudy.jsx:418` called `scrollIntoView({ behavior: 'smooth' })` with the behaviour
hardcoded. The other two call sites gate it — `Hero.jsx:14` and `MobileMenu.jsx:74` both used
`reduceMotion ? 'auto' : 'smooth'` — and `MotionConfig reducedMotion="user"` does not reach
`scrollIntoView` at all, so this one animated for a visitor who asked for no motion.

Same class as item 12, which closed the rest of them. Left open at the time because it was a
behaviour change inside `CaseStudy.jsx`, one of the four files the 2026-08-09 refactor
deliberately left alone — see item 39.

**Closed by the router change.** `CaseStudy.jsx` is gone: case studies are pages at
`/work/<slug>` now, and the call site was the "Start a project like this" button, which had
to `onClose()` and then wait out a 400 ms `setTimeout` before it could scroll the page
underneath. Contact is a page now too (`/contact`), so that button is a plain
`<Link to="/contact">` today — not even a hash link anymore. Every navigation scroll in the
app goes through `ScrollManager.jsx`, which gates on `useReducedMotion()` in one place —
`MobileMenu.jsx:74` is gone for the same reason. Two of the three call sites this item
compared therefore no longer exist; the "scroll to services" button in `Hero.jsx` is the
only hand-gated `scrollIntoView` left.

### 42. Footer phone number is an unresolved placeholder — ⏸ OPEN, needs the real number

The new footer (`src/components/Footer.jsx`, added alongside `/services`, `/about`,
`/contact`, `/terms` and `/privacy`) lists a phone number for the first time on this site.
`PHONE_DISPLAY`/`PHONE_URL` in `src/lib/contact.js` are placeholders (`+1 000 000 0000` /
`tel:+10000000000`), marked with a `TODO(docs/AUDIT.md item 42)` next to the existing
`WHATSAPP_URL` placeholder (item 38). Same fix, same file, same moment when the real number
exists — update both together.

### 43. Footer social links go nowhere — ⏸ OPEN, needs real accounts or removal

`Footer.jsx:22-27` — Instagram, LinkedIn, GitHub and X all point at the bare platform
homepage (`https://instagram.com/`, etc.), not a CUVATEX account. Four dead links, live on
every page. Found during the 2026-08-23 whole-project content review; owner confirmed none
of the accounts exist yet, so **not fixed** — same category as items 38/42. If the accounts
never get created, the honest fix is deleting the "Follow us" footer column rather than
shipping four links to nowhere.

### 44. The real domain is hardcoded as `cuvatex.com` in five places — ⏸ OPEN, needs the real domain

`index.html` (`<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, the JSON-LD
`url`/`logo`), `public/sitemap.xml` (every `<loc>`), and `public/robots.txt` (`Sitemap:`) all
hardcode `https://cuvatex.com/`. `index.html` already has two `<!-- NOTE: update to the real
deployed domain -->` comments flagging this, but the sitemap and robots files carry the same
value with no such note. If the real domain differs, WhatsApp/LinkedIn/Facebook link previews
(`og:image`) and the sitemap Google actually crawls both point at the wrong site. Found during
the 2026-08-23 whole-project content review; **not fixed** — no domain confirmed yet.

### 2026-08-23 — Legal placeholder notice removed from `/terms` and `/privacy`

The bordered "This page is a placeholder. It has not been reviewed by a lawyer yet" callout
(`legal.placeholderNotice`, rendered by `LegalPage.jsx`) was removed at the owner's request —
the pages read as finished now. This was a deliberate content decision, not a bug fix: the
Terms and Privacy text itself was already accurate (Privacy correctly names Web3Forms and
Umami; Terms' one previously-vague clause, Governing Law, was fixed in the same pass to name
Algeria explicitly instead of "still to be decided"). No open item tracks this — it is not a
defect, just a record of the change for anyone who finds the old screenshots.
