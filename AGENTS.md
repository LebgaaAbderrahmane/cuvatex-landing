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

Single-page marketing/portfolio site. React 19 + Vite 8. No router — `App.jsx` stacks section components (`Hero`, `Services`, `Clients`, `Process`, `Work`, `Testimonials`, `CtaBanner`, `About`, `Team`, `Faq`, `Pricing`, `Contact`), then `Footer`, `BackToTop` and the `CaseStudy` overlay; navigation is anchor links.

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
`Header.jsx` publishes its real height to `--header-h` via a `ResizeObserver`. Anything that needs to sit under the header uses `var(--header-h, 73px)` (`Hero`, `Clients`, `Process`). `Services.jsx` keeps its own observer because its offsets are JS arithmetic, which a CSS variable cannot feed. Never hardcode a header height — it changes with viewport and with control sizes.

### 2c. Motion respects `prefers-reduced-motion`
`main.jsx` wraps the app in `<MotionConfig reducedMotion="user">`, which handles most Framer animations. It does **not** cover: opacity-only animations, `setInterval`-driven content swaps, CSS `@keyframes`, or `scrollIntoView({behavior:'smooth'})`. Those are gated by hand — see `Hero.jsx`, `HeroShowcase.jsx`, the media query in `index.css`, and the `scrollIntoView` calls in `Hero.jsx` and `MobileMenu.jsx`. New animations of those four kinds need the same treatment. (`CaseStudy.jsx` has one ungated `scrollIntoView` — `docs/AUDIT.md` item 41.)

### 2d. Shared building blocks
Four modules exist so the same thing is not written twice. Reach for them before writing a new one:

| Module | What it owns |
|--------|-------------|
| `src/components/ui/Section.jsx` | The `<section>` + centred 1160px container shell. Used by About, Faq, Pricing, Team, Testimonials, Work, Contact. **Not** by Services, Clients, Process or Hero — each of those has its own layout contract, documented in the file. |
| `src/components/ui/SectionHeader.jsx` | The eyebrow + accent dot + `<h2>` pair. The body paragraph that follows stays at the call site; it varies too much to share. |
| `src/hooks/useMediaQuery.js` | All viewport queries. The query string is passed in, because the breakpoints are different rules, not copies: `767px` collapses the nav and switches the Work/Process layouts, `949px` drops the Services sticky stack. |
| `src/lib/` | Pure helpers with no React in them: `motion.js` (the `EASE` curve), `text.js` (`getInitials`, `dirArrow`), `contact.js` (`WHATSAPP_URL`, linked from two components). |

`Section` and `SectionHeader` take **no default prop values**. Every difference between sections — padding max, background, title measure — is passed explicitly, so a forgotten prop breaks loudly instead of silently snapping one section onto another's spacing.

### 2e. Four files are deliberately not split
`Services`, `Process`, `Work` and `CaseStudy` are the largest components and stay that way on purpose. Each computes layout from measured scroll positions — Services' sticky stack, Process' scroll-driven step activation, and the `layoutId` shared-element transition spanning Work and CaseStudy. Adding or moving a wrapper element shifts that maths silently, and a screenshot taken at scroll 0 will not catch it. Splitting them needs scroll-scripted coverage first.

### 3. Trilingual with RTL (en / fr / ar)
`ar` is right-to-left. `dir` on `<html>` is set to `rtl` for Arabic in two places — `App.jsx` (on language change) and `LanguageSwitcher.jsx` (on manual switch) — keep them consistent. The duplication is logged as `docs/AUDIT.md` item 30. Because of RTL, use **logical CSS properties** (`marginInlineEnd`, `paddingInlineStart`, ...) instead of physical `left`/`right`. The Arabic font (`IBM Plex Sans Arabic`) is loaded in `index.html`.

### Other conventions
- **Scroll animations:** wrap content in `<ScrollReveal>` (`src/components/ScrollReveal.jsx`) — a Framer Motion `whileInView` fade-up, `once: true`. Reuse it rather than writing new motion variants per section.
- **Anchor nav:** the `sections` array in `Header.jsx` (`services`, `process`, `work`, `pricing`, `team`, `faq`, `contact`) drives both the desktop nav and the mobile panel (`MobileMenu.jsx`, which receives it as a prop — `Header.jsx` stays the single source), and each entry needs a matching section `id` **and** a `nav.<key>` label in all three locale files. `#about`, `#clients` and `#testimonials` render but are intentionally left out of the nav — seven links is what fits on one header row. Change one, change all three.
- **Accessibility:** every interactive element carries `className="focus-ring"` (or `focus-ring-inset` inside an `overflow: hidden` container). Both rules live in `index.css`, since inline styles cannot express `:focus-visible`. New buttons and links need one of them.
- `src/index.css` is only a reset + base `html/body` typography; all component styling is inline.
- **Analytics:** `src/analytics.js` loads Umami (`VITE_UMAMI_SCRIPT_URL`, `VITE_UMAMI_WEBSITE_ID`) from `main.jsx`, and only in production builds. Record conversions with `track('event_name')` — it no-ops when the tracker is absent.

## Collaboration and git

Two-person repo. `main` is a protected shared branch — work on a personal branch, never
commit directly to `main`, and land every change through a PR. Do not commit or push
without the repo owner asking for it in that moment.

`Contact.jsx` POSTs to web3forms (`VITE_WEB3FORMS_KEY`, passed to the Docker build with
`--build-arg`) and is the likely integration point if a real backend replaces it.

## Where things live

| Path | What it is |
|------|-----------|
| `README.md` | Human-facing intro: stack, quick start, scripts |
| `AGENTS.md` | This file — instructions every AI agent reads |
| `CLAUDE.md` | Thin file that imports `AGENTS.md` for Claude Code |
| `docs/` | Long-form project documents (audits, notes, decisions) |
| `docs/AUDIT.md` | Accessibility / responsive / code-quality audit and its fix log. Items are numbered and referenced from code comments — keep the numbering stable |

Root markdown is limited to `README.md`, `AGENTS.md` and `CLAUDE.md`. Any **new long-form
markdown** — audit, plan, decision record, research note — goes in `docs/` and gets a row
in the table above. This rule is about markdown only; leave other root files alone.
