---
sidebar_position: 3
---

# GitHub

Das Projekt wird als **Monorepo** auf GitHub verwaltet. Alle Services, die Portainer-Konfiguration und die CI/CD-Pipelines liegen in einem einzigen Repository.

## Was ist ein Monorepo?

Ein Monorepo ist ein einzelnes Git-Repository, das mehrere unabhängige Komponenten oder Services enthält, im Gegensatz zum **Polyrepo-Ansatz**, bei dem jeder Service ein eigenes Repository bekommt.

| | Monorepo | Polyrepo |
|---|---|---|
| **Änderungen über Services hinweg** | Ein einziger Commit, ein einziger PR | Koordination über mehrere Repos |
| **Gemeinsamer Code** | Direkt als Unterordner teilbar | Erfordert eigene Packages oder Submodules |
| **Überblick** | Alles an einem Ort | Verteilt auf viele Repositories |
| **Berechtigungen** | Einheitlich für das gesamte Repo | Feingranular pro Service möglich |

Im Projektkontext überwiegen die Vorteile: Änderungen, die mehrere Services betreffen (z. B. eine neue Schnittstelle zwischen Frontend und Backend), lassen sich atomar in einem PR beschreiben und reviewen.

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

Jeder Service lebt in einem eigenen Unterordner mit eigenem `Dockerfile`, `docker-compose.yml` und GitHub Action. Der Ordner `portainer/` enthält die Compose-Dateien, die Portainer direkt aus dem Repository liest; wie das Deployment funktioniert ist auf der [Deployment-Seite](./deployment) beschrieben.

## Zugang zum Repository

Die Authentifizierung gegenüber GitHub erfolgt ausschließlich per **SSH-Key** — HTTPS-Zugriff wird nicht verwendet.

### SSH-Key einrichten

1. **SSH-Key-Paar erzeugen** (falls noch keines vorhanden):
   ```bash
   ssh-keygen -t ed25519 -C "deine@email.de"
   ```
2. **Öffentlichen Key bei GitHub hinterlegen:** GitHub → *Settings → SSH and GPG keys → New SSH key* → Inhalt von `~/.ssh/id_ed25519.pub` einfügen.
3. **Repository klonen** mit der SSH-URL (nicht HTTPS):
   ```bash
   git clone git@github.com:<org>/<repo>.git
   ```

Wer das Repository bereits per HTTPS geklont hat, kann die Remote-URL nachträglich umstellen:
```bash
git remote set-url origin git@github.com:<org>/<repo>.git
```

### Weiterführende Dokumentation

- [Über SSH bei GitHub](https://docs.github.com/de/authentication/connecting-to-github-with-ssh/about-ssh)
- [Neuen SSH-Key erstellen und dem SSH-Agent hinzufügen](https://docs.github.com/de/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [SSH-Key zum GitHub-Konto hinzufügen](https://docs.github.com/de/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
- [SSH-Verbindung testen](https://docs.github.com/de/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)

## Pull Requests

Neue Features und Bugfixes werden nicht direkt auf `main` gepusht, sondern über **Pull Requests** eingebracht. Wie Branches erstellt, aktuell gehalten und per Merge oder Rebase integriert werden, ist in der [Methodik-Seite zu Branches und Pull Requests](../methodik/branches-und-prs) beschrieben.

- Jeder PR ist mit einem **GitHub Issue** verknüpft (z. B. `Closes #42` im PR-Text)
- PRs werden vom **Dozenten** gemerged oder per Rebase integriert
- Direkte Commits auf `main` sind nicht vorgesehen

## GitHub Actions

Die CI/CD-Pipeline läuft sowohl auf `main` als auch auf **Pull Requests**, jedoch mit einem Unterschied:

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
