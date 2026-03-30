---
sidebar_position: 6
---

# GitHub

Das Projekt wird als **Monorepo** auf GitHub verwaltet. Alle Services, die Portainer-Konfiguration und die CI/CD-Pipelines liegen in einem einzigen Repository.

## Struktur

```
/
├── portainer/           # Docker Compose Dateien für Portainer
├── service-a/           # Erster Microservice (Quarkus/Maven)
│   ├── src/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .github/workflows/docker.yml
├── service-b/           # Zweiter Microservice
│   └── ...
└── ...
```

Jeder Service lebt in einem eigenen Unterordner mit eigenem `Dockerfile`, `docker-compose.yml` und GitHub Action. Der Ordner `portainer/` enthält die Compose-Dateien, die Portainer direkt aus dem Repository liest — wie das Deployment funktioniert ist auf der [Deployment-Seite](./deployment) beschrieben.

## Pull Requests

Neue Features und Bugfixes werden nicht direkt auf `main` gepusht, sondern über **Pull Requests** eingebracht:

- Jeder PR ist mit einem **GitHub Issue** verknüpft (z. B. `Closes #42` im PR-Text)
- PRs werden vom **Dozenten** gemerged oder per Rebase integriert
- Direkte Commits auf `main` sind nicht vorgesehen

## GitHub Actions

Die CI/CD-Pipeline läuft sowohl auf `main` als auch auf **Pull Requests** — jedoch mit einem Unterschied:

| Ereignis | Build | Tests | Docker-Image pushen |
|----------|-------|-------|---------------------|
| Push auf `main` | ja | ja | ja |
| Pull Request | ja | ja | nein |

Das verhindert, dass unfertige Stände als Images in die Registry gelangen, stellt aber sicher, dass der Build und die Tests im PR bereits grün sind, bevor gemerged wird.

Um das in der GitHub Action umzusetzen, wird der Push-Schritt an eine Bedingung geknüpft:

```yaml
      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Der Trigger im Workflow deckt beide Fälle ab:

```yaml
on:
  push:
    branches:
      - main
    tags:
      - 'v*'
  pull_request:
    branches:
      - main
```
