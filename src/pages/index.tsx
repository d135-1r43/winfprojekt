import type {CSSProperties, PointerEvent, ReactNode} from 'react';
import {useRef} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function SectionCard({title, imgPath, topics, description, to, delay}: {
  title: string;
  imgPath: string;
  topics: string[];
  description: string;
  to: string;
  delay: number;
}) {
  const imgSrc = useBaseUrl(imgPath);
  return (
    <Link
      to={to}
      className={styles.card}
      data-spotlight
      style={{'--delay': `${delay}s`} as CSSProperties}>
      <div className={styles.cardArt}>
        <img src={imgSrc} alt="" className={styles.cardImage} />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.tag}>{topics.join(' · ')}</span>
        <Heading as="h2" className={styles.cardTitle}>{title}</Heading>
        <p>{description}</p>
        <span className={styles.cardCta}>
          Zur Übersicht <span className={styles.arrow} aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const heroImg = useBaseUrl('/img/development-software-09-teamwork-videoconferencing.png');
  const heroRef = useRef<HTMLElement>(null);

  // Leichte Parallaxe: Illustration folgt dem Mauszeiger
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--px', ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    hero.style.setProperty('--py', ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  };

  return (
    <Layout
      title={siteConfig.title}
      description="Projektdokumentation für Studierende der THI">
      <header ref={heroRef} className={styles.hero} onPointerMove={onPointerMove}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.eyebrow}>
              <span className={styles.hex} />
              Technische Hochschule Ingolstadt · BA/MA
            </div>
            <Heading as="h1" className={styles.title}>
              WInf Projekt<span>.</span>
            </Heading>
            <p className={styles.lead}>
              Alles für dein Projekt: vom Vorgehen im Team bis zum Deployment auf
              dem Server.
            </p>
            <p className={styles.meta}>
              Suchen mit <kbd>Strg</kbd> <kbd>K</kbd> oder <kbd>⌘</kbd> <kbd>K</kbd> · von Markus Herhoffer
            </p>
          </div>
          <div className={styles.heroArt} aria-hidden>
            <img src={heroImg} alt="" />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.cards}>
          <SectionCard
            title="Methodik"
            imgPath="/img/development-software-07-presentation.png"
            topics={['Scrum', 'User Stories', 'BPMN']}
            description="Vorgehensmodelle, Projektmanagement und wissenschaftliches Arbeiten."
            to="/docs/methodik"
            delay={0.45}
          />
          <SectionCard
            title="Technik"
            imgPath="/img/development-software-10-start-power-button.png"
            topics={['Quarkus', 'Keycloak', 'Deployment']}
            description="Technologien, Architekturen und technische Grundlagen des Projekts."
            to="/docs/technik"
            delay={0.55}
          />
        </div>

        <a className={styles.slides} href={useBaseUrl('/slides/architektur.html')} data-spotlight>
          <span className={styles.slidesThumb} aria-hidden>
            <span className={styles.slidesBar}>
              <i /><i /><i /><i /><i />
            </span>
          </span>
          <span className={styles.slidesText}>
            <span className={styles.tag}>Präsentation</span>
            <strong>Systemarchitektur</strong>
            <span>Vom Browser bis zum Server, Schritt für Schritt an einem durchgehenden Beispiel.</span>
          </span>
          <span className={styles.slidesCta}>
            Öffnen <span className={styles.arrow} aria-hidden>→</span>
          </span>
        </a>
      </main>
    </Layout>
  );
}
