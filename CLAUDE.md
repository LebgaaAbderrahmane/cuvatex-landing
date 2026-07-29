# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

Single-page marketing/portfolio site. React 19 + Vite 8. No router — `App.jsx` stacks section components (`Hero`, `Services`, `Process`, `Work`, `About`, `Team`, `Contact`) in order; navigation is anchor links.

Three cross-cutting systems drive almost every component. Understand them before editing:

### 1. Content lives in i18n JSON, never in JSX
All user-facing text is in `src/i18n/{en,fr,ar}.json` and read via `t('key')`. Repeating content (services list, process steps) is stored as **arrays** in the JSON and pulled with `t('services', { returnObjects: true })`, then mapped. To add or change any copy: edit **all three** locale files with the **same key structure** — a key present in one but missing in another silently falls back to English. Do not hardcode strings in components.

### 2. Theming via CSS custom properties, set from JS
`src/theme/ThemeContext.jsx` holds two token maps (`light`, `dark`) and writes them as CSS variables (`--bg`, `--fg`, `--accent`, `--muted`, `--line`, `--surface`, `--accent-fg`, `--bg-header`) onto `document.documentElement`. Choice persists to `localStorage` under `studio-theme`. Components are styled with **inline `style` objects** (no CSS framework, no CSS modules) that reference `var(--token, fallback)`. Rules:
- Never hardcode a color — use `var(--token)`.
- Adding a new color token means adding it to **both** `light` and `dark` maps in `ThemeContext.jsx`, or theme switching breaks.
- Read/toggle theme via the `useTheme()` hook (throws if used outside `ThemeProvider`).

### 3. Trilingual with RTL (en / fr / ar)
`ar` is right-to-left. `dir` on `<html>` is set to `rtl` for Arabic in two places — `App.jsx` (on language change) and `Header.jsx` (on manual switch) — keep them consistent. Because of RTL, use **logical CSS properties** (`marginInlineEnd`, `paddingInlineStart`, ...) instead of physical `left`/`right`. The Arabic font (`IBM Plex Sans Arabic`) is loaded in `index.html`.

### Other conventions
- **Scroll animations:** wrap content in `<ScrollReveal>` (`src/components/ScrollReveal.jsx`) — a Framer Motion `whileInView` fade-up, `once: true`. Reuse it rather than writing new motion variants per section.
- **Anchor nav:** header links (`#services`, `#process`, `#work`, `#team`, `#contact`) must match the `id` on each section. Change one, change both.
- `src/index.css` is only a reset + base `html/body` typography; all component styling is inline.
- **Analytics:** `src/analytics.js` loads Umami (`VITE_UMAMI_SCRIPT_URL`, `VITE_UMAMI_WEBSITE_ID`) from `main.jsx`, and only in production builds. Record conversions with `track('event_name')` — it no-ops when the tracker is absent.

## Notes for the CUVATEX collaboration
Two-person repo (`main` is protected shared branch). Work on a personal branch, never commit directly to `main`; land changes through PRs. `Contact.jsx` is the likely integration point for a backend (form submission) — it is currently frontend-only.
