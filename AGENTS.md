# AGENTS.md

Guidance for AI coding agents working in this repository (Claude Code, Cursor, Copilot,
Codex, Gemini CLI, …). Humans should start with [`README.md`](README.md).

This is the single source of truth for agent instructions. `CLAUDE.md` imports this file,
so **edit this file, not `CLAUDE.md`** — otherwise the two agents in this repo drift apart.

## Commands

**Package manager is pnpm** — the Docker build runs `pnpm install --frozen-lockfile` against `pnpm-lock.yaml`, so pnpm is canonical. `package-lock.json` from npm is gitignored to avoid resolution drift between contributors. npm works locally in a pinch but do not commit its lockfile.

```bash
pnpm install        # install deps
pnpm dev            # Vite dev server + hot reload → http://localhost:5173
pnpm build          # production build → dist/
pnpm preview        # serve the production build locally
pnpm lint           # oxlint over source
```

Docker: `docker compose up` (dev, hot reload). Production image: `docker build --target prod -t cuvatex .` then `docker run -p 8080:80 cuvatex` (multi-stage build → nginx).

There is no test suite.

## Architecture

Marketing/portfolio site. React 19 + Vite 8 + `react-router` (v8, `BrowserRouter`).

`App.jsx` is the shell only — skip link, `Header`, `<main>`, `Routes`, `Footer`, `BackToTop`,
`ScrollManager`. Nine routes, all in `src/pages/`:

