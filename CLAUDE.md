# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start         # Start local dev server with hot reload
npm run build     # Build static site to /build directory
npm run serve     # Serve the pre-built static site
npm run typecheck # Run TypeScript type checking
```

No dedicated lint or test commands are configured.

## Deployment

Pushing to `main` is all that is required. `.github/workflows/docker.yml` builds a Docker image and pushes it to GHCR; Watchtower pulls the new image on the server and restarts the container. There is no manual deploy step — do not run `npm run deploy`.

## Architecture

This is a [Docusaurus 3.9](https://docusaurus.io/) static site with TypeScript configuration, using React 19 and the classic preset.

**Content directories:**
- `docs/` - Documentation pages; sidebar is auto-generated from directory structure. Subdirectories become categories (ordered/labeled via `_category_.json`).
- `src/pages/` - Top-level site pages (React `.tsx` or `.md`); each file becomes a route.
- `src/components/` - Shared React components.
- `static/` - Static assets served at the root.

**Configuration files** (`docusaurus.config.ts`, `sidebars.ts`) run in Node.js; no browser APIs or JSX in these files.

**Styling:** CSS Modules (`.module.css`) for component-scoped styles; global overrides in `src/css/custom.css`.

**Sidebar:** Auto-generated from `docs/` filesystem in `sidebars.ts`. Manual configuration is supported but not currently used.

**Admonitions:** Titles must use the MDX v3 bracket form `:::tip[Titel]`. The legacy Docusaurus 2 form `:::tip Titel` is not parsed and renders as literal text including the `:::` markers — it fails silently, so the build stays green. Always verify with `npm run build` and check for `theme-admonition-*` classes in the generated HTML.
