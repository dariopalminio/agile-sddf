#!/usr/bin/env node
/**
 * Migra el campo FINVEST retirado del cuerpo de `story.md` (STORY-090).
 *
 * Elimina el bloque de tres líneas que seguía al frontmatter:
 *
 *   ---                                  ← cierre del frontmatter
 *   **FINVEST Score:** <valor>
 *   **FINVEST Decisión:** <valor>
 *   ---                                  ← separador propio del bloque
 *
 * Variante tolerada (observada en el árbol): líneas en blanco entre el cierre del
 * frontmatter y el bloque, y bloque sin el `---` separador. Cualquier otra posición
 * del literal se reporta como FORMA INESPERADA y no se toca.
 *
 * Regla por historia (design.md › D3):
 *   - valores vacíos (grafías conocidas o cualquier `[placeholder]`)  → MIGRADA
 *   - dato real y existe finvest-evaluation-report.md en el directorio → MIGRADA
 *   - dato real sin reporte                                            → REQUIERE DECISIÓN (no se modifica)
 *   - sin bloque                                                       → SIN CAMBIOS
 *   - ilegible o sin frontmatter                                       → ERROR LECTURA
 *
 * El script nunca crea reportes ni acepta pérdidas: un dato real sin reporte se
 * perdería al borrar el bloque, así que se deja intacto y se resuelve a mano
 * (design.md › D4) antes de volver a ejecutar. Es idempotente: una segunda pasada
 * da 0 MIGRADA.
 *
 * Uso: node scripts/migrate-finvest-field.js [--dry-run] [--stories-dir <ruta>]
 *   --stories-dir  directorio de historias (defecto: docs/specs/03-stories)
 *   --dry-run      muestra la tabla sin escribir nada
 *
 * Exit code: 0 si no hubo REQUIERE DECISIÓN, FORMA INESPERADA ni ERROR LECTURA; 1 en caso contrario.
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const STORIES_DIR = resolveStoriesDir(process.argv);
const REPORT_FILE = 'finvest-evaluation-report.md';

const SCORE_RE = /^\*\*FINVEST Score:\*\*(.*)$/;
const DECISION_RE = /^\*\*FINVEST Decisi[oó]n:\*\*(.*)$/;
const LITERAL_RE = /^\*\*FINVEST /;

// Grafías de "vacío" observadas en el repositorio (comparación tras trim, insensible a
// mayúsculas). Cualquier texto entre `[` y `]` también cuenta como placeholder
// (`[FINVEST Score]`, `[pendiente — ejecutar /story-evaluation]`, …): ver isEmptyValue.
const EMPTY_VALUES = new Set(['', '—', '–', '-', 'pendiente']);
const PLACEHOLDER_RE = /^\[.*\]$/;

const RESULT = {
  MIGRADA: 'MIGRADA',
  SIN_CAMBIOS: 'SIN CAMBIOS',
  REQUIERE_DECISION: 'REQUIERE DECISIÓN',
  FORMA_INESPERADA: 'FORMA INESPERADA',
  ERROR_LECTURA: 'ERROR LECTURA',
};
// Resultados que dejan trabajo pendiente para una persona → exit 1.
const BLOCKING_RESULTS = [RESULT.REQUIERE_DECISION, RESULT.FORMA_INESPERADA, RESULT.ERROR_LECTURA];

function resolveStoriesDir(argv) {
  const idx = argv.indexOf('--stories-dir');
  const value = idx !== -1 ? argv[idx + 1] : undefined;
  if (idx !== -1 && (!value || value.startsWith('--'))) {
    console.error('[ERROR] --stories-dir requiere una ruta');
    process.exit(1);
  }
  return path.resolve(process.cwd(), value || path.join('docs', 'specs', '03-stories'));
}

function isEmptyValue(raw) {
  const value = raw.trim().toLowerCase();
  return EMPTY_VALUES.has(value) || PLACEHOLDER_RE.test(value);
}

/** Directorios STORY-* en orden alfabético, con la ruta de su story.md (exista o no). */
function listStories(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory() && /^STORY-/.test(e.name))
    .map(e => e.name)
    .sort()
    .map(name => ({
      id: (name.match(/^STORY-\d+/) || [name])[0],
      dir: path.join(dir, name),
      file: path.join(dir, name, 'story.md'),
    }));
}

/**
 * Clasifica un story.md y devuelve { result, score?, decision?, detail?, newContent? }.
 * `newContent` solo viene con MIGRADA; escribirlo es decisión de main (respeta --dry-run).
 */
