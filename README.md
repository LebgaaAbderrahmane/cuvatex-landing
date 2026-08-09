# CUVATEX Portfolio

A multilingual portfolio site for CUVATEX — a software product team.

**Stack:** React 19, Vite 8, Framer Motion, i18next, pnpm

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
├── components/   — React components (Header, Hero, Services, etc.)
├── i18n/         — Translation JSON files (en, fr, ar)
├── theme/        — Theme context (light/dark)
├── App.jsx       — Root layout
├── main.jsx      — Entry point
└── index.css     — Global styles
```

## Docs

| File | What it is |
|------|-----------|
| [`AGENTS.md`](AGENTS.md) | Architecture, conventions and rules — read this before editing code. Also what AI coding agents (Claude Code, Cursor, Copilot, Codex…) load automatically. |
| [`docs/AUDIT.md`](docs/AUDIT.md) | 2026-07 accessibility / responsive audit and its fix log |

## License

Private — CUVATEX
