#!/usr/bin/env node
'use strict';

/**
 * Motor de huellas de LOW de story-code-review (STORY-185).
 *
 * Al cerrar cada revisión, `record` guarda en `code-review-lows.json` la huella de contenido de las
 * líneas que cita cada LOW mostrado (o omitido por arrastre). En la ronda siguiente, `compare` busca
 * esa huella en el working tree y clasifica cada entrada del registro:
 *
 *   - `unchanged` — un único bloque con la misma huella, en la misma posición
 *   - `moved`     — un único bloque con la misma huella, en otra posición
 *   - `changed`   — ningún bloque coincide, o coinciden dos o más
 *   - `unknown`   — el archivo no existe o la ubicación no se puede leer
 *
 * Invariante: nunca devuelve `unchanged` ni `moved` sin una única coincidencia exacta. Ante cualquier
 * duda, el árbitro (Paso 4a.5 de SKILL.md) muestra el LOW. No usa git.
 *
 * Huella: SHA-256 (16 primeros hex) de las líneas sin `\r` ni espacio en blanco final, unidas con `\n`.
 *
 * Uso: node low-ledger.js compare --repo-root <dir> --ledger <code-review-lows.json> --locations <archivo.json>
 *      <archivo.json>: arreglo JSON de cadenas `Archivo:Línea` de los LOW de esta ronda.
 *      Salida: { ok, applied, reason, message, entries: [ { id, reviewer, location, description, status, current } ],
 *                locations: [ { location, overlaps: [ <id> ] } ] }. No escribe archivos.
 *
 *      node low-ledger.js record --repo-root <dir> --lows <archivo.json> --out <code-review-lows.json>
 *      <archivo.json>: arreglo JSON de { reviewer, location, description }.
 *      Salida: { ok: true, written, skipped: [ { location, why } ] }. Reemplaza `--out` completo.
 *
 * Exit code: 0 siempre que se emita el JSON (también con `applied: false`); 2 ante argumentos
 * inválidos, JSON ilegible o `--out` fuera de `--repo-root` (error en stderr).
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { parseLocation } = require('./touched-lines.js');

const VERSION = 1;

const MESSAGES = {
  'no-ledger': 'no existe code-review-lows.json de la revisión anterior',
  'invalid-ledger': 'code-review-lows.json ilegible o de una versión desconocida',
};

const formatLocation = ({ file, start, end }) => `${file}:${start}-${end}`;

/** Huella de contenido de un bloque de líneas (D-1): ignora CRLF y espacio final; respeta la sangría. */
function fingerprint(lines) {
  const normalized = lines.map((line) => String(line).replace(/\s+$/, '')).join('\n');
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex').slice(0, 16);
}

