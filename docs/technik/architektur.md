---
sidebar_position: 1
---

# Systemarchitektur

Das System besteht aus mehreren spezialisierten Komponenten, die als Container betrieben und über einen zentralen Reverse Proxy erreichbar gemacht werden.

## Übersicht

```mermaid
graph TD
    Browser(["Browser / Client"])
    NGINX["Nginx Proxy Manager\nReverse Proxy"]
    UI["React\nSingle Page App"]
    MS["Microservices\nQuarkus"]
    CIB["CIB seven\nProcess Engine\n(nur Prozesse)"]
    Keycloak["Keycloak\nOIDC Provider"]

    Browser -->|HTTPS| NGINX
    NGINX --> UI
    NGINX --> MS
    NGINX --> CIB
    NGINX --> Keycloak

    UI -->|REST| MS
    UI -->|Login / Token| Keycloak

    MS <-->|REST / Events| CIB
    MS -->|Token-Validierung| Keycloak
    CIB -->|Token-Validierung| Keycloak

    classDef developed fill:#80a040,stroke:#5a7030,color:#ffffff,font-weight:bold
    class UI,MS developed
```

:::note[Legende]
Grün hinterlegt: wird im Projekt entwickelt. Bei CIB seven werden nur die BPMN-Prozesse entwickelt, nicht die Engine selbst.
:::

## Komponenten

### [Nginx Proxy Manager](https://nginxproxymanager.com/) Reverse Proxy

Nginx Proxy Manager ist der einzige öffentlich erreichbare Endpunkt. Er nimmt alle eingehenden HTTPS-Anfragen entgegen und leitet sie anhand von Subdomain-Regeln an den zuständigen Container weiter. Dadurch sind die internen Dienste nicht direkt exponiert. Die Konfiguration der Proxy-Hosts, SSL-Zertifikate (Let's Encrypt) und Weiterleitungen erfolgt über eine Weboberfläche, ohne manuelle nginx-Konfigurationsdateien.

![Nginx Proxy Manager – Proxy-Hosts Übersicht](/img/screenshots/nginx-proxy-manager.png)

Mehr zur Konfiguration, zum Docker-Netzwerk und zum Anlegen von Proxy-Hosts auf der [Nginx Proxy Manager-Seite](./reverse-proxy).

### [React](https://react.dev/) Frontend

Die Benutzeroberfläche ist eine Single Page Application auf Basis von React. Sie kommuniziert ausschließlich über die REST-APIs der Microservices mit dem Backend. Die Authentifizierung läuft über Keycloak: Nach dem Login speichert die App das JWT und schickt es bei jedem API-Aufruf als Bearer-Token mit. Details zur Authentifizierung beschreibt die [OAuth2/OIDC-Seite](./oauth2-oidc).

### [Keycloak](https://www.keycloak.org/) OIDC Provider

Keycloak übernimmt die zentrale Authentifizierung und Autorisierung nach dem OpenID-Connect-Standard. Nach erfolgreichem Login erhält der Client ein JWT, das bei jedem API-Aufruf mitgeschickt wird. Alle Microservices und CIB seven validieren dieses Token direkt gegen Keycloak. Mehr dazu auf der [OAuth2/OIDC-Seite](./oauth2-oidc).

![Keycloak – Benutzerverwaltung](/img/screenshots/keycloak.png)

### [CIB seven](https://cibseven.org/en/) Process Engine

CIB seven ist ein Fork von Camunda 7 und stellt die BPMN-Prozess-Engine bereit. Geschäftsprozesse werden als BPMN-Diagramme modelliert und von CIB seven ausgeführt. Die Microservices können Prozessinstanzen starten, Tasks abarbeiten und Prozessvariablen lesen und schreiben. Mehr dazu auf der [CIB seven-Seite](./cibseven).

### Microservices ([Quarkus](https://quarkus.io/))

Die fachliche Logik ist auf spezialisierte Microservices aufgeteilt, die jeweils mit Quarkus implementiert sind. Quarkus bietet kurze Startup-Zeiten und geringen Speicherbedarf, was den Container-Betrieb vereinfacht. Die Microservices kommunizieren mit der Process Engine über deren REST-API und sichern ihre eigenen Endpunkte mit den von Keycloak ausgestellten Tokens ab. Mehr dazu auf der [Microservices-Seite](./microservices).
