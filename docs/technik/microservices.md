---
sidebar_position: 7
---

# Microservices mit Quarkus

Die fachliche Logik ist auf spezialisierte Microservices aufgeteilt, die jeweils mit [Quarkus](https://quarkus.io/) implementiert sind. Quarkus bietet kurze Startup-Zeiten, geringen Speicherbedarf und eine moderne, auf CDI und MicroProfile basierende Entwicklungserfahrung. Wie die Services in die Gesamtarchitektur eingebettet sind, ist auf der [Systemarchitektur-Seite](./architektur) beschrieben.

## Neuen Service anlegen

Neue Services werden über [code.quarkus.io](https://code.quarkus.io/) initialisiert. Dort lassen sich Extensions auswählen und ein fertiges Maven-Projekt herunterladen. Das Projekt landet anschließend als eigener Unterordner im [Monorepo](./github).

## Extensions

Ein klassischer Service im Projekt braucht die folgenden fünf Extensions:

![Quarkus Extensions Auswahl](/img/screenshots/quarkus-extensions.png)

| Extension | Artifact ID | Zweck |
|-----------|-------------|-------|
| **Hibernate ORM with Panache** | `quarkus-hibernate-orm-panache` | Datenbankzugriff mit Active Record oder Repository Pattern |
| **REST Jackson** | `quarkus-rest-jackson` | REST-Endpunkte mit JSON-Serialisierung via Jackson |
| **SmallRye Health** | `quarkus-smallrye-health` | Health-Checks (`/q/health`) für Liveness und Readiness |
| **JDBC Driver - PostgreSQL** | `quarkus-jdbc-postgresql` | PostgreSQL-Datenbankverbindung via JDBC |
| **OpenID Connect** | `quarkus-oidc` | Token-Validierung und Authentifizierung via Keycloak |

### Warum diese Kombination?

- **Hibernate + PostgreSQL** bilden den Persistenz-Stack. Panache reduziert Boilerplate beim Datenbankzugriff deutlich.
- **REST Jackson** stellt die REST-API bereit und serialisiert Java-Objekte automatisch als JSON.
- **SmallRye Health** ermöglicht Portainer und dem [NGINX Proxy Manager](./architektur#nginx-proxy-manager-reverse-proxy) zu prüfen, ob der Service läuft.
- **OpenID Connect** bindet [Keycloak](./oauth2-oidc) an: Eingehende Bearer-Tokens werden automatisch validiert, ohne dass dafür eigener Code nötig ist.

## Konfiguration

Die wichtigsten Einstellungen in `src/main/resources/application.properties`:

```properties
# Datenbankverbindung
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=${DB_USER}
quarkus.datasource.password=${DB_PASSWORD}
quarkus.datasource.jdbc.url=jdbc:postgresql://${DB_HOST}:5432/${DB_NAME}

# Schema automatisch aktualisieren (nur Entwicklung)
quarkus.hibernate-orm.database.generation=update

# Keycloak
quarkus.oidc.auth-server-url=${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}
quarkus.oidc.client-id=${KEYCLOAK_CLIENT_ID}
quarkus.oidc.application-type=service
```

Sensible Werte wie Passwörter und URLs werden als Umgebungsvariablen übergeben und nicht in die Codebasis eingecheckt.

## Versionierung und Deployment

Jeder Service wird eigenständig versioniert nach [Semantic Versioning](./semver). Ein Git-Tag mit `v`-Präfix löst die CI/CD-Pipeline aus, die ein Docker-Image baut und in die GitHub Container Registry veröffentlicht. Wie das Image dann auf dem Server landet, beschreibt die [Deployment-Seite](./deployment).
