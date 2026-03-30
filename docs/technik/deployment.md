---
sidebar_position: 5
---

# Deployment

Jeder Service wird als Docker-Image gebaut und über [Portainer](https://www.portainer.io/) betrieben. Das Deployment erfolgt manuell durch Hochziehen des Image-Tags in der `docker-compose.yml`.

## CI/CD-Pipeline

Ein Push auf den `main`-Branch löst automatisch eine GitHub Action aus, die das Docker-Image baut und in die **GitHub Container Registry (GHCR)** veröffentlicht.

```
Push → main
  └─ GitHub Action
       ├─ Docker-Image bauen
       └─ Image pushen nach ghcr.io/<org>/<repo>:<tag>
```

Das Image wird mit zwei Tags versehen:

| Tag | Bedeutung |
|-----|-----------|
| `main` | Immer der aktuelle Stand von `main` |
| `sha-<commit>` | Unveränderlicher Verweis auf einen konkreten Commit |

Für Releases empfiehlt sich ein Git-Tag mit `v`-Präfix (z. B. `v1.2.0`), der dann als Semver-Tag im GHCR landet.

### Beispiel: GitHub Action für Quarkus/Maven

Die Workflow-Datei liegt unter `.github/workflows/docker.yml` im Repository:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Build with Maven
        run: mvn -B package -DskipTests

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix=sha-

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Das dazugehörige `Dockerfile` nutzt den Maven-Build-Output aus dem vorherigen Schritt:

```dockerfile
FROM registry.access.redhat.com/ubi9/openjdk-21:latest
COPY target/quarkus-app/lib/ /deployments/lib/
COPY target/quarkus-app/*.jar /deployments/
COPY target/quarkus-app/app/ /deployments/app/
COPY target/quarkus-app/quarkus/ /deployments/quarkus/
EXPOSE 8080
CMD ["java", "-jar", "/deployments/quarkus-run.jar"]
```

## Portainer und Docker Compose

Portainer verwaltet die laufenden Container. Die Konfiguration liegt als `docker-compose.yml` im Git-Repository des jeweiligen Services. Portainer liest diese Datei und startet die Container entsprechend.

Um eine neue Version auszurollen, wird der Image-Tag in der `docker-compose.yml` auf den gewünschten Stand geändert:

```yaml
services:
  mein-service:
    # vorher: image: ghcr.io/org/mein-service:1.1.0
    image: ghcr.io/org/mein-service:1.2.0
```

Danach zieht Portainer das neue Image und startet den Container neu. Der Schritt ist bewusst manuell, um unkontrollierte Deployments auf Produktivsysteme zu vermeiden.

## Stack in Portainer einrichten

Ein neuer Service wird in Portainer als **Repository-Stack** angelegt. Portainer liest die `docker-compose.yml` direkt aus dem Git-Repository — es muss keine Datei manuell hochgeladen werden.

![Portainer – Stack aus Repository erstellen](/img/screenshots/portainer.png)

**Schritte:**

1. In Portainer **Stacks** öffnen und **Add stack** klicken.
2. Einen Namen vergeben (z. B. `mein-service`).
3. Als Build-Methode **Repository** wählen.
4. Im Feld **Repository URL** die HTTPS-URL des GitHub-Repositories eintragen.
5. **Repository reference** auf den gewünschten Branch setzen, z. B. `refs/heads/main`.
6. Unter **Compose path** den Pfad zur `docker-compose.yml` angeben (Standard: `docker-compose.yml`).
7. Optional: **Automatic updates** aktivieren, damit Portainer den Stack bei Änderungen im Repository automatisch neu deployed.
8. Umgebungsvariablen bei Bedarf unter **Environment variables** eintragen.
9. **Deploy the stack** klicken.

Nach dem ersten Deployment kann der Stack jederzeit über **Pull and redeploy** aktualisiert werden — sinnvoll, nachdem der Image-Tag in der `docker-compose.yml` hochgezogen wurde.

## Ablauf eines Deployments

1. Änderungen auf `main` mergen
2. GitHub Action abwarten, bis das Image in GHCR erscheint
3. In der `docker-compose.yml` des Services den Tag aktualisieren
4. Änderung committen und pushen
5. In Portainer den Stack neu deployen
