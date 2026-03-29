# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start        # Start local dev server with hot reload
yarn build        # Build static site to /build directory
yarn serve        # Serve the pre-built static site
yarn typecheck    # Run TypeScript type checking
yarn deploy       # Deploy to GitHub Pages
```

No dedicated lint or test commands are configured.

## Architecture

This is a [Docusaurus 3.9](https://docusaurus.io/) static site with TypeScript configuration, using React 19 and the classic preset.

**Content directories:**
- `docs/` — Documentation pages; sidebar is auto-generated from directory structure. Subdirectories become categories (ordered/labeled via `_category_.json`).
- `blog/` — Blog posts; named `YYYY-MM-DD-title.md`. Authors and tags defined in `blog/authors.yml` and `blog/tags.yml`.
- `src/pages/` — Top-level site pages (React `.tsx` or `.md`); each file becomes a route.
- `src/components/` — Shared React components.
- `static/` — Static assets served at the root.

**Configuration files** (`docusaurus.config.ts`, `sidebars.ts`) run in Node.js — no browser APIs or JSX in these files.

**Styling:** CSS Modules (`.module.css`) for component-scoped styles; global overrides in `src/css/custom.css`.

**Sidebar:** Auto-generated from `docs/` filesystem in `sidebars.ts`. Manual configuration is supported but not currently used.
