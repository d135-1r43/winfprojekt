import type {ReactNode} from 'react';
import styles from './styles.module.css';

// Endzustand des "Bauplans" aus slides/architektur.html (Folie "Alles zusammen").
// Koordinaten und Beschriftungen bei Änderungen in beiden Dateien angleichen.

type NodeProps = {
  kind: 'front' | 'back' | 'db' | 'proxy' | 'sec' | 'ext';
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  info: string;
};

function Node({kind, x, y, w, h, title, sub, info}: NodeProps): ReactNode {
  const cx = x + w / 2;
  return (
    <g className={`${styles.node} ${styles[kind]}`} tabIndex={0}>
      <title>{`${title}: ${info}`}</title>
      <rect x={x} y={y} width={w} height={h} rx={12} />
      <text x={cx} y={y + h / 2 - 9}>{title}</text>
      <text className={styles.sub} x={cx} y={y + h / 2 + 13}>{sub}</text>
    </g>
  );
}

function Label({x, y, w, text}: {x: number; y: number; w: number; text: string}): ReactNode {
  return (
    <g className={styles.elabel}>
      <rect x={x - w / 2} y={y - 12} width={w} height={24} rx={6} />
      <text x={x} y={y}>{text}</text>
    </g>
  );
}

export default function ArchitekturDiagramm(): ReactNode {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox="-24 0 768 760"
        role="img"
        aria-label="Systemarchitektur: Browser, Nginx Proxy Manager, React SPA, CIB seven als Orchestrator zwischen zwei Microservices mit je eigener PostgreSQL-Datenbank, Keycloak als Identity Provider">
        <defs>
          <marker id="ad-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className={styles.mArrow} />
          </marker>
          <marker id="ad-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className={styles.mMain} />
          </marker>
          <marker id="ad-ars" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className={styles.mSec} />
          </marker>
        </defs>

        <g className={styles.zone}>
          <rect x={-14} y={104} width={748} height={636} rx={18} />
          <text x={6} y={728}>Server · Docker-Container · Portainer</text>
        </g>

        <path className={`${styles.edge} ${styles.main}`} d="M360 76 V118" markerEnd="url(#ad-arp)" />
        <path className={`${styles.edge} ${styles.main}`} d="M360 176 V228" markerEnd="url(#ad-arp)" />
        <path className={styles.edge} d="M260 262 H115 V398" markerEnd="url(#ad-ar)" />
        <path className={styles.edge} d="M460 252 H605 V398" markerEnd="url(#ad-ar)" />
        <path className={`${styles.edge} ${styles.main}`} d="M360 294 V398" markerEnd="url(#ad-arp)" />
        <path className={`${styles.edge} ${styles.main}`} d="M253 432 H224" markerEnd="url(#ad-arp)" />
        <path className={`${styles.edge} ${styles.main}`} d="M467 432 H496" markerEnd="url(#ad-arp)" />
        <path className={styles.edge} d="M83 464 V526" markerEnd="url(#ad-ar)" />
        <path className={styles.edge} d="M637 464 V526" markerEnd="url(#ad-ar)" />
        <path className={`${styles.edge} ${styles.sec}`} d="M192 464 V670 H248" markerEnd="url(#ad-ars)" />
        <path className={`${styles.edge} ${styles.sec}`} d="M528 464 V690 H472" markerEnd="url(#ad-ars)" />
        <path className={`${styles.edge} ${styles.sec}`} d="M360 464 V638" markerEnd="url(#ad-ars)" />
        <path className={`${styles.edge} ${styles.sec}`} d="M460 280 H486 V652 H472" markerEnd="url(#ad-ars)" />

        <Label x={188} y={262} w={92} text="Fachdaten" />
        <Label x={536} y={252} w={92} text="Fachdaten" />
        <Label x={360} y={346} w={156} text="Prozess · Tasks" />
        <Label x={139} y={496} w={52} text="JDBC" />
        <Label x={581} y={496} w={52} text="JDBC" />
        <Label x={396} y={571} w={56} text="JWKS" />
        <Label x={517} y={571} w={58} text="Login" />

        <Node kind="ext" x={230} y={16} w={260} h={60} title="Browser" sub="Mitarbeiterin · Teamleitung"
          info="Hier läuft die SPA. Alles, was von hier kommt, kommt von außen." />
        <Node kind="proxy" x={220} y={120} w={280} h={56} title="Nginx Proxy Manager" sub="TLS · Subdomains"
          info="Einziger öffentlicher Endpunkt. TLS mit Let's Encrypt, Weiterleitung per Subdomain." />
        <Node kind="front" x={260} y={230} w={200} h={64} title="React SPA" sub="Vite · keycloak-js"
          info="Wird einmal ausgeliefert und läuft dann im Browser. Spricht per REST mit Services und CIB seven." />
        <Node kind="back" x={8} y={400} w={214} h={64} title="Urlaubs-Service" sub="Quarkus · Anträge"
          info="Besitzt die Anträge und bietet sie als REST-API an." />
        <Node kind="back" x={253} y={400} w={214} h={64} title="CIB seven" sub="BPMN · Orchestrator"
          info="Zentrale BPMN-Engine. Hält den Prozesszustand und ruft in Service Tasks die Microservices auf." />
        <Node kind="back" x={498} y={400} w={214} h={64} title="Mitarbeiter-Service" sub="Quarkus · Resturlaub"
          info="Besitzt Mitarbeitende, Teams und Resturlaub." />
        <Node kind="db" x={8} y={528} w={150} h={56} title="PostgreSQL" sub="Anträge"
          info="Datenbank des Urlaubs-Service. Nur im internen Netz erreichbar." />
        <Node kind="db" x={562} y={528} w={150} h={56} title="PostgreSQL" sub="Mitarbeitende"
          info="Datenbank des Mitarbeiter-Service. Kein anderer Service greift direkt darauf zu." />
        <Node kind="sec" x={250} y={640} w={220} h={64} title="Keycloak" sub="OIDC · stellt JWTs aus"
          info="Identity Provider. Login, Rollen, JWT-Ausgabe nach OpenID Connect." />
      </svg>
    </figure>
  );
}