/** Líneas del archivo `file` relativo a `repoRoot`, o `null` si no existe o no es un archivo. */
function readFileLines(repoRoot, file) {
  const absolute = path.join(repoRoot, ...file.split('/'));
  let text;
  try {
    if (!fs.statSync(absolute).isFile()) return null;
    text = fs.readFileSync(absolute, 'utf8');
  } catch {
    return null;
  }
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * Estado de una entrada del registro frente a las líneas actuales de su archivo (D-3). `fileLines`
 * es `null` si el archivo no existe. Se cuentan todas las coincidencias antes de decidir.
 */
function locateEntry(fileLines, entry) {
  const parsed = parseLocation(entry && entry.location);
  if (!parsed || !Array.isArray(fileLines)) return { status: 'unknown', current: null };
  const size = parsed.end - parsed.start + 1;
  const matches = [];
  for (let i = 0; i + size <= fileLines.length; i += 1) {
    if (fingerprint(fileLines.slice(i, i + size)) === entry.hash) matches.push(i + 1);
  }
  if (matches.length !== 1) return { status: 'changed', current: null };
  const start = matches[0];
  const current = formatLocation({ file: parsed.file, start, end: start + size - 1 });
  return { status: start === parsed.start ? 'unchanged' : 'moved', current };
}

/** Registro nuevo con las huellas de `lows` (I-4); las ubicaciones no comprobables van a `skipped`. */
function recordLedger({ repoRoot, lows, date = new Date().toISOString().slice(0, 10) }) {
  const entries = [];
  const skipped = [];
  for (const item of lows) {
    const parsed = parseLocation(item.location);
    if (!parsed) {
      skipped.push({ location: item.location, why: 'ubicación ilegible: se esperaba <ruta>:<N> o <ruta>:<N>-<M> relativa' });
      continue;
    }
    const lines = readFileLines(repoRoot, parsed.file);
    if (!lines) {
      skipped.push({ location: item.location, why: 'archivo no encontrado' });
      continue;
    }
    if (parsed.end > lines.length) {
      skipped.push({ location: item.location, why: 'el rango supera el final del archivo' });
      continue;
    }
    entries.push({
      id: `L${entries.length + 1}`,
      reviewer: item.reviewer,
      location: formatLocation(parsed),
      description: item.description,
      hash: fingerprint(lines.slice(parsed.start - 1, parsed.end)),
    });
  }
  return { ledger: { version: VERSION, generated: date, entries }, skipped };
}

function notApplied(reason) {
  return { ok: true, applied: false, reason, message: MESSAGES[reason], entries: [], locations: [] };
}

const isString = (value) => typeof value === 'string';
const validEntry = (e) => e && ['id', 'reviewer', 'location', 'description', 'hash'].every((key) => isString(e[key]));

/** Lee el registro de `ledgerPath`: `{ ledger }` o `{ reason }` (`no-ledger` | `invalid-ledger`). */
function readLedger(ledgerPath) {
  if (!ledgerPath || !fs.existsSync(ledgerPath)) return { reason: 'no-ledger' };
  let data;
  try {
    data = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  } catch {
    return { reason: 'invalid-ledger' };
  }
  if (!data || data.version !== VERSION || !Array.isArray(data.entries) || !data.entries.every(validEntry)) {
    return { reason: 'invalid-ledger' };
  }
  return { ledger: data };
}

const overlapsRange = (a, b) => a.file === b.file && a.start <= b.end && b.start <= a.end;

/** Compara el registro de `ledger` (ruta) con el working tree de `repoRoot` (I-3, I-5). */
function compareLedger({ repoRoot, ledger, locations }) {
  const read = readLedger(ledger);
  if (read.reason) return notApplied(read.reason);

  const cache = new Map();
  const linesOf = (file) => {
    if (!cache.has(file)) cache.set(file, readFileLines(repoRoot, file));
    return cache.get(file);
  };
  const entries = read.ledger.entries.map((entry) => {
    const parsed = parseLocation(entry.location);
    const { status, current } = locateEntry(parsed ? linesOf(parsed.file) : null, entry);
    return { id: entry.id, reviewer: entry.reviewer, location: entry.location, description: entry.description, status, current };
  });

  const found = entries
    .filter((entry) => entry.status === 'unchanged' || entry.status === 'moved')
    .map((entry) => ({ id: entry.id, range: parseLocation(entry.current) }));
  const result = locations.map((location) => {
    const parsed = parseLocation(location);
    const overlaps = parsed ? found.filter((f) => overlapsRange(parsed, f.range)).map((f) => f.id) : [];
    return { location, overlaps };
  });

  return { ok: true, applied: true, reason: null, message: null, entries, locations: result };
}

function fail(message) {
  process.stderr.write(`low-ledger: ${message}\n`);
  process.exit(2);
}

const OPTIONS = {
  compare: ['--repo-root', '--ledger', '--locations'],
  record: ['--repo-root', '--lows', '--out'],
};
const USAGE = 'uso: compare --repo-root <dir> --ledger <archivo> --locations <archivo.json> | record --repo-root <dir> --lows <archivo.json> --out <archivo>';

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!OPTIONS[command]) fail(`subcomando desconocido: ${command || '(ninguno)'}; ${USAGE}`);
  const options = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (!OPTIONS[command].includes(rest[i]) || rest[i + 1] === undefined) fail(`argumento inválido: ${rest[i]}`);
    options[rest[i].slice(2)] = rest[i + 1];
  }
  for (const flag of OPTIONS[command]) if (!options[flag.slice(2)]) fail(`falta ${flag}`);
  return { command, options };
}

function readJsonArray(file, isItem, shape) {
  // Los mensajes nombran solo el archivo, nunca la ruta absoluta del host.
  const name = path.basename(file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`no se pudo leer ${name} como JSON (${error.code || error.name})`);
  }
  if (!Array.isArray(data) || !data.every(isItem)) fail(`${name} no es un arreglo JSON de ${shape}`);
  return data;
}

const isLow = (item) => item && ['reviewer', 'location', 'description'].every((key) => isString(item[key]));

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function main(argv) {
  const { command, options } = parseArgs(argv);
  const repoRoot = path.resolve(options['repo-root']);
  let result;
  if (command === 'compare') {
    const locations = readJsonArray(options.locations, isString, 'cadenas');
    result = compareLedger({ repoRoot, ledger: path.resolve(options.ledger), locations });
  } else {
    const out = path.resolve(options.out);
    if (!isInside(repoRoot, out)) fail('--out queda fuera de --repo-root');
    const lows = readJsonArray(options.lows, isLow, 'objetos { reviewer, location, description }');
    const { ledger, skipped } = recordLedger({ repoRoot, lows });
    try {
      fs.writeFileSync(out, `${JSON.stringify(ledger, null, 2)}\n`);
    } catch (error) {
      fail(`no se pudo escribir ${path.basename(out)} (${error.code || error.name})`);
    }
    result = { ok: true, written: ledger.entries.length, skipped };
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

if (require.main === module) main(process.argv.slice(2));

module.exports = { parseLocation, fingerprint, locateEntry, compareLedger, recordLedger };
