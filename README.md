# WInf Projekt – Dokumentation

Projektdokumentation für Studierende der Technischen Hochschule Ingolstadt, bereitgestellt von [Markus Herhoffer](https://herhoffer.net).

Erreichbar unter **[winfprojekt.de](https://winfprojekt.de)**.

## Inhalt

Die Dokumentation ist in zwei Bereiche gegliedert:

**Methodik** — Agiles Arbeiten mit Scrum: Sprints, Rollen, Sprint Planning, Review und Retrospektive nach den 5 Phasen (Derby & Larsen). Der Dozent übernimmt die Rolle des Product Owners, der Scrum Master rotiert jeden Sprint unter den Studierenden.

**Technik** — Systemarchitektur und eingesetzte Technologien:
- React Single Page App als Frontend
- Quarkus Microservices als Backend
- CIB seven (Camunda-Fork) als Process Engine
- Keycloak als OIDC Provider
- NGINX Proxy Manager als Reverse Proxy

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
