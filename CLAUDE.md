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

## Documented Quarkus configuration

Config examples in `docs/` must stay minimal. Never write a setting that a Quarkus default already covers, and never introduce custom environment variable names.

- **Rely on defaults.** `quarkus.datasource.db-kind` is derived from the JDBC driver extension (only needed when several database extensions are present); `quarkus.oidc.application-type` already defaults to `service`.
- **Production values come from environment variables**, using Quarkus' own naming convention: every character that is neither alphanumeric nor `_` becomes `_`, then the name is uppercased. So `quarkus.datasource.jdbc.url` is set via `QUARKUS_DATASOURCE_JDBC_URL`. This needs no corresponding line in `application.properties`. Reference: https://quarkus.io/guides/config-reference#environment-variables
- **Never document the indirection** `quarkus.datasource.password=${DB_PASSWORD}`. Besides being redundant, it marks the setting as configured in every profile, which silently disables Dev Services and forces students to run PostgreSQL and Keycloak by hand.
- **Dev Services depends on absence.** Quarkus only starts the PostgreSQL and Keycloak containers when no corresponding URL is configured. Keeping `application.properties` empty is therefore load-bearing, not cosmetic.

The canonical version of the config block lives in `docs/technik/microservices.md`; `lokale-entwicklung.md` and `testing.mdx` must not drift from it.
