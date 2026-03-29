import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function SectionCard({title, imgPath, description, to}: {
  title: string;
  imgPath: string;
  description: string;
  to: string;
}) {
  const imgSrc = useBaseUrl(imgPath);
  return (
    <Link to={to} className={styles.card}>
      <img src={imgSrc} alt={title} className={styles.cardImage} />
      <div className={styles.cardBody}>
        <Heading as="h2">{title}</Heading>
        <p>{description}</p>
      </div>
    </Link>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Projektdokumentation für Studierende der THI">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
      <main className={styles.main}>
        <div className={clsx('container', styles.cards)}>
          <SectionCard
            title="Methodik"
            imgPath="/img/development-software-07-presentation.png"
            description="Vorgehensmodelle, Projektmanagement und wissenschaftliches Arbeiten."
            to="/docs/methodik"
          />
          <SectionCard
            title="Technik"
            imgPath="/img/development-software-10-start-power-button.png"
            description="Technologien, Architekturen und technische Grundlagen des Projekts."
            to="/docs/technik"
          />
        </div>
        <div className={clsx('container', styles.author)}>
          <a href="https://herhoffer.net" target="_blank" rel="noopener noreferrer" className={styles.authorLink}>
            <img
              src="https://herhoffer.net/assets/images/profile.jpg"
              alt="Markus Herhoffer"
              className={styles.authorAvatar}
            />
            <div>
              <div className={styles.authorName}>Markus Herhoffer</div>
              <div className={styles.authorMeta}>Gastdozent THI · CTO <a href="https://explore.de" target="_blank" rel="noopener noreferrer">explore.de</a></div>
            </div>
          </a>
        </div>
      </main>
    </Layout>
  );
}
