#!/usr/bin/env node
/**
 * Prüft alle Mermaid-Diagramme unter docs/ gegen den echten Mermaid-Parser.
 *
 * Notwendig, weil Mermaid im Browser rendert und nicht beim Build: Ein
 * Syntaxfehler lässt `npm run build` grün durchlaufen und zeigt sich erst
 * als Fehlerkasten auf der fertigen Seite.
 *
 * Mermaid zieht DOMPurify nach, das ein DOM voraussetzt. Deshalb wird jsdom
 * aufgesetzt, bevor mermaid importiert wird.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const docsDir = join(root, 'docs');

/** Alle Markdown- und MDX-Dateien unterhalb von dir. */
function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

/** Alle Mermaid-Blöcke einer Datei, mit Zeilennummer des öffnenden Zauns. */
function mermaidBlocks(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const blocks = [];
  let start = -1;
  lines.forEach((line, i) => {
    if (start === -1 && line.trim() === '```mermaid') {
      start = i;
    } else if (start !== -1 && line.trim() === '```') {
      blocks.push({ line: start + 1, code: lines.slice(start + 1, i).join('\n') });
      start = -1;
    }
  });
  return blocks;
}

// DOM bereitstellen, bevor mermaid geladen wird.
const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.DOMParser = dom.window.DOMParser;
globalThis.Node = dom.window.Node;
globalThis.Element = dom.window.Element;
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
});

const mermaid = (await import('mermaid')).default;
mermaid.initialize({ startOnLoad: false });

let total = 0;
let failed = 0;

for (const file of markdownFiles(docsDir)) {
  for (const block of mermaidBlocks(file)) {
    total++;
    const where = `${relative(root, file)}:${block.line}`;
    try {
      await mermaid.parse(block.code);
    } catch (error) {
      failed++;
      console.error(`FEHLER  ${where}\n        ${error.message.replace(/\n/g, '\n        ')}`);
    }
  }
}

if (failed > 0) {
  console.error(`\n${total} Diagramme geprüft, ${failed} fehlerhaft.`);
  process.exit(1);
}

console.log(`${total} Diagramme geprüft, alle in Ordnung.`);
