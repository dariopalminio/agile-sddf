'use strict';

/**
 * Tests de STORY-190 (C-6, D-02, V-1): contrato de la plantilla común de `fix-directives.md`.
 * `docs/templates/fix-directives-template.md` es la fuente única (ADR-0022) y los tres gates que
 * escriben `fix-directives.md` (`story-code-review`, `story-verify`, `story-acceptance`) llevan en
 * `assets/` una copia semilla idéntica byte a byte, que usan si falta la central.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const CENTRAL = path.join(REPO_ROOT, 'docs', 'templates', 'fix-directives-template.md');
const GATES = ['story-code-review', 'story-verify', 'story-acceptance'];
const SEEDS = GATES.map((skill) => path.join(REPO_ROOT, 'skills', skill, 'assets', 'fix-directives-template.md'));
const HEADINGS = [
  '## Resumen de bloqueantes',
  '## Instrucciones de corrección',
  '## Lista blanca de archivos permitidos para modificar',
  '## Ciclo de corrección',
];
const TABLE_HEADER = '| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |';
const REPORTS = ['code-review-report.md', 'verify-report.md', 'acceptance-report.md'];
// Reglas de EPIC-28 que la plantilla no escribe literalmente (TC-031 a TC-033 y TC-037 de story-code-review).
const FORBIDDEN = ['PREEXISTENTE', 'no verificado', 'Reportado por:', 'fusionado'];

const read = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
const frontmatter = (text) => (text.match(/^---\n([\s\S]*?)\n---\n/) || [null, ''])[1];

test('la plantilla central existe en docs/templates/', () => {
  assert.ok(fs.existsSync(CENTRAL), 'falta docs/templates/fix-directives-template.md');
});

for (const [index, seed] of SEEDS.entries()) {
  test(`la semilla de ${GATES[index]} es idéntica byte a byte a la central`, () => {
    assert.ok(fs.existsSync(seed), `falta ${path.relative(REPO_ROOT, seed)}`);
    assert.ok(fs.readFileSync(seed).equals(fs.readFileSync(CENTRAL)), `${path.relative(REPO_ROOT, seed)} difiere de la central`);
  });
}

test('based-on es el placeholder {{BASED_ON}} y no hay un reporte literal', () => {
  const text = read(CENTRAL);
  const fm = frontmatter(text);
  assert.match(fm, /^type: fix-directives$/m);
  assert.match(fm, /^round: \{\{ROUND\}\}$/m);
  assert.match(fm, /^based-on: \{\{BASED_ON\}\}$/m);
  assert.equal((text.match(/based-on:/g) || []).length, 1, 'based-on aparece más de una vez');
  for (const report of REPORTS) assert.ok(!text.includes(report), `reporte literal en la plantilla: ${report}`);
  assert.ok(text.includes('**Veredicto de origen:** `NEEDS-CHANGES` (`{{BASED_ON}}`)'));
});

test('cuatro secciones ## en orden y la tabla de seis columnas', () => {
  const text = read(CENTRAL);
  const positions = HEADINGS.map((heading) => text.split('\n').indexOf(heading));
  for (const [i, pos] of positions.entries()) assert.ok(pos >= 0, `falta ${HEADINGS[i]}`);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, 'las secciones no están en orden');
  assert.ok(text.split('\n').includes(TABLE_HEADER), 'falta la cabecera de la tabla de instrucciones');
  for (const placeholder of ['{{INSTRUCTIONS_TABLE}}', '{{WHITELIST}}', '{{TOTAL_BLOCKING}}', '{{MAX_SEVERITY}}', '{{STORY_TITLE}}']) {
    assert.ok(text.includes(placeholder), `falta ${placeholder}`);
  }
});

test('la plantilla no escribe literalmente las reglas de filas de EPIC-28', () => {
  const text = read(CENTRAL);
  for (const word of FORBIDDEN) assert.ok(!text.includes(word), `la plantilla contiene «${word}»`);
});

test('ningún archivo empieza por BOM ni contiene U+FEFF', () => {
  for (const file of [CENTRAL, ...SEEDS]) {
    if (!fs.existsSync(file)) continue;
    const bytes = fs.readFileSync(file);
    assert.ok(!(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf), `${path.relative(REPO_ROOT, file)} empieza por BOM`);
    assert.ok(!bytes.toString('utf8').includes(String.fromCharCode(0xfeff)), `${path.relative(REPO_ROOT, file)} contiene U+FEFF`);
  }
});