| Route | Page | What it is |
|-------|------|-----------|
| `/` | `Home.jsx` | The long sales page: `Hero`, `Services`, `Clients`, `Process`, `Work`, `Testimonials`, `CtaBanner`, `About`, `Team`, `Faq`, `Pricing` |
| `/services` | `ServicesList.jsx` | All 6 services, full detail |
| `/work` | `WorkList.jsx` | Every project, one `ProjectCard` each |
| `/work/:slug` | `Project.jsx` | One case study |
| `/about` | `AboutPage.jsx` | The full About story |
| `/contact` | `ContactPage.jsx` | The contact form and direct links |
| `/terms` | `Terms.jsx` | Terms of Service (placeholder text — see `src/i18n/en.json`'s `legal` key) |
| `/privacy` | `Privacy.jsx` | Privacy Policy (same placeholder caveat) |
| `*` | `NotFound.jsx` | 404 |

The homepage `Work`, `Services` and `About` sections are **teasers** — a short version
plus a link to the full page (`/work`, `/services`, `/about`). Contact has no homepage
teaser at all: the mid-page `CtaBanner` already covers that job, so a second "talk to us"
moment would just repeat it. Case studies used to be a `#case/<slug>` overlay driven by a
hand-written `useCaseRoute` hook; both are gone.

Because there are real paths now, the prod image needs an SPA fallback or `/work/<slug>`
404s on reload — that is what `nginx.conf` is for. Do not delete it.

Three cross-cutting systems drive almost every component. Understand them before editing:

### 1. Content lives in i18n JSON, never in JSX
All user-facing text is in `src/i18n/{en,fr,ar}.json` and read via `t('key')`. Repeating content (services list, process steps) is stored as **arrays** in the JSON and pulled with `t('services', { returnObjects: true })`, then mapped. To add or change any copy: edit **all three** locale files with the **same key structure** — a key present in one but missing in another silently falls back to English. Do not hardcode strings in components.

### 2. Theming via CSS custom properties, defined in CSS
The token **values** live in `src/index.css` under `:root` (light) and `:root[data-theme='dark']` (dark): `--bg`, `--surface`, `--fg`, `--muted`, `--line`, `--accent`, `--accent-fg`, `--bg-header`, `--scrim`, `--danger`. `src/theme/ThemeContext.jsx` owns the *choice* only — it writes `data-theme` on `document.documentElement` and persists to `localStorage` under `studio-theme`. Components are styled with **inline `style` objects** (no CSS framework, no CSS modules) that reference `var(--token, fallback)`. Rules:
- Never hardcode a color — use `var(--token)`.
- Adding a new color token means adding it to **both** blocks in `index.css`, or theme switching breaks.
- Read/toggle theme via the `useTheme()` hook (throws if used outside `ThemeProvider`).
- The colors are in CSS, not JS, so the blocking inline script in `index.html` can set the theme (and `dir`/`lang`) **before first paint** by setting one attribute — that is what stops the white flash on dark-mode return visits. Do not move tokens back into JS, and do not make that script `defer`/`module`.

### 2b. Header height is measured, not hardcoded
`Header.jsx` publishes its real height to `--header-h` via a `ResizeObserver`. Use `var(--header-h, 73px)` for **fold heights** — `Hero`, `Clients` and `NotFound` subtract it from `100dvh`. Never hardcode a header height — it changes with viewport and with control sizes.

Do **not** use it as top padding on a page: the header is `position: sticky`, so it already takes layout space, and the padding would add a dead gap. Anchor targets are handled by `scrollMarginTop` in `Section.jsx`.

**The header is the only sticky element on any page, and it should stay that way.** A project page briefly had a second sticky bar under it; on a 664px phone viewport the two together froze ~140px — better than one pixel in six — for the whole length of a long read, in exchange for a control that phone users reach by swiping back anyway. `Project.jsx` now repeats its "All projects" link at the foot of the article instead.

### 2c. Motion respects `prefers-reduced-motion`
`main.jsx` wraps the app in `<MotionConfig reducedMotion="user">`, which handles most Framer animations. It does **not** cover: opacity-only animations, `setInterval`-driven content swaps, CSS `@keyframes`, or `scrollIntoView({behavior:'smooth'})`. Those are gated by hand — see `Hero.jsx`, `HeroShowcase.jsx`, the media query in `index.css`, and the `scrollIntoView` in `ScrollManager.jsx`. New animations of those four kinds need the same treatment. (The ungated `scrollIntoView` that used to live in `CaseStudy.jsx` — `docs/AUDIT.md` item 41 — went with the overlay.)

### 2c-bis. `ScrollManager` owns scroll and focus on navigation
`src/components/ScrollManager.jsx` renders nothing and sits inside `BrowserRouter`. React Router does neither of these jobs itself, so every one of them lives in that one file:
- **Back / Forward (`POP`) → hands off.** The browser restores the offset. Scrolling here would throw a visitor returning from a project page to the top of the homepage instead of the Work section they clicked from.
- **Hash in the URL → `scrollIntoView`**, gated on reduced motion. Also runs on first paint, where the browser's own attempt at `/#pricing` found nothing rendered yet.
- **No hash → `scrollTo({ behavior: 'instant' })`.** Explicitly `instant`, not a temporary inline `scroll-behavior` override: two-argument `scrollTo(0, 0)` reads the *computed* value and can still pick up `html { scroll-behavior: smooth }` from `index.css` and animate.
- **Focus → `<main>`** on a real page change, or a keyboard user's next Tab restarts from the top of the document.

**It must stay a `useLayoutEffect`.** That runs after React commits the new page but before the browser paints it, so nothing is ever painted at the *previous* page's scroll offset. With a `useEffect` + `requestAnimationFrame` — one frame later — two things broke, and both are easy to reintroduce:
1. Clicking a project card from the bottom of the homepage rendered the case study at y=2635 and visibly slid up to 0.
2. `useInView({ once: true })` latches during that same frame. The metric counters in `Project.jsx` sit ~1000px down, so they counted themselves up while the page flew past and read as already finished when the reader arrived.

Do not re-add per-link scroll handlers. `MobileMenu.jsx` used to have one; it is gone.

### 2d. Shared building blocks
These exist so the same thing is not written twice. Reach for them before writing a new one:

| Module | What it owns |
|--------|-------------|
| `src/components/ui/Section.jsx` | The `<section>` + centred 1160px container shell. Used by About, Faq, Pricing, Team, Testimonials, Work, Services. **Not** by Clients, Process, Hero, or any standalone page (`WorkList`, `ServicesList`, `AboutPage`, `ContactPage`, `Terms`, `Privacy`, `Project`, `NotFound`) — each of those has its own layout contract, documented in the file. |
| `src/components/ui/SectionHeader.jsx` | The eyebrow + accent dot + `<h2>` pair. The body paragraph that follows stays at the call site; it varies too much to share. |
| `src/components/ProjectCard.jsx` | One project card, used by the homepage teaser (`Work.jsx`) and by `/work` (`WorkList.jsx`). Any change to a card goes here, or the two pages drift. |
| `src/components/ServiceCard.jsx` | One alternating photo/text row, used by the homepage teaser (`Services.jsx`, 3 of them) and by `/services` (`ServicesList.jsx`, all 6, `detailed` adds the badge/tags/feature list). Deliberately *not* a card grid like `ProjectCard` — that shape sits one section above it on the homepage, and copying it read as the same section twice. |
| `src/components/ServiceDivider.jsx` | The hairline between two `ServiceCard` rows. Draws in from the side the next row's photo lands on, accent-coloured at that end — echoes the row alternation instead of being a static rule. |
| `src/components/ui/LegalPage.jsx` | Shared shell for `/terms` and `/privacy` — eyebrow, `<h1>`, a visible placeholder-notice callout, then `{heading, body}` sections laid out like `Project.jsx`'s `Block`. Both pages are ~15-line wrappers passing `legal.*` i18n data in. |
| `src/components/ScrollManager.jsx` | Scroll and focus on navigation — see 2c-bis. |
| `src/hooks/useMediaQuery.js` | All media queries. The query string is passed in, because the breakpoints are different rules, not copies: `767px` collapses the nav and switches the Work and Process layouts, `560px` shortens the case-study hero, and `(hover: none)` — a capability, not a width — decides whether a card's label rests visible. |
| `src/components/CtaBanner.jsx` | The "Have a project in mind? / Let's talk" strip, targeting `/contact`. Mid-homepage, at the foot of `/work`, and at the foot of `/services`/`/about` — reused wherever a page ends and the next natural action is "get in touch." |
| `src/lib/` | Pure helpers with no React in them: `motion.js` (the `EASE` curve), `text.js` (`getInitials`, `dirArrow`), `contact.js` (`WHATSAPP_URL`, `PHONE_URL`/`PHONE_DISPLAY` — all three still placeholders, see `docs/AUDIT.md` items 38 and 42), `nav.js` (`isCurrentSection`, shared by the desktop nav and the mobile panel so the two cannot disagree). |

`Section` and `SectionHeader` take **no default prop values**. Every difference between sections — padding max, background, title measure — is passed explicitly, so a forgotten prop breaks loudly instead of silently snapping one section onto another's spacing.

Every standalone page (`WorkList`, `ServicesList`, `AboutPage`, `ContactPage`, `Terms`,
`Privacy`, `Project`, `NotFound`) writes its own shell rather than using `Section`:
`Section` always draws a top border, and each of these is the first thing under the
header, where that border would sit against the header's own and read as one 2px rule.
Each also carries an `<h1>`, not `SectionHeader`'s `<h2>` — on a standalone page the
content *is* the page, not a section inside a longer one.

### 2e. Two files are deliberately not split
`Process` and `Project` are the largest components and stay that way on purpose. `Process` computes layout from measured scroll positions — its scroll-driven step activation. Adding or moving a wrapper element shifts that maths silently, and a screenshot taken at scroll 0 will not catch it. (`Services` used to be a third exception here, for a sticky scroll-stack it no longer has — the homepage version is a plain teaser now, and the full detail lives on `/services` instead.)

`Project.jsx` is different: it is long because a case study has many optional blocks, not because of scroll maths. The `layoutId` shared-element transition that used to couple `Work` and `CaseStudy` went away with the overlay, so `Work` is now small and splitting `Project` is a normal refactor rather than a risky one.

**Every block in `Project.jsx` renders only when its data exists** (`hasBody`, `metrics.length > 0`, `shots > 0`, and `Meta` / `Block` returning `null`). Five of eight projects are still one-liners with `shots: 0`; a stub must produce a short page, not a long one full of empty headings. Keep that rule when adding a block.

### 3. Trilingual with RTL (en / fr / ar)
`ar` is right-to-left. `dir` on `<html>` is set to `rtl` for Arabic in two places — `App.jsx` (on language change) and `LanguageSwitcher.jsx` (on manual switch) — keep them consistent. The duplication is logged as `docs/AUDIT.md` item 30. Because of RTL, use **logical CSS properties** (`marginInlineEnd`, `paddingInlineStart`, ...) instead of physical `left`/`right`. The Arabic font (`IBM Plex Sans Arabic`) is loaded in `index.html`.

### Other conventions
- **Scroll animations:** wrap content in `<ScrollReveal>` (`src/components/ScrollReveal.jsx`) — a Framer Motion `whileInView` fade-up, `once: true`. Reuse it rather than writing new motion variants per section.
- **Nav:** the `sections` array in `Header.jsx` is a list of `{ key, to }` and drives both the desktop nav and the mobile panel (`MobileMenu.jsx`, which receives it as a prop — `Header.jsx` stays the single source). Pages only, four entries (`services`, `work`, `about`, `contact`) — no hash links left at all. Process, Pricing, Team and FAQ stay on the homepage as sections but are not linked here; a visitor finds them by scrolling. Terms/Privacy are footer-only, not in this array. Each entry needs a `nav.<key>` label in all three locale files. Change one, change all three.

  The current page is marked with `aria-current="page"` plus accent colour — an underline on desktop, the eyebrow square on mobile. Colour alone would be invisible to a screen reader and to anyone who cannot separate the two greens. `isCurrentSection` (`src/lib/nav.js`) decides; a case study still marks "Work" — the reader is inside that part of the site.
- **Links:** use `<Link>` from `react-router` for anything that leaves the current page. Plain `<a href="#…">` is fine only for a same-page jump to a target that exists on every page the browser can render without a route change (`#top` in `BackToTop` — the `#top` div lives in `App.jsx`'s shell, so it is present on every route — and `#main` in the skip link). A hash target that only exists on the homepage (like the old `#contact`) needs `<Link to="/contact">`, not a bare anchor, or it silently does nothing from any other route. A `<Link>` that needs Framer variants must be wrapped with `motion.create(Link)` **at module scope**; calling it inside the component remounts the link on every render. And because `index.css` styles bare `a` with `--accent`, any link wrapping non-link content needs `color: 'inherit'` and `textDecoration: 'none'`.
- **Accessibility:** every interactive element carries `className="focus-ring"` (or `focus-ring-inset` inside an `overflow: hidden` container). Both rules live in `index.css`, since inline styles cannot express `:focus-visible`. New buttons and links need one of them.
- `src/index.css` is only a reset + base `html/body` typography; all component styling is inline.
- **Analytics:** `src/analytics.js` loads Umami (`VITE_UMAMI_SCRIPT_URL`, `VITE_UMAMI_WEBSITE_ID`) from `main.jsx`, and only in production builds. Record conversions with `track('event_name')` — it no-ops when the tracker is absent.

## Collaboration and git

Two-person repo. `main` is a protected shared branch — work on a personal branch, never
commit directly to `main`, and land every change through a PR. Do not commit or push
without the repo owner asking for it in that moment.

`ContactPage.jsx` (`/contact`) POSTs to web3forms (`VITE_WEB3FORMS_KEY`, passed to the
Docker build with `--build-arg`) and is the likely integration point if a real backend
replaces it.

## Where things live

| Path | What it is |
|------|-----------|
| `README.md` | Human-facing intro: stack, quick start, scripts |
| `AGENTS.md` | This file — instructions every AI agent reads |
| `CLAUDE.md` | Thin file that imports `AGENTS.md` for Claude Code |
| `docs/` | Long-form project documents (audits, notes, decisions) |
| `docs/AUDIT.md` | Accessibility / responsive / code-quality audit and its fix log. Items are numbered and referenced from code comments — keep the numbering stable |
| `src/pages/` | One file per route. Page-level layout lives here; `src/components/` stays reusable |
| `nginx.conf` | The prod server block. Without its `try_files … /index.html`, every route path 404s on reload |

Root markdown is limited to `README.md`, `AGENTS.md` and `CLAUDE.md`. Any **new long-form
markdown** — audit, plan, decision record, research note — goes in `docs/` and gets a row
in the table above. This rule is about markdown only; leave other root files alone.
