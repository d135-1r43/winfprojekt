import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'WInf Projekt Markus Herhoffer',
  tagline: 'Dokumentation für Studierende BA/MA der Technischen Hochschule Ingolstadt',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://d135-1r43.github.io',
  baseUrl: '/winfprojekt/',

  organizationName: 'd135-1r43',
  projectName: 'winfprojekt',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/d135-1r43/winfprojekt/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WInf Projekt',
      logo: {
        alt: 'THI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'methodik',
          position: 'left',
          label: 'Methodik',
        },
        {
          type: 'docSidebar',
          sidebarId: 'technik',
          position: 'left',
          label: 'Technik',
        },
        {
          href: 'https://github.com/d135-1r43/winfprojekt',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Methodik',
          items: [
            {
              label: 'Übersicht',
              to: '/docs/methodik',
            },
          ],
        },
        {
          title: 'Technik',
          items: [
            {
              label: 'Übersicht',
              to: '/docs/technik',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/d135-1r43/winfprojekt',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} <a href="https://herhoffer.net" target="_blank" rel="noopener noreferrer">Markus Herhoffer</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
