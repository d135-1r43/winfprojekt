---
sidebar_position: 4
---

# OAuth2 und OIDC

Das System verwendet **OpenID Connect (OIDC)** für Authentifizierung und **OAuth2** für Autorisierung. Keycloak ist der zentrale Identity Provider. Alle Komponenten, die auf gesicherte Ressourcen zugreifen, interagieren über dieses Protokoll.

## Begriffe

**OAuth2** ist ein Autorisierungsframework: Es legt fest, wie ein Client im Namen eines Nutzers Zugriff auf Ressourcen erhält, ohne dessen Passwort zu kennen. Das Ergebnis ist ein **Access Token**.

**OpenID Connect** baut auf OAuth2 auf und ergänzt Authentifizierung: Der Client erhält zusätzlich ein **ID Token**, das Informationen über die eingeloggte Person enthält (Name, E-Mail, Rollen).

## Tokens

| Token | Format | Verwendung |
|---|---|---|
| **Access Token** | JWT | Wird bei jedem API-Aufruf als `Authorization: Bearer` mitgeschickt |
| **ID Token** | JWT | Enthält Nutzerinfo für die React-App (Name, Rollen) |
| **Refresh Token** | opaque | Erneuert das Access Token ohne erneuten Login |

## Login-Flow (Authorization Code + PKCE)

Die React-App nutzt den **Authorization Code Flow mit PKCE** (Proof Key for Code Exchange), den empfohlenen Flow für Single Page Applications ohne sicheres Backend-Secret. Alle Anfragen laufen über NGINX, der als transparenter Reverse Proxy fungiert und im Ablauf nicht sichtbar ist.

```mermaid
sequenceDiagram
    actor Nutzer
    participant React as React App
    participant Keycloak

    Nutzer->>React: Öffnet die App
    React->>React: Kein Token vorhanden
    React->>React: Generiert code_verifier + code_challenge (PKCE)
    React->>Keycloak: Redirect zu /auth (code_challenge, client_id, redirect_uri)
    Keycloak->>Nutzer: Zeigt Login-Formular
    Nutzer->>Keycloak: Gibt Zugangsdaten ein
    Keycloak->>Keycloak: Validiert Zugangsdaten
    Keycloak->>React: Redirect mit Authorization Code
    React->>Keycloak: POST /token (code + code_verifier)
    Keycloak->>Keycloak: Prüft code_verifier gegen code_challenge
    Keycloak->>React: Access Token + ID Token + Refresh Token
    React->>React: Speichert Tokens
    React->>Nutzer: Zeigt Anwendung
```

## API-Aufruf mit Token-Validierung

Nach dem Login schickt die React-App das Access Token bei jedem Aufruf mit. Der Microservice als Resource Server validiert das Token eigenständig über den öffentlichen Schlüssel von Keycloak (JWKS), ohne Keycloak bei jeder Anfrage kontaktieren zu müssen.

```mermaid
sequenceDiagram
    actor Nutzer
    participant React as React App
    participant MS as Microservice (Quarkus)
    participant CIB as CIB seven
    participant Keycloak

    React->>Keycloak: Holt JWKS (öffentliche Schlüssel, gecacht)
    Keycloak->>React: Public Keys

    Nutzer->>React: Löst Aktion aus
    React->>MS: GET /api/ressource (Authorization: Bearer <JWT>)
    MS->>MS: Verifiziert JWT-Signatur und Ablaufdatum
    alt Token gültig
        MS->>CIB: Startet Prozessinstanz / liest Tasks
        CIB->>MS: Antwort
        MS->>React: 200 OK + Daten
        React->>Nutzer: Zeigt Ergebnis
    else Token abgelaufen
        MS->>React: 401 Unauthorized
        React->>Keycloak: POST /token (Refresh Token)
        Keycloak->>React: Neues Access Token
        React->>MS: Wiederholt Request mit neuem Token
    end
```

## Rollen und Zugriffssteuerung

Keycloak verwaltet Rollen, die im JWT als Claims enthalten sind. Die Microservices lesen diese Claims aus und entscheiden damit, welche Aktionen ein Nutzer ausführen darf. Die React-App liest die Rollen aus dem ID Token und blendet Funktionen entsprechend ein oder aus.
