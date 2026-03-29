# WInf Projekt – Dokumentation

Projektdokumentation für Studierende der Technischen Hochschule Ingolstadt, bereitgestellt von [Markus Herhoffer](https://herhoffer.net). Erreichbar unter **[winfprojekt.de](https://winfprojekt.de)**.

Die Seite ist mit [Docusaurus](https://docusaurus.io/) gebaut. Korrekturen und Ergänzungen sind willkommen — einfach einen Pull Request öffnen.

## Lokale Entwicklung

```bash
npm install
npm start        # Dev-Server auf http://localhost:3000
npm run build    # Produktions-Build nach /build
npm run serve    # Build lokal ausliefern
npx tsc --noEmit # Typprüfung
```

Die Suche (`@easyops-cn/docusaurus-search-local`) funktioniert nur im Production Build, nicht im Dev-Server.

## Deployment

Ein Push auf `main` oder ein `v*`-Tag löst die GitHub Action aus:

1. Docker-Image bauen (`node:20-alpine` + `nginx:alpine`)
2. Image nach `ghcr.io/d135-1r43/winfprojekt` pushen
3. Portainer-Webhook aufrufen → automatisches Redeployment

Das Secret `PORTAINER_WEBHOOK_URL` muss in den GitHub Repository Secrets hinterlegt sein.

### Docker Compose (Portainer)

```yaml
services:
  winfprojekt:
    image: ghcr.io/d135-1r43/winfprojekt:main
    restart: unless-stopped
    networks:
      - npm_default

networks:
  npm_default:
    external: true
```

## Neue Inhalte hinzufügen

- Seiten in `docs/methodik/` oder `docs/technik/` als `.md` oder `.mdx` ablegen
- Die Sidebar wird automatisch aus der Verzeichnisstruktur generiert
- `sidebar_position` im Frontmatter steuert die Reihenfolge
