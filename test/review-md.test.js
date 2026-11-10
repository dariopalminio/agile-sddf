'use strict';

/**
 * Tests de STORY-179: forma de `REVIEW.md`, la guía de revisión de agile-sddf (ADR-0021).
 * Cubre las ocho aserciones de D-7 de `design.md`: estructura de la plantilla (I-1), áreas de
 * «Qué es «Importante» aquí» (I-2), tope de Minor, una regla por sección (I-4, D-3), doble
 * vocabulario (I-3), rutas citadas que existen o están ignoradas (I-5, D-8), no publicación
 * (CNF-2) y codificación sin BOM ni caracteres invisibles (CNF-3). Solo lee archivos del repo.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const REPO_ROOT = path.join(__dirname, '..');
const REVIEW_PATH = path.join(REPO_ROOT, 'REVIEW.md');

const H1 = '# REVIEW.md — Guía de revisión de agile-sddf';
const IMPORTANT = 'Qué es «Importante» aquí — 🔴 Important · HIGH/MEDIUM';
const MINOR_CAP = 'Tope de Minor — 🟡 Minor · LOW';
const DO_NOT_REPORT = 'No reportar';
const ALWAYS_CHECK = 'Verificar siempre';
const HEADINGS = [IMPORTANT, MINOR_CAP, DO_NOT_REPORT, ALWAYS_CHECK];

const AREA_PREFIXES = ['- `skills/`', '- `scripts/`', '- `docs/adr/`', '- `docs/templates/`', '- `docs/guardrails/`', '- Cualquier archivo'];

// D-3: marcador literal de cada regla de AC-2 → única sección donde puede aparecer.
const RULE_MARKERS = [
  ['delega en otro subagente', IMPORTANT],
  ['fuera de la ruta de', IMPORTANT],
  ['in place', IMPORTANT],
  ['skills/*/examples/', DO_NOT_REPORT],
  ['fuente de reglas', DO_NOT_REPORT],
  ['ai-no-hidden-characters', ALWAYS_CHECK],
  ['evals/evals.json', ALWAYS_CHECK],
];

// I-3: término de Claude Code Review → traducción de ADR-0021, unidos por " = ", " · " o " (".
const VOCABULARY = [
  ['🔴 Important', 'HIGH/MEDIUM'],
  ['🟡 Minor', 'LOW'],
  ['🟣 Pre-existing', 'PREEXISTENTE'],
];

