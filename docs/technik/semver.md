---
sidebar_position: 9
---

# Semantic Versioning

[Semantic Versioning](https://semver.org/) (kurz: SemVer) ist eine Konvention zur Versionierung von Software. Eine Versionsnummer hat immer die Form `MAJOR.MINOR.PATCH`, z. B. `2.4.1`.

## Schema

| Teil | Hochzählen wenn... |
|---|---|
| `MAJOR` | inkompatible Änderungen; bestehende Nutzer müssen etwas anpassen |
| `MINOR` | neue Funktionalität, die abwärtskompatibel ist |
| `PATCH` | Bugfixes ohne Änderung der Schnittstelle |

## Regeln

- Vor dem ersten stabilen Release gilt `0.x.y`; breaking changes sind dort auch in Minor-Versionen erlaubt.
- Eine veröffentlichte Version darf nicht nachträglich verändert werden. Fehler werden als neue `PATCH`-Version korrigiert.
- Pre-Release-Versionen werden mit einem Suffix gekennzeichnet, z. B. `1.0.0-alpha`, `1.0.0-rc.1`.

## Docker-Images per GitHub Action versionieren

Die Versionsnummer wird nicht von Hand in eine Datei geschrieben, sondern ergibt sich aus dem Git-Tag. Die GitHub Action liest den Tag aus und leitet daraus die Tags des Docker-Images ab. Damit ist sichergestellt, dass Image-Version und Code-Stand immer zusammenpassen.

### 1. Workflow auf Tags reagieren lassen

Damit die Action bei einem Release überhaupt läuft, muss sie neben `main` auch auf Tags mit `v`-Präfix hören:

```yaml
on:
  push:
    branches:
      - main
    tags:
      - 'v*'
```

### 2. Image-Tags mit `docker/metadata-action` ableiten

Die Action [`docker/metadata-action`](https://github.com/docker/metadata-action) übersetzt den Git-Tag in Image-Tags. Das `v`-Präfix entfernt sie dabei automatisch:

```yaml
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
```

Die erzeugten Tags werden anschließend an `docker/build-push-action` übergeben (`tags: ${{ steps.meta.outputs.tags }}`). Den vollständigen Workflow zeigt die [Deployment-Seite](./deployment#beispiel-github-action-für-quarkusmaven).

### 3. Release erstellen

```bash
git tag v1.2.0
git push origin v1.2.0
```

Alternativ lässt sich in GitHub unter **Releases → Draft a new release** ein Tag anlegen; das löst den Workflow ebenso aus.

### Welche Image-Tags entstehen?

| Auslöser | Image-Tags in GHCR |
|---|---|
| Push auf `main` | `main`, `sha-abc1234` |
| Git-Tag `v1.2.0` | `1.2.0`, `1.2`, `latest`, `sha-abc1234` |
| Git-Tag `v1.2.1` | `1.2.1`, `1.2` (wird umgehängt), `latest`, `sha-…` |
| Git-Tag `v2.0.0-rc.1` | `2.0.0-rc.1`, `sha-…` |

- `{{version}}` ist der exakte, unveränderliche Release-Tag. In der `docker-compose.yml` auf dem Server sollte immer dieser stehen.
- `{{major}}.{{minor}}` wandert mit jedem Patch-Release mit. Wer `1.2` verwendet, bekommt Bugfixes automatisch, aber keine neuen Features.
- `latest` setzt die Action automatisch beim höchsten stabilen Release. Pre-Releases wie `-rc.1` erhalten weder `latest` noch den `MAJOR.MINOR`-Tag.

:::warning[Tag muss gültiges SemVer sein]
Ein Tag wie `v1.2` oder `release-1` ist kein gültiges SemVer. Der Workflow läuft dann zwar, die `type=semver`-Regeln erzeugen aber keine Tags; im GHCR landet nur `sha-…`.
:::
