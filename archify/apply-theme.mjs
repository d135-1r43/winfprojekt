// Fügt winf-theme.css in ein von Archify erzeugtes HTML ein.
// Aufruf nach `archify finalize`: node archify/apply-theme.mjs <diagramm.html>
// Mehrfaches Ausführen ersetzt den vorhandenen Block, statt ihn zu verdoppeln.
import { readFileSync, writeFileSync } from 'node:fs';

const target = process.argv[2];
if (!target) {
  console.error('Aufruf: node archify/apply-theme.mjs <diagramm.html>');
  process.exit(1);
}

const css = readFileSync(new URL('./winf-theme.css', import.meta.url), 'utf8');
const block = `<style id="winf-theme">\n${css}</style>\n`;

let html = readFileSync(target, 'utf8').replace(/<style id="winf-theme">[\s\S]*?<\/style>\n/, '');
if (!html.includes('</head>')) {
  console.error(`${target}: kein </head> gefunden`);
  process.exit(1);
}
html = html.replace('</head>', `${block}</head>`);
writeFileSync(target, html);
console.log(`Theme eingefügt: ${target}`);
