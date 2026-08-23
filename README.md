# CUVATEX Portfolio

A multilingual portfolio site for CUVATEX — a software product team.

**Stack:** React 19, Vite 8, React Router, Framer Motion, i18next, pnpm

## Quick start

### With Docker

```bash
docker compose up
```

Open [http://localhost:5173](http://localhost:5173) — hot reload works automatically.

### Without Docker

```bash
pnpm install
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Lint source with oxlint |

## Features

- **Multilingual** — English, French, Arabic (RTL)
- **Dark/light theme** — persisted to localStorage
- **Scroll animations** — Framer Motion reveal on scroll
- **Responsive** — mobile-first layout
- **Docker** — dev & production Dockerfiles included

## Production build

```bash
docker build --target prod -t cuvatex .
docker run -p 8080:80 cuvatex
```

Or without Docker:

```bash
pnpm build
pnpm preview
```

## Project structure

```
src/
├── pages/        — One file per route (Home, ServicesList, WorkList, Project,
│                   AboutPage, ContactPage, Terms, Privacy, NotFound)
├── components/   — Reusable pieces (Header, Hero, Services, ProjectCard, etc.)
├── data/         — Project list and image helpers
├── hooks/        — Shared React hooks
├── lib/          — Pure helpers, no React
├── i18n/         — Translation JSON files (en, fr, ar)
├── theme/        — Theme context (light/dark)
├── App.jsx       — Shell: header, routes, footer
├── main.jsx      — Entry point
└── index.css     — Global styles
```

### Pages

| Route | What it shows |
|-------|---------------|
| `/` | The main page — services, work, about and contact all appear as short teasers |
| `/services` | All services, in full detail |
| `/work` | Every project |
| `/work/:slug` | One case study, e.g. `/work/atlas-retail` |
| `/about` | The full About story |
| `/contact` | The contact form and direct links |
| `/terms` | Terms of Service (placeholder text — not reviewed by a lawyer yet) |
| `/privacy` | Privacy Policy (same placeholder caveat) |

`nginx.conf` gives the production image an SPA fallback. Without it, opening
`/work/atlas-retail` directly or reloading it returns 404.

## Docs

| File | What it is |
|------|-----------|
| [`AGENTS.md`](AGENTS.md) | Architecture, conventions and rules — read this before editing code. Also what AI coding agents (Claude Code, Cursor, Copilot, Codex…) load automatically. |
| [`docs/AUDIT.md`](docs/AUDIT.md) | 2026-07 accessibility / responsive audit and its fix log |

## License

Private — CUVATEX
