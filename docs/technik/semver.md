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

## Im Projekt

Git-Tags mit `v`-Präfix lösen die CI/CD-Pipeline aus und erzeugen ein versioniertes Docker-Image:

```bash
git tag v1.2.0
git push origin v1.2.0
```

Das resultierende Image wird als `1.2.0` in der GitHub Container Registry veröffentlicht.