// Code points de `ai-no-hidden-characters` (docs/guardrails/gr-ai-security-checklist.md), siempre como escapes.
const HIDDEN_CHARACTERS = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF\u{E0000}-\u{E007F}]|\u001B\[/u;

function load() {
  return fs.readFileSync(REVIEW_PATH, 'utf8');
}

/** Divide el texto en la introducción (antes del primer `##`) y una entrada por encabezado `##`. */
function sections(text) {
  const result = [{ heading: null, lines: [] }];
  for (const line of text.split(/\r?\n/)) {
    const heading = /^## (.+)$/.exec(line);
    if (heading) result.push({ heading: heading[1], lines: [] });
    else result[result.length - 1].lines.push(line);
  }
  return result;
}

function sectionText(text, heading) {
  const found = sections(text).find((section) => section.heading === heading);
  assert.ok(found, `sección "${heading}" presente`);
  return found.lines.join('\n');
}

function count(text, needle) {
  return text.split(needle).length - 1;
}

test('REVIEW.md: H1, encabezados de la plantilla en orden, sin comentarios ni placeholders (I-1, AC-1)', () => {
  const text = load();
  const lines = text.split(/\r?\n/);
  assert.equal(lines.find((line) => line.trim() !== ''), H1, 'H1 exacto como primera línea');
  const template = fs.readFileSync(path.join(REPO_ROOT, 'docs', 'templates', 'REVIEW-template.md'), 'utf8').split(/\r?\n/);
  for (const intro of template.filter((line) => /^(Esta guía decide|Vocabulario:)/.test(line))) {
    assert.ok(lines.includes(intro), `línea de introducción de la plantilla sin cambios: ${intro}`);
  }
  assert.deepEqual(sections(text).slice(1).map((section) => section.heading), HEADINGS, 'exactamente los cuatro ## de la plantilla, en orden');
  assert.equal(text.includes('<!--'), false, 'sin comentarios HTML');
  const placeholders = [...text.matchAll(/\[([^\]]*)\](?!\()/g)].map((match) => match[0]).filter((match) => !/^\[[ xX]\]$/.test(match));
  assert.deepEqual(placeholders, [], 'sin placeholders entre corchetes');
});

test('REVIEW.md: seis viñetas de área en «Qué es «Importante» aquí», en orden (I-2, AC-1)', () => {
  const bullets = sectionText(load(), IMPORTANT).split('\n').filter((line) => line.startsWith('- '));
  assert.equal(bullets.length, AREA_PREFIXES.length, 'seis viñetas de primer nivel');
  AREA_PREFIXES.forEach((prefix, index) => assert.ok(bullets[index].startsWith(prefix), `viñeta ${index + 1} empieza por ${prefix}`));
});

test('REVIEW.md: «Tope de Minor» fija un máximo de 5 LOW por revisor (AC-1)', () => {
  assert.ok(sectionText(load(), MINOR_CAP).includes('Máximo **5**'), 'tope de 5');
});

test('REVIEW.md: cada regla de AC-2 aparece en una sola sección, la indicada (I-4, D-3)', () => {
  const all = sections(load());
  for (const [marker, expected] of RULE_MARKERS) {
    const where = all.filter((section) => section.lines.join('\n').includes(marker)).map((section) => section.heading);
    assert.deepEqual(where, [expected], `"${marker}" solo en "${expected}"`);
  }
});

test('REVIEW.md: doble vocabulario en cada sección y ningún término sin traducción (I-3, CNF-1)', () => {
  const text = load();
  const paired = (body, term, translation) => count(body, `${term} = ${translation}`) + count(body, `${term} · ${translation}`) + count(body, `${term} (${translation}`);
  for (const section of sections(text)) {
    const body = (section.heading ? `## ${section.heading}\n` : '') + section.lines.join('\n');
    let pairs = 0;
    for (const [term, translation] of VOCABULARY) {
      const found = paired(body, term, translation);
      assert.equal(count(body, term), found, `"${section.heading || 'introducción'}": cada "${term}" va con "${translation}"`);
      pairs += found;
    }
    if (section.heading) assert.ok(pairs > 0, `"${section.heading}": al menos un par término-traducción`);
  }
});

test('REVIEW.md: toda ruta citada existe o está ignorada por git (I-5, D-8, AC-3)', () => {
  const spans = [...load().matchAll(/`([^`\s]+)`/g)].map((match) => match[1]);
  const paths = [...new Set(spans.filter((span) => span.includes('/') && !span.startsWith('/') && !span.includes('://')))];
  assert.ok(paths.length > 0, 'hay rutas citadas');
  const missing = [];
  for (const cited of paths) {
    const candidate = cited.includes('*') ? cited.slice(0, cited.indexOf('*')) : cited;
    if (fs.existsSync(path.join(REPO_ROOT, candidate))) continue;
    const ignored = spawnSync('git', ['check-ignore', '-q', candidate], { cwd: REPO_ROOT, encoding: 'utf8' });
    if (ignored.status === 0) continue;
    missing.push(ignored.status === 1 ? cited : `${cited} (git check-ignore no disponible: ${ignored.error ? ignored.error.message : ignored.stderr.trim()})`);
  }
  assert.deepEqual(missing, [], 'rutas citadas que no existen ni están ignoradas');
});

test('REVIEW.md: package.json › files no lo publica (CNF-2)', () => {
  const { files } = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  const reaching = files.filter((entry) => ['REVIEW.md', '/REVIEW.md', '*.md', '*', '**', '/', '.', './'].includes(entry.trim()));
  assert.deepEqual(reaching, [], 'ninguna entrada de files alcanza a REVIEW.md');
});

test('REVIEW.md: UTF-8 sin BOM y sin caracteres invisibles, ni en la guía ni en esta prueba (CNF-3)', () => {
  for (const file of [REVIEW_PATH, __filename]) {
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])), false, `${file}: sin BOM`);
    assert.equal(HIDDEN_CHARACTERS.test(bytes.toString('utf8')), false, `${file}: sin code points de ai-no-hidden-characters`);
  }
});
