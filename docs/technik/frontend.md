---
sidebar_position: 8
---

# Frontend mit React

Die Benutzeroberfläche ist eine Single Page Application (SPA) auf Basis von [React](https://react.dev/). Sie kommuniziert über REST mit den [Microservices](./microservices) und der [CIB seven Process Engine](./cibseven) und authentifiziert sich über [Keycloak](./oauth2-oidc).

## Neue React App anlegen

Eine neue App wird mit einem Framework-Starter erstellt. Die offizielle Empfehlung der React-Dokumentation steht unter [react.dev/learn/creating-a-react-app](https://react.dev/learn/creating-a-react-app).

Für dieses Projekt empfehlen wir [Vite](https://vite.dev/) mit dem React-TypeScript-Template:

```bash
npm create vite@latest mein-frontend -- --template react-ts
cd mein-frontend
npm install
npm run dev
```

## Authentifizierung mit Keycloak (OIDC)

Die App nutzt [keycloak-js](https://www.npmjs.com/package/keycloak-js), den offiziellen JavaScript-Adapter von Keycloak.

```bash
npm install keycloak-js
```

### Keycloak initialisieren

```ts title="src/keycloak.ts"
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloak;
```

```ts title="src/main.tsx"
import keycloak from './keycloak';

keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
  if (authenticated) {
    ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
  }
});
```

Mit `onLoad: 'login-required'` wird der Nutzer automatisch auf die Keycloak-Loginseite weitergeleitet, bevor die App gerendert wird.

### Token an API-Requests anhängen

Nach dem Login stellt Keycloak ein JWT bereit. Dieses wird bei jedem API-Aufruf als Bearer-Token mitgeschickt:

```ts
const response = await fetch(`${import.meta.env.VITE_API_URL}/mein-endpunkt`, {
  headers: {
    Authorization: `Bearer ${keycloak.token}`,
  },
});
```

Tokens laufen ab. Vor jedem Request sollte das Token aktualisiert werden:

```ts
await keycloak.updateToken(30); // erneuern, wenn weniger als 30 Sekunden gültig
```

## Mit den Microservices kommunizieren

Die Microservices stellen REST-APIs bereit, die über den [NGINX Proxy Manager](./architektur#nginx-proxy-manager-reverse-proxy) unter eigenen Subdomains erreichbar sind. Die Basis-URL wird als Umgebungsvariable konfiguriert:

```bash title=".env"
VITE_API_URL=https://mein-service.winfprojekt.de
VITE_KEYCLOAK_URL=https://keycloak.winfprojekt.de
VITE_KEYCLOAK_REALM=winfprojekt
VITE_KEYCLOAK_CLIENT_ID=mein-frontend
```

## Mit CIB seven kommunizieren

CIB seven stellt eine [REST API](https://docs.cibseven.org/reference/rest/overview/) bereit. Darüber können Prozessinstanzen gestartet, Tasks abgerufen und Variablen gesetzt werden:

```ts
// Prozessinstanz starten
await fetch(`${import.meta.env.VITE_CIBSEVEN_URL}/engine-rest/process-definition/key/mein-prozess/start`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${keycloak.token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ variables: {} }),
});
```

```ts
// Offene Tasks des eingeloggten Nutzers abrufen
const tasks = await fetch(
  `${import.meta.env.VITE_CIBSEVEN_URL}/engine-rest/task?assignee=${keycloak.tokenParsed?.preferred_username}`,
  { headers: { Authorization: `Bearer ${keycloak.token}` } }
).then((r) => r.json());
```