function analyzeStory(story) {
  if (!fs.existsSync(story.file)) {
    return { result: RESULT.SIN_CAMBIOS, detail: 'sin story.md' };
  }
  let buffer;
  try {
    buffer = fs.readFileSync(story.file);
  } catch (err) {
    return { result: RESULT.ERROR_LECTURA, detail: err.message };
  }

  const hasBom = buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
  const text = buffer.toString('utf8').slice(hasBom ? 1 : 0);
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(eol);

  // Frontmatter: primera línea `---`, cierre en la siguiente `---`.
  if (lines[0].trim() !== '---') {
    return { result: RESULT.ERROR_LECTURA, detail: 'sin frontmatter' };
  }
  const fmClose = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
  if (fmClose === -1) {
    return { result: RESULT.ERROR_LECTURA, detail: 'frontmatter sin cierre' };
  }

  // Detección del bloque inmediatamente después del frontmatter (tolerando líneas en blanco).
  let j = fmClose + 1;
  while (j < lines.length && lines[j].trim() === '') j++;

  let block = null;
  const scoreMatch = j < lines.length ? lines[j].match(SCORE_RE) : null;
  const decisionMatch = scoreMatch && j + 1 < lines.length ? lines[j + 1].match(DECISION_RE) : null;
  if (scoreMatch && decisionMatch) {
    let end = j + 2; // exclusivo
    if (end < lines.length && lines[end].trim() === '---') end++;
    block = {
      start: fmClose + 1,
      end,
      score: scoreMatch[1].trim(),
      decision: decisionMatch[1].trim(),
    };
  }

  // Cualquier literal fuera del bloque → forma inesperada.
  for (let i = fmClose + 1; i < lines.length; i++) {
    if (block && i >= block.start && i < block.end) continue;
    if (LITERAL_RE.test(lines[i])) {
      return {
        result: RESULT.FORMA_INESPERADA,
        detail: `literal en línea ${i + 1}`,
        score: block ? block.score : '',
        decision: block ? block.decision : '',
      };
    }
  }

  if (!block) {
    return { result: RESULT.SIN_CAMBIOS, score: '', decision: '' };
  }

  const isReal = !isEmptyValue(block.score) || !isEmptyValue(block.decision);
  const hasReport = fs.existsSync(path.join(story.dir, REPORT_FILE));

  if (isReal && !hasReport) {
    return { result: RESULT.REQUIERE_DECISION, score: block.score, decision: block.decision };
  }

  const newLines = lines.slice(0, block.start).concat(lines.slice(block.end));
  const newText = (hasBom ? '\ufeff' : '') + newLines.join(eol);
  return {
    result: RESULT.MIGRADA,
    score: block.score,
    decision: block.decision,
    newContent: Buffer.from(newText, 'utf8'),
    detail: isReal ? `dato real preservado en ${REPORT_FILE}` : undefined,
  };
}

function pad(value, width) {
  return String(value).padEnd(width);
}

function main() {
  if (!fs.existsSync(STORIES_DIR) || !fs.statSync(STORIES_DIR).isDirectory()) {
    console.error(`[ERROR] Directorio de historias no encontrado: ${STORIES_DIR}`);
    process.exit(1);
  }

  const stories = listStories(STORIES_DIR);
  const rows = [];
  const counts = Object.fromEntries(Object.values(RESULT).map(r => [r, 0]));

  for (const story of stories) {
    let analysis;
    try {
      analysis = analyzeStory(story);
      if (analysis.result === RESULT.MIGRADA && !DRY_RUN) {
        fs.writeFileSync(story.file, analysis.newContent);
      }
    } catch (err) {
      analysis = { result: RESULT.ERROR_LECTURA, detail: err.message };
    }
    counts[analysis.result]++;
    rows.push({
      id: story.id,
      result: analysis.result,
      score: analysis.score || '',
      decision: analysis.decision || '',
      detail: analysis.detail || '',
    });
  }

  const wId = Math.max(2, ...rows.map(r => r.id.length));
  const wRes = Math.max(9, ...rows.map(r => r.result.length));
  const wScore = Math.max(5, ...rows.map(r => r.score.length));
  const wDec = Math.max(8, ...rows.map(r => r.decision.length));

  console.log(`Migración del campo FINVEST ${DRY_RUN ? '(dry-run — sin escribir) ' : ''}— ${path.relative(process.cwd(), STORIES_DIR).replace(/\\/g, '/') || '.'}`);
  console.log('');
  console.log(`${pad('ID', wId)} │ ${pad('resultado', wRes)} │ ${pad('Score', wScore)} │ ${pad('Decisión', wDec)}`);
  console.log(`${'─'.repeat(wId)}─┼─${'─'.repeat(wRes)}─┼─${'─'.repeat(wScore)}─┼─${'─'.repeat(wDec)}`);
  for (const r of rows) {
    const detail = r.detail ? `  (${r.detail})` : '';
    console.log(`${pad(r.id, wId)} │ ${pad(r.result, wRes)} │ ${pad(r.score, wScore)} │ ${pad(r.decision, wDec)}${detail}`);
  }

  console.log('');
  console.log(`── Resumen ${DRY_RUN ? '(dry-run) ' : ''}──────────────────────────`);
  console.log(`  Historias:          ${rows.length}`);
  console.log(`  MIGRADA:            ${counts[RESULT.MIGRADA]}`);
  console.log(`  SIN CAMBIOS:        ${counts[RESULT.SIN_CAMBIOS]}`);
  console.log(`  REQUIERE DECISIÓN:  ${counts[RESULT.REQUIERE_DECISION]}`);
  console.log(`  FORMA INESPERADA:   ${counts[RESULT.FORMA_INESPERADA]}`);
  console.log(`  ERROR LECTURA:      ${counts[RESULT.ERROR_LECTURA]}`);
  console.log(`──────────────────────────────────────────`);

  const blocked = BLOCKING_RESULTS.reduce((sum, r) => sum + counts[r], 0);
  process.exit(blocked > 0 ? 1 : 0);
}

main();
