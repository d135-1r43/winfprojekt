---
sidebar_position: 2
---

# Systemarchitektur

Das System besteht aus mehreren spezialisierten Komponenten, die als Container betrieben und über einen zentralen Reverse Proxy erreichbar gemacht werden.

## Übersicht

```mermaid
graph TD
    Browser(["Browser / Client"])

    Browser -->|HTTPS| NGINX

    subgraph Infrastruktur
        NGINX["NGINX\nReverse Proxy"]
    end

    subgraph Authentifizierung
        Keycloak["Keycloak\nOIDC Provider"]
    end

    subgraph Prozessautomatisierung
        CIB["CIB seven\nProcess Engine\n(Camunda-Fork)"]
    end

    subgraph Microservices["Microservices (Quarkus)"]
        MS1["Microservice A"]
        MS2["Microservice B"]
        MS3["Microservice C"]
    end

    NGINX -->|Routing| CIB
    NGINX -->|Routing| MS1
    NGINX -->|Routing| MS2
    NGINX -->|Routing| MS3
    NGINX -->|Routing| Keycloak

    MS1 <-->|REST / Events| CIB
    MS2 <-->|REST / Events| CIB
    MS3 <-->|REST / Events| CIB

    MS1 -->|Token-Validierung| Keycloak
    MS2 -->|Token-Validierung| Keycloak
    MS3 -->|Token-Validierung| Keycloak
    CIB -->|Token-Validierung| Keycloak
```

## Komponenten

### [NGINX](https://nginxproxymanager.com/) Reverse Proxy

NGINX ist der einzige öffentlich erreichbare Endpunkt. Er nimmt alle eingehenden HTTPS-Anfragen entgegen und leitet sie anhand von Pfad- oder Subdomain-Regeln an den zuständigen Container weiter. Dadurch sind die internen Dienste nicht direkt exponiert.

### [Keycloak](https://www.keycloak.org/) OIDC Provider

Keycloak übernimmt die zentrale Authentifizierung und Autorisierung nach dem OpenID-Connect-Standard. Nach erfolgreichem Login erhält der Client ein JWT, das bei jedem API-Aufruf mitgeschickt wird. Alle Microservices und CIB seven validieren dieses Token direkt gegen Keycloak.

### [CIB seven](https://cibseven.org/en/) Process Engine

CIB seven ist ein Fork von Camunda 7 und stellt die BPMN-Prozess-Engine bereit. Geschäftsprozesse werden als BPMN-Diagramme modelliert und von CIB seven ausgeführt. Die Microservices können Prozessinstanzen starten, Tasks abarbeiten und Prozessvariablen lesen und schreiben.

### Microservices ([Quarkus](https://quarkus.io/))

Die fachliche Logik ist auf spezialisierte Microservices aufgeteilt, die jeweils mit Quarkus implementiert sind. Quarkus bietet kurze Startup-Zeiten und geringen Speicherbedarf, was den Container-Betrieb vereinfacht. Die Microservices kommunizieren mit der Process Engine über deren REST-API und sichern ihre eigenen Endpunkte mit den von Keycloak ausgestellten Tokens ab.
